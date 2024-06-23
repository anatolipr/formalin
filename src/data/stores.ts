import Foo from 'avos/src/foo-store/foo.js'
import type {  Condition, Form, FormField, FormSection, Option, Type } from './type/formConfigTypes'
import { insertAtPosition } from './util/arrayUtil'

export const form: Foo<Form>  = new Foo({
    sections: <FormSection[]>[]
}, 'form')

function newField(): FormField {
    return {
        label: 'New field', 
        description: '', 
        type: 'text', 
        placeholder: '',
        fieldName: '', 
        required: false,
        value: ''
    }
}

function newSection(): FormSection {
    return {
        description: '', title: 'New section', fields: [
            newField()
        ]
    };
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

export function addField(sectionIndex: number, position?:number|undefined, value: FormField): void {
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
    form.update($form => {
        $form.sections.splice(sectionIndex, 1)
        return $form
    })
}

export function removeField(sectionIndex: number, fieldIndex: number) {
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

export function updateSectionCondition(sectionIndex: number, condition: Condition) {
    form.update($form => {
        $form.sections[sectionIndex].condition = condition
        return $form
    })
}

export function updateFieldLabel(sectionIndex: number, fieldIndex: number, label: string) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].label = label
        return $form
    })
}

export function conditionAsOption(sectionIndex: number, fieldIndex?: number): Option<string> {
    const $form = form.get()

    if (fieldIndex === undefined) {
        return {
            label: $form.sections[sectionIndex].condition?.fieldName || "",
            value: $form.sections[sectionIndex].condition?.requiredValue || ""
        } as Option<string>;
    } else {
        return {
            label: $form.sections[sectionIndex].fields[fieldIndex].condition?.fieldName || "",
            value: $form.sections[sectionIndex].fields[fieldIndex].condition?.requiredValue || ""
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

export function updateFieldOptions(sectionIndex: number, fieldIndex: number, options: Option<string>[]) {
    form.update($form => {
        $form.sections[sectionIndex].fields[fieldIndex].options = [...options]
        return $form
    })
}