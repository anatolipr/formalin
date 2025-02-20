import Foo from 'avos/src/foo-store/foo.js'
import type {  Button, Form, FormField, FormSection, Option, Type } from './type/formConfigTypes'
import { insertAtPosition, moveElementDown, moveElementUp } from './util/arrayUtil'
import { copyToClipboard } from './util/clipboard'

export const form: Foo<Form> = new Foo<Form>({
    id:"formData",
    sections: <FormSection[]>[],
    buttons: <Button[]>[
        {type: 'submit', label: 'Submit', enabled: true, value: 'submit'}
    ]
}, 'form')


function newField(): FormField {
    return {
        label: 'New field', 
        description: '', 
        type: 'text', 
        placeholder: '',
        fieldName: '', 
        required: false,
        value: '',
        validation: ''
    }
}

export function updateFormId(id: string) {
    form.update($form => {
        $form.id = id
        return $form
    })
}

export function updateSectionMulti(sectionIndex: number, multi: boolean) {
    form.update($form => {
        $form.sections[sectionIndex].multi = multi
        return $form
    })
}

let sectionId = 0;
function getNextSectionId(): string {
    return 's' + sectionId++;
}

function newSection(): FormSection {
    return {
        id: getNextSectionId(),
        description: '', 
        title: 'New section',
        multi: false,
        key: '',
        fields: [
            newField()
        ]
    };
}

export function updateFormTitle(title: string) {
    form.update($form => {
        $form.title = title
        return $form
    })
}

export function updateFormDescription(description: string) {
    form.update($form => {
        $form.description = description
        return $form
    })
}

export function addSection(position?: number | undefined) {
    if (position !== undefined) {
        form.update($form => {
            insertAtPosition($form.sections, newSection(), position + 1)
            return $form
        })
    } else {
        form.update($form => {
            $form.sections.push(newSection())
            return $form
        })
    }
}


export function addEmptyField(sectionIndex:number, position?: number | undefined): void {
    addField(sectionIndex, position, newField())
}

export function addField(sectionIndex: number, position: number|undefined, value: FormField): void {
    if (position !== undefined) {
        form.update($form => {
            insertAtPosition($form.sections[sectionIndex].fields, newField(), position + 1)
            return $form
        })
    } else {
        form.update($form => {
            $form.sections[sectionIndex].fields.push(newField())
            return $form
        })
    }
}

export function updateFieldValue(sectionIndex: number, fieldIndex: number, value: string) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].value = value
        return $form
    })
}

export function updateFeildPlaceholder(sectionIndex: number, fieldIndex: number, placeholder: string) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].placeholder = placeholder
        return $form
    })
}

export function removeSection(sectionIndex: number) {
    const name = form.get().sections[sectionIndex].title
    if (!confirm(`Are you sure you want to delete the section "${name}"?`)) return;

    form.update($form => {
        $form.sections.splice(sectionIndex, 1)
        return $form
    })
}

export function removeField(sectionIndex: number, fieldIndex: number) {
    const name = form.get().sections[sectionIndex].fields[fieldIndex].label
    if (!confirm(`Are you sure you want to delete the field "${name}"?`)) return;
    
    form.update($form => {
        $form.sections[sectionIndex].fields.splice(fieldIndex, 1)
        return $form
    })
}

export function updateSectionTitle(sectionIndex: number, title: string) {
    form.update($form => {
        $form.sections[sectionIndex].title = title
        return $form
    })
}

export function updateSectionDescription(sectionIndex: number, description: string) {
    form.update($form => {
        $form.sections[sectionIndex].description = description
        return $form
    })
}

export function updateSectionKey(sectionIndex: number, key: string) {
    form.update($form => {
        $form.sections[sectionIndex].key = key
        return $form
    })
}

export function updateSectionCondition(sectionIndex: number, condition: Option<string>) {
    form.update($form => {
        $form.sections[sectionIndex].condition = 
        {fieldName: condition.value, requiredValue: condition.label}
        return $form
    })
}

export function copyDefinition() {
    const $form = form.get()
    copyToClipboard(JSON.stringify($form, null, 2))
    alert('Form definition copied to clipboard')
}

export function updateFieldLabel(sectionIndex: number, fieldIndex: number, label: string) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].label = label
        return $form
    })
}

export function conditionAsOption(sectionIndex: number, fieldIndex?: number, refresher?: any): Option<string> {
    const $form = form.get()

    if (fieldIndex === undefined) {
        return {
            value: $form.sections[sectionIndex].condition?.fieldName || "",
            label: $form.sections[sectionIndex].condition?.requiredValue || ""
        } as Option<string>;
    } else {
        
        return {
            value: $form.sections[sectionIndex].fields[fieldIndex].condition?.fieldName || "",
            label: $form.sections[sectionIndex].fields[fieldIndex].condition?.requiredValue || ""
        } as Option<string>;
    }
    
}

export function updateFieldCondition(sectionIndex: number, fieldIndex: number, condition: Option<string>) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].condition = 
        {fieldName: condition.value, requiredValue: condition.label}
        return $form
    })
}

export function updateFieldDescription(sectionIndex: number, fieldIndex: number, description: string) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].description = description
        return $form
    })
}

export function updateFieldType(sectionIndex: number, fieldIndex: number, type: Type) {    
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].type = type
        return $form
    })
}

export function updateFieldName(sectionIndex: number, fieldIndex: number, fieldName: string) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].fieldName = fieldName
        return $form
    })
}

export function updateFieldRequired(sectionIndex: number, fieldIndex: number, required: boolean) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].required = required
        return $form
    })
}

export function updateFieldValidation(sectionIndex: number, fieldIndex: number, validation: string) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].validation = validation
        return $form
    })
}

export function updateFieldOptions(sectionIndex: number, fieldIndex: number, options: Option<string>[]) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].options = [...options]
        return $form
    })
}

export function moveSectionUp(sectionIndex: number) {
    if (sectionIndex === 0) return
    form.update($form => {
        moveElementUp($form.sections, sectionIndex)
        return $form
    })
}

export function moveSectionDown(sectionIndex: number) {
    
    form.update($form => {
        moveElementDown($form.sections, sectionIndex)
        return $form
    })

    
}

export function moveFieldUp(sectionIndex: number, fieldIndex: number) {
    if (fieldIndex === 0) return
    form.update($form => {
        moveElementUp($form.sections[sectionIndex].fields, fieldIndex)
        return $form
    })
}

export function moveFieldDown(sectionIndex: number, fieldIndex: number) {
    form.update($form => {
        moveElementDown($form.sections[sectionIndex].fields, fieldIndex)
        return $form
    })
}

export function updateButtons(buttons: Button[]) {
    form.update($form => {
        $form.buttons = buttons
        return $form
    })
}

export function updateFormCss(css: string) {
    form.update($form => {
        $form.css = css
        return $form
    })
}