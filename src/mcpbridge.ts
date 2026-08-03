// MCP bridge for formalin, following the same window.__mcpTools /
// window.__mcpSummary contract as js-bridge-mcp
// (see /Users/anatoli/Downloads/mcp-form-demo/packages/js-bridge-mcp), modeled
// after mindfoo's bridge (src/mcpbridge.ts) and htmlpaint.com's
// (src/mcpbridge.js).
//
// Like mindfoo's bridge, this file is imported directly at boot rather than
// pasted into DevTools - window.__mcpTools/__mcpSummary are always defined as
// soon as the app starts. An external js-bridge-mcp-style server still needs
// to inject its own embed-snippet connector script for a real MCP client to
// discover/call these; this file only sets up the page side of the contract.
//
// Every writer here calls the SAME store functions the UI's own Svelte
// components call (src/data/stores.ts, src/data/dataStore.ts) - never
// reimplements the mutation logic - so agent-driven edits are indistinguishable
// from a human using the editor.
import { form, updateFormCss } from './data/stores';
import {
	formData,
	resetFormData,
	getFormDataAsNestedJson,
	convertNestedJsonToFormDataJson,
} from './data/dataStore';
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
} from './data/type/formConfigTypes';

const VALID_TYPES: Type[] = TypeOptions.map((o) => o.value);

const MOCK_WORKFLOW_NOTE =
	'Context: formalin is a form BUILDER - it renders/edits a JSON form SCHEMA (sections/fields/ ' +
	'validation/conditional logic/buttons), separate from the FORM DATA (the actual values someone types ' +
	'into that rendered form). Reading/writing the whole schema is exactly two tools: get_form_schema and ' +
	'set_form_schema - there is no per-section/per-field add/update/delete tool. Reading/writing the whole ' +
	'filled-in form data is get_form_data/set_form_data (flat, matches the raw internal shape) plus ' +
	'get_form_data_nested/set_form_data_nested (nested, matches what the form would actually submit/POST - ' +
	'prefer the nested pair when an agent is "filling in the form" the way a human would, since it hides ' +
	'formalin\'s internal repeat-count bookkeeping). Plan the whole schema (or whole data) yourself, then ' +
	'call the get_* tool once for current state and the set_* tool once with the COMPLETE result you want ' +
	'afterward - never call a set_* tool once per field. ' +
	'GOTCHAS: (1) set_form_schema is a full replace, not a merge - omitted sections/fields are deleted. ' +
	'(2) Replacing the schema resets ALL form data back to each field\'s schema-defined default "value" ' +
	'(same as the UI: editing the schema always re-derives form data) - if you need to preserve or set ' +
	'specific answers, call set_form_data/set_form_data_nested AFTER set_form_schema, not before. ' +
	'(3) validation is plain HTML5: "required" is the required attribute, "validation" is a regex string ' +
	'used directly as the HTML pattern attribute (must match the ENTIRE field value to pass, standard ' +
	'HTML pattern semantics) - there is no custom validation language. (4) field.type gates which other ' +
	'fields are meaningful: only radios/checkboxes/dropdown use "options"; title never uses "value"; ' +
	'text/number/textarea/date use "placeholder"; only text/number/date use "validation" (pattern). Setting ' +
	'an irrelevant field is harmless but ignored by the UI - use validate_form_schema to catch this before ' +
	'writing. (5) conditional visibility (section.condition / field.condition) is {fieldName, requiredValue} ' +
	'- the section/field is shown only when the CURRENT VALUE of the field named fieldName equals ' +
	'requiredValue (a requiredValue starting with "!" means "does not equal" the rest of the string). ' +
	'fieldName must reference another field\'s fieldName elsewhere in the form (usually a radios/checkboxes/ ' +
	'dropdown field), and requiredValue must match one of that field\'s option "value"s. (6) a "multi" ' +
	'section is a REPEATING section (e.g. "add another email") - section.key (falling back to section.title ' +
	'if key is blank) is the group name used in the nested form-data shape and MUST be unique across ' +
	'sections; how many times it currently repeats lives in the form DATA, not the schema, and resets to 1 ' +
	'whenever the schema is replaced. (7) every field needs a non-empty, form-unique fieldName to be ' +
	'included in form data or referenced by any condition - a field with an empty fieldName is display-only ' +
	'and invisible to get_form_data/get_form_data_nested. ' +
	'If you have not already called describe_tools on this connection, call it first for this same context ' +
	'plus the exact schema/data JSON shapes referenced below as "above".';

(window as any).__mcpSummary =
	MOCK_WORKFLOW_NOTE +
	' EXACT FORM SCHEMA SHAPE: {"id"?: string, "title"?: string, "description"?: string, "css"?: string ' +
	'(raw CSS injected into the rendered form), "buttons"?: [{"type": string (e.g. "submit"/"reset"/ ' +
	'"cancel" - only "submit" actually triggers HTML form submission), "label": string, "enabled": ' +
	'boolean, "value": string (posted as the submit action)}], "sections": [{"id": string (stable, only ' +
	'used internally - keep an existing section\'s id unchanged when editing it, invent a short unique ' +
	'one like "s0"/"s1" for a new section), "title": string, "description": string, "multi": boolean ' +
	'(true = repeating section), "key": string (repeat-group name for multi sections, unique across the ' +
	'form; "" falls back to title), "condition"?: {"fieldName": string, "requiredValue": string} (show ' +
	'this section only when that field currently equals - or with a leading "!", does not equal - that ' +
	'value), "fields": [{"label": string, "description": string, "fieldName": string (form-unique, "" = ' +
	'not collected), "placeholder": string, "required": boolean, "validation": string (regex, used as the ' +
	'HTML pattern attribute - only meaningful for text/number/date), "type": "text"|"number"|"textarea"|' +
	'"radios"|"checkboxes"|"dropdown"|"date"|"title", "value": string (default/current value - meaningless ' +
	'for type "title"), "options"?: [{"label": string, "value": string}] (choices - only meaningful for ' +
	'radios/checkboxes/dropdown), "condition"?: {"fieldName": string, "requiredValue": string} (same rule ' +
	'as section condition, evaluated against this field\'s own current repeat instance when inside a multi ' +
	'section)}]}]}. ' +
	'EXACT FLAT FORM DATA SHAPE (get_form_data/set_form_data): {[key: string]: string} - every value is a ' +
	'string (HTML form semantics), keyed by fieldName for fields in a non-multi section, by ' +
	'"${fieldName}${repeatIndex}" (1-based) for fields inside a multi section, plus a bookkeeping key ' +
	'"_sr_${section.key||section.title}" holding the current repeat count as a string - do not invent other ' +
	'key shapes. ' +
	'EXACT NESTED FORM DATA SHAPE (get_form_data_nested/set_form_data_nested): fields from non-multi ' +
	'sections appear directly at the top level keyed by fieldName; each multi section appears as one ' +
	'top-level key named "section.key||section.title" holding an ARRAY of flat {fieldName: value} objects, ' +
	'one per repeat instance, in order - this is the natural "what would get submitted" shape and is what ' +
	'you should use when asked to "fill in the form". ' +
	'CSS: use get_form_css/set_form_css for anything styling-related ("make the fields narrower", "use a ' +
	'bigger font", etc.) instead of rewriting the whole schema just to change "css". form.css is injected ' +
	'as a single raw, GLOBAL, UNSCOPED <style> tag alongside the rendered form (via <svelte:element ' +
	'this={\'style\'}>{$form.css}</svelte:element>) - it is NOT scoped to the form the way a normal Svelte ' +
	'component\'s own <style> block would be, so selectors here can leak and affect other elements on the ' +
	'host page if written too broadly (e.g. a bare "input {...}" rule matches every input on the whole ' +
	'page, not just this form\'s). Always prefix rules with ".dynamic-form-container" to scope them to just ' +
	'this form. AVAILABLE SELECTORS (the actual class names the form renderer emits - there is no other ' +
	'hook, inputs/textareas/selects themselves carry NO class at all): ' +
	'".dynamic-form-container" = the outer <form> element itself; ' +
	'".dynamic-form-head" = the form title text, ".dynamic-form-main-description" = the form description ' +
	'text (both only rendered when the form has a title); ' +
	'".dynamic-form-section" = one section\'s wrapper (title + description + its fields); ' +
	'".dynamic-form-title" = a section\'s title text, ".dynamic-form-description" = a section\'s OR a ' +
	'field\'s description text (same class reused in both places - scope further if you need to target only ' +
	'one, e.g. ".dynamic-form-section > div > .dynamic-form-description" for the section-level one); ' +
	'".form-section-fields" = wrapper around one repeat instance\'s fields (there is exactly one per repeat ' +
	'for a multi section, one total otherwise); ' +
	'".dynamic-form-fields-wrap" = wrapper around all fields of one repeat instance - ALSO carries ' +
	'".dynamic-form-multi-field" when the section is "multi" (repeating), so ' +
	'".dynamic-form-fields-wrap.dynamic-form-multi-field" targets only repeating sections\' field groups; ' +
	'".dynamic-form-fields" = ONE field\'s own outer wrapper (label + input + description) - this wrapper is ' +
	'SHARED by every field type, and text/number/textarea/date/dropdown fields render very differently ' +
	'underneath it than radios/checkboxes do, so DO NOT put max-width/width on ".dynamic-form-fields" itself ' +
	'- it is NOT a safe generic "narrow this field" selector. Text/number/date fields render a single bare ' +
	'"<input>" (textarea/dropdown likewise a bare "<textarea>"/"<select>") with no wrapping element and no ' +
	'class of its own - narrow THOSE directly, e.g. ".dynamic-form-container .dynamic-form-fields ' +
	'input[type=text], .dynamic-form-container .dynamic-form-fields input[type=number], ' +
	'.dynamic-form-container .dynamic-form-fields input[type=date], .dynamic-form-container ' +
	'.dynamic-form-fields textarea, .dynamic-form-container .dynamic-form-fields select { max-width: 320px; ' +
	'width: 100%; }". Radios/checkboxes instead render ONE independent flex row per option - ' +
	'"<label style=\\"display:flex;align-items:center;gap:7px\\"><input type=radio-or-checkbox><div>{option ' +
	'label}</div></label>" repeated per option, with no shared grid/columns across options and no fixed ' +
	'width on the input to fight. If ".dynamic-form-fields" (or anything wrapping these rows) is given a ' +
	'max-width, every option row is squeezed, so each option\'s label <div> text wraps onto multiple lines ' +
	'well before the radio dot/checkbox itself shrinks at all (it is intrinsically sized and does not shrink) ' +
	'- the result LOOKS broken/misaligned (input appears squeezed into a narrow column next to wide wrapped ' +
	'label text) even though nothing actually errored; this is the most common mistake when asked to "make ' +
	'the fields narrower" on a form containing radios/checkboxes. To narrow radios/checkboxes specifically, ' +
	'cap width on the per-option row instead: ".dynamic-form-container .dynamic-form-fields label { ' +
	'max-width: 240px; }" (label text will still wrap inside that narrower row - there is no line-clamping). ' +
	'Default advice for a general "narrow the fields" request: only constrain input[type=text/number/date], ' +
	'textarea, and select via the rule above, and leave radios/checkboxes at their natural width unless ' +
	'explicitly asked to narrow those too. Whenever a form contains radios or checkboxes, mentally check (or ' +
	'ask to see a screenshot of) how they render after any width-related css change, since they respond to ' +
	'width constraints on this wrapper very differently than text-like fields do; ' +
	'".dynamic-form-field-label" = wrapper around one field\'s title + its actual input control; ' +
	'".dynamic-form-field-title" = one field\'s label text; ' +
	'".form-button" = every button, ".form-secondary-button" = ADDITIONALLY applied to every non-submit ' +
	'button (buttons whose "value" !== "submit", e.g. reset/cancel) so ".form-button:not(.form-secondary-' +
	'button)" targets only the submit button; ' +
	'".section-multi-button-add" = the "add" button on a repeating section. ' +
	'Note inputs already carry an inline "border: 1px solid gray" (higher specificity than a bare element ' +
	'selector but still beaten by any selector including a class), so border-related overrides need at ' +
	'least one class in the selector to reliably win.';

function readFormSchema(): string {
	return JSON.stringify(form.get());
}

function readFormData(): string {
	return JSON.stringify(formData.get());
}

function readFormDataNested(): string {
	return JSON.stringify(getFormDataAsNestedJson());
}

function validateFieldForType(field: Partial<FormField>, path: string, warnings: string[]): FormField {
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

function validateAndFillSection(section: Partial<FormSection>, index: number, warnings: string[]): FormSection {
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

function validateAndFillForm(parsed: Partial<Form>, warnings: string[]): Form {
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

function validateFormSchema({ formSchemaJson }: { formSchemaJson: string }): string {
	const parsed = JSON.parse(formSchemaJson);
	const warnings: string[] = [];
	const filled = validateAndFillForm(parsed, warnings);
	return JSON.stringify({ valid: true, warnings, normalized: filled });
}

function setFormSchema({ formSchemaJson }: { formSchemaJson: string }): string {
	const parsed = JSON.parse(formSchemaJson);
	const warnings: string[] = [];
	const filled = validateAndFillForm(parsed, warnings);
	form.set(filled);
	// form.subscribe(resetFormData) is wired in dataStore.ts and fires
	// synchronously from this .set() call, so form data is already
	// re-derived to schema defaults by the time this returns - no need to
	// call resetFormData() again here.
	const warningText = warnings.length > 0 ? ` WARNINGS: ${JSON.stringify(warnings)}` : '';
	return `form schema replaced (${filled.sections.length} section(s)). All form data was reset to schema defaults.${warningText}`;
}

function getFormCss(): string {
	return form.get().css || '';
}

function setFormCss({ css }: { css: string }): string {
	if (typeof css !== 'string') {
		throw new Error('css must be a string (pass "" to clear it)');
	}
	updateFormCss(css);
	return `form css updated (${css.length} char(s)). Remember it is injected as a single global, unscoped <style> tag - prefix selectors with ".dynamic-form-container" to avoid leaking rules onto the rest of the page.`;
}

function setFormData({ formDataJson }: { formDataJson: string }): string {
	const parsed = JSON.parse(formDataJson);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('formDataJson must be a flat JSON object of {fieldKey: stringValue} - see __mcpSummary for the exact key shape (fieldName, "${fieldName}${repeatIndex}", "_sr_${group}")');
	}
	const stringified: { [k: string]: string } = {};
	for (const [k, v] of Object.entries(parsed)) {
		stringified[k] = v === null || v === undefined ? '' : String(v);
	}
	formData.set(stringified);
	return `form data replaced (${Object.keys(stringified).length} key(s))`;
}

function setFormDataNested({ formDataJson }: { formDataJson: string }): string {
	const parsed = JSON.parse(formDataJson);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('formDataJson must be a JSON object shaped like get_form_data_nested\'s output - non-multi fields at the top level, each multi section as an array of {fieldName: value} objects under its key/title. See __mcpSummary for the exact shape.');
	}
	const flat = convertNestedJsonToFormDataJson(parsed);
	formData.set(flat);
	return `form data replaced from nested JSON (${Object.keys(parsed).length} top-level key(s))`;
}

function resetFormDataTool(): string {
	resetFormData();
	return 'form data reset to schema defaults (same as reloading the form)';
}

(window as any).__mcpTools = [
	{
		name: 'get_form_schema',
		description: `${MOCK_WORKFLOW_NOTE} Returns the WHOLE form schema (sections/fields/validation/` +
			'conditions/buttons/css) as JSON - the single read tool for the schema, same shape set_form_schema ' +
			'expects back. Call this once to see current state before planning any schema change.',
		params: {},
		fn: readFormSchema,
	},
	{
		name: 'set_form_schema',
		description: `${MOCK_WORKFLOW_NOTE} Replaces the WHOLE form schema from JSON - a full replace, not a ` +
			'merge or delta, so pass the COMPLETE schema you want to exist afterward (omitted sections/fields ' +
			'are deleted). Automatically resets ALL form data to each field\'s schema-defined default value ' +
			'(matching the UI\'s own behavior when the schema changes) - if you need specific answers filled ' +
			'in, call set_form_data or set_form_data_nested AFTER this. Fields are auto-filled with safe ' +
			'defaults for any omitted property (label/description/placeholder default to "", required ' +
			'defaults to false, validation defaults to "" i.e. no pattern). Returns non-fatal warnings (e.g. a ' +
			'dropdown with no options, or a condition referencing a fieldName that doesn\'t exist) rather than ' +
			'throwing, since these are legal-but-probably-wrong states the UI itself allows; call ' +
			'validate_form_schema first if you want to see warnings before committing the write.',
		params: { formSchemaJson: { type: 'string', description: 'JSON-encoded complete form schema - see __mcpSummary for the exact shape' } },
		example: {
			formSchemaJson: JSON.stringify({
				title: 'Contact form',
				sections: [
					{
						id: 's0',
						title: 'Your details',
						description: '',
						multi: false,
						key: '',
						fields: [
							{ label: 'Name', description: '', fieldName: 'name', placeholder: 'Jane Doe', required: true, validation: '', type: 'text', value: '' },
							{ label: 'Email', description: '', fieldName: 'email', placeholder: 'jane@example.com', required: true, validation: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$', type: 'text', value: '' },
						],
					},
				],
				buttons: [{ type: 'submit', label: 'Submit', enabled: true, value: 'submit' }],
			}),
		},
		fn: setFormSchema,
	},
	{
		name: 'validate_form_schema',
		description: `${MOCK_WORKFLOW_NOTE} Dry-run check of a candidate form schema WITHOUT writing it - ` +
			'fills in the same defaults set_form_schema would, and returns {valid, warnings, normalized} so an ' +
			'agent can inspect/fix problems (duplicate fieldNames, duplicate multi-section keys, dangling ' +
			'condition references, options set on a type that ignores them, etc.) before actually replacing ' +
			'the live form via set_form_schema. Throws instead of returning if the JSON is structurally invalid ' +
			'(not an object with a "sections" array, or a field with a missing/invalid "type").',
		params: { formSchemaJson: { type: 'string', description: 'JSON-encoded candidate form schema to check' } },
		example: { formSchemaJson: '{"sections":[{"title":"Section 1","multi":false,"key":"","fields":[{"label":"Name","fieldName":"name","type":"text","required":true,"value":"","description":"","placeholder":"","validation":""}]}]}' },
		fn: validateFormSchema,
	},
	{
		name: 'get_form_css',
		description: `${MOCK_WORKFLOW_NOTE} Returns just the form's "css" string (same value as ` +
			'get_form_schema().css). Prefer this + set_form_css over reading/writing the whole schema for any ' +
			'purely visual/styling request ("make the fields narrower", "increase the font size", "hide the ' +
			'add button", etc.) - it cannot accidentally touch sections/fields/data. See __mcpSummary for the ' +
			'exact list of CSS class selectors the form renderer emits.',
		params: {},
		fn: getFormCss,
	},
	{
		name: 'set_form_css',
		description: `${MOCK_WORKFLOW_NOTE} Replaces just the form's "css" string (leaves sections/fields/` +
			'buttons/data untouched, and does NOT reset form data the way set_form_schema does) - the tool to ' +
			'use for any purely visual/styling request. This CSS is injected as a single raw, GLOBAL, UNSCOPED ' +
			'<style> tag next to the form, so ALWAYS scope every rule under ".dynamic-form-container" (the ' +
			'form\'s own root element) to avoid leaking styles onto the rest of the host page. To narrow ' +
			'fields, target the actual input elements by type/tag (input[type=text/number/date], textarea, ' +
			'select) - do NOT put max-width/width on ".dynamic-form-fields" itself, since that wrapper is ' +
			'shared with radios/checkboxes and narrowing it squeezes their per-option rows, wrapping option ' +
			'label text instead of cleanly narrowing anything (see __mcpSummary for the full explanation and ' +
			'the correct radios/checkboxes selector if those need narrowing too). This is a full replace of ' +
			'the css string, not a delta - if the form already has custom css you want to keep, call ' +
			'get_form_css first and append to it rather than overwriting blindly. See __mcpSummary for the ' +
			'complete list of available class selectors (section/field/label/description/button wrappers) - ' +
			'inputs/textareas/selects themselves carry no class, only bare tag names, and already have an ' +
			'inline "border: 1px solid gray" so a border override needs a class in the selector to reliably ' +
			'win. If the form contains radios or checkboxes, verify how they render (e.g. via a screenshot) ' +
			'after any width-related change before reporting it done.',
		params: { css: { type: 'string', description: 'Complete replacement CSS string, scoped under .dynamic-form-container - see __mcpSummary for available selectors' } },
		example: { css: '.dynamic-form-container .dynamic-form-fields input[type=text],\n.dynamic-form-container .dynamic-form-fields input[type=number],\n.dynamic-form-container .dynamic-form-fields input[type=date],\n.dynamic-form-container .dynamic-form-fields textarea,\n.dynamic-form-container .dynamic-form-fields select { max-width: 320px; width: 100%; }' },
		fn: setFormCss,
	},
	{
		name: 'get_form_data',
		description: `${MOCK_WORKFLOW_NOTE} Returns the WHOLE form data in its raw FLAT internal shape ` +
			'({[key]: string}, including "_sr_*" repeat-count bookkeeping keys) - use get_form_data_nested ' +
			'instead if you just want "what would this form submit", this tool is for round-tripping the exact ' +
			'internal representation (e.g. to inspect current repeat counts).',
		params: {},
		fn: readFormData,
	},
	{
		name: 'set_form_data',
		description: `${MOCK_WORKFLOW_NOTE} Replaces the WHOLE form data from its raw FLAT internal shape - a ` +
			'full replace, not a merge. Prefer set_form_data_nested for "fill in the form as a human would" - ' +
			'use this one only when you specifically need to control repeat counts/keys directly (e.g. you ' +
			'already have a "_sr_*" value from get_form_data). All values are coerced to strings.',
		params: { formDataJson: { type: 'string', description: 'JSON-encoded flat {[key]: value} object - see __mcpSummary for the exact key shape' } },
		example: { formDataJson: '{"name":"Jane Doe","email":"jane@example.com"}' },
		fn: setFormData,
	},
	{
		name: 'get_form_data_nested',
		description: `${MOCK_WORKFLOW_NOTE} Returns the WHOLE form data in the NESTED shape matching what the ` +
			'rendered form would actually submit - non-multi fields at the top level by fieldName, each multi ' +
			'(repeating) section as an array of {fieldName: value} objects under its key/title. This is the ' +
			'shape to read/write when the task is "fill in this form" or "what did the user enter".',
		params: {},
		fn: readFormDataNested,
	},
	{
		name: 'set_form_data_nested',
		description: `${MOCK_WORKFLOW_NOTE} Replaces the WHOLE form data from the NESTED shape - the primary ` +
			'tool for "fill in the form as a human would": pass every non-multi field\'s value at the top level ' +
			'by fieldName, and for each multi (repeating) section pass an array of {fieldName: value} objects ' +
			'under that section\'s key/title (array length becomes the new repeat count for that section, ' +
			'replacing whatever it currently is). A full replace, not a merge - call get_form_schema first if ' +
			'unsure which fieldNames/section keys currently exist.',
		params: { formDataJson: { type: 'string', description: 'JSON-encoded nested form data - see __mcpSummary for the exact shape, and get_form_data_nested for a live example against the current schema' } },
		example: { formDataJson: '{"name":"Jane Doe","email":"jane@example.com"}' },
		fn: setFormDataNested,
	},
	{
		name: 'reset_form_data',
		description: `${MOCK_WORKFLOW_NOTE} Resets ALL form data back to each field's schema-defined default ` +
			'"value" and clears all repeat counts back to 1 - same as reloading the form fresh. Use this instead ' +
			'of hand-constructing an empty set_form_data_nested payload when the goal is simply "start over".',
		params: {},
		fn: resetFormDataTool,
	},
];
