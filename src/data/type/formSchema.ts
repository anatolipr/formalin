// Canonical description of a form schema's field shape, kept next to
// formConfigTypes.ts so it can't silently drift from what the renderer
// (DynamicForm.svelte and friends) actually reads. Used by mcpbridge.ts to
// validate/fill-in agent-supplied form schemas before they ever reach the
// live `form` store - set_form_schema is a full replace straight into the
// store the UI renders from, so a malformed schema written directly would
// otherwise reach the renderer unchecked. This is also the single source of
// truth the MOCK_WORKFLOW_NOTE schema-shape prose in mcpbridge.ts should stay
// consistent with.
import {
	supportsOptions,
	supportsPlaceholder,
	supportsPattern,
	supportsValue,
	TypeOptions,
	type Form,
	type FormField,
	type FormSection,
	type Type,
} from './formConfigTypes';

export const VALID_TYPES: Type[] = TypeOptions.map((o) => o.value);

/**
 * Validates one field, filling in safe defaults for any omitted property.
 * Throws only for a missing/invalid "type" (the renderer switches on it and
 * has no fallback); every other problem is a non-fatal warning, since the
 * UI itself silently ignores an irrelevant field rather than rejecting it.
 */
export function validateFieldForType(field: Partial<FormField>, path: string, warnings: string[]): FormField {
	const type = field.type;
	if (type === undefined || !VALID_TYPES.includes(type)) {
		throw new Error(`${path}: "type" must be one of ${JSON.stringify(VALID_TYPES)}, got ${JSON.stringify(type)}`);
	}
	if (!supportsOptions(type) && field.options && field.options.length > 0) {
		warnings.push(`${path}: type "${type}" ignores "options" (only radios/checkboxes/dropdown use it)`);
	}
	if (supportsOptions(type) && (!field.options || field.options.length === 0)) {
		warnings.push(`${path}: type "${type}" normally needs a non-empty "options" array`);
	}
	if (!supportsPlaceholder(type) && field.placeholder) {
		warnings.push(`${path}: type "${type}" ignores "placeholder"`);
	}
	if (!supportsPattern(type) && field.validation) {
		warnings.push(`${path}: type "${type}" ignores "validation" (pattern) - only text/number/date use it`);
	}
	if (!supportsValue(type) && field.value) {
		warnings.push(`${path}: type "title" ignores "value"`);
	}
	return {
		label: field.label ?? '',
		description: field.description ?? '',
		fieldName: field.fieldName ?? '',
		placeholder: field.placeholder ?? '',
		required: !!field.required,
		validation: field.validation ?? '',
		type,
		condition: field.condition,
		options: field.options,
		value: field.value ?? '',
	};
}

/** Validates one section (recursively validating its fields), filling in safe defaults. */
export function validateAndFillSection(section: Partial<FormSection>, index: number, warnings: string[]): FormSection {
	const path = `sections[${index}]`;
	if (!Array.isArray(section.fields)) {
		throw new Error(`${path}.fields must be an array`);
	}
	const fields = section.fields.map((f, i) => validateFieldForType(f, `${path}.fields[${i}]`, warnings));

	const fieldNames = fields.map((f) => f.fieldName).filter(Boolean);
	const dupes = fieldNames.filter((n, i) => fieldNames.indexOf(n) !== i);
	if (dupes.length > 0) {
		warnings.push(`${path}: duplicate fieldName(s) ${JSON.stringify([...new Set(dupes)])} - only the last value for each will round-trip through form data`);
	}

	return {
		id: section.id ?? `s${index}`,
		title: section.title ?? '',
		description: section.description ?? '',
		condition: section.condition,
		multi: !!section.multi,
		key: section.key ?? '',
		fields,
	};
}

/**
 * Validates a whole candidate form schema (recursively validating its
 * sections/fields), filling in safe defaults and collecting non-fatal
 * warnings (dangling condition references, duplicate repeat-group keys,
 * etc.). Throws only when the schema is structurally invalid (not shaped
 * like {"sections": [...]}, or a field with a missing/invalid "type").
 */
export function validateAndFillForm(parsed: Partial<Form>, warnings: string[]): Form {
	if (!parsed || !Array.isArray(parsed.sections)) {
		throw new Error('formSchemaJson must be shaped like {"sections": [...], ...} - the COMPLETE new form, not a delta. See __mcpSummary for the exact shape.');
	}
	const sections = parsed.sections.map((s, i) => validateAndFillSection(s, i, warnings));

	const groupKeys = sections.filter((s) => s.multi).map((s) => s.key || s.title);
	const dupeGroups = groupKeys.filter((k, i) => groupKeys.indexOf(k) !== i);
	if (dupeGroups.length > 0) {
		warnings.push(`duplicate repeat-group key/title ${JSON.stringify([...new Set(dupeGroups)])} across multi sections - their form data would collide`);
	}

	const allFieldNames = sections.flatMap((s) => s.fields.map((f) => f.fieldName)).filter(Boolean);
	for (const s of sections) {
		const conds = [s.condition, ...s.fields.map((f) => f.condition)].filter(Boolean) as { fieldName: string }[];
		for (const c of conds) {
			if (!allFieldNames.includes(c.fieldName)) {
				warnings.push(`condition references fieldName "${c.fieldName}" which does not exist anywhere in the form`);
			}
		}
	}

	return {
		id: parsed.id,
		title: parsed.title,
		description: parsed.description,
		css: parsed.css,
		buttons: parsed.buttons,
		sections,
	};
}
