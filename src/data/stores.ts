import Foo from 'avos/src/foo-store/foo.js'
import type { Button, Form, FormField, FormSection } from './type/formConfigTypes'
import { insertAtPosition } from './util/arrayUtil'

export const form: Foo<Form>  = new Foo({
    sections: <FormSection[]>[]
})

function newField(): FormField {
    return {
        label: 'New field', 
        description: '', 
        type: 'text', 
        fieldName: '', 
        required: false
    }
}

function newSection(): FormSection {
    return {
        description: '', title: 'New section', fields: [
            newField()
        ]
    };
}

export function addSection(position: number | undefined) {
    if (position !== undefined) {
        form.update($form => {
            insertAtPosition($form.sections, newSection(), position)
            return $form
        })
    } else {
        form.update($form => {
            $form.sections.push(newSection())
            return $form
        })
    }
}

export function addField(sectionIndex: number, position:number|undefined, value: FormField): void {
    if (position !== undefined) {
        form.update($form => {
            insertAtPosition($form.sections[sectionIndex].fields, newField(), position)
            return $form
        })
    } else {
        form.update($form => {
            $form.sections[sectionIndex].fields.push(newField())
            return $form
        })
    }
}

export function removeSection(sectionIndex: number) {
    form.update($form => {
        $form.sections[sectionIndex].fields.push(newField())
        return $form
    })
}
