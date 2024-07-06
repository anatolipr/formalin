import Foo from 'avos/src/foo-store/foo.js'
import type { Condition } from './type/formConfigTypes';

type FormDataType = {[key:string]:string};

export const formData: Foo<FormDataType> = new Foo({}, 'formData')

import { form } from './stores'
import type { FormSection } from './type/formConfigTypes'
import { registerGlobal } from './util/globalHelper';

export function resetFormData(): void {
    const newFormData: FormDataType  = {};

    (form.get()?.sections || []).forEach((section: FormSection) => {
        section.fields.forEach(field => {
            if (!field.fieldName) {
                newFormData[field.fieldName] = field.value || ''
            }
        })
    });

    formData.set(newFormData)
}

form.subscribe(resetFormData);

registerGlobal('resetFormData', resetFormData);



export function updateFormData(fieldName: string, value: string): void {
    if (!fieldName) {
        return;
    }

    formData.update($formData => {
        $formData[fieldName] = value
        return $formData
    })
}

export function meetsCondition(condition: Condition | undefined, fd: any): boolean {
    if (!condition || !condition.fieldName) {
        return true;
    }

    const { fieldName, requiredValue } = condition;

    if (requiredValue?.startsWith('!')) {
        return formData.get()[fieldName] != requiredValue.substring(1);
    }

    return formData.get()[fieldName] == requiredValue;
}