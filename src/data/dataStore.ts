import Foo from 'avos/src/foo-store/foo.js'
import type { Condition } from './type/formConfigTypes';

type FormDataType = {[key:string]:string};

export const formData: Foo<FormDataType> = new Foo({}, 'formData')

import { addSection, form } from './stores'
import type { FormSection } from './type/formConfigTypes'
import { registerGlobal } from './util/globalHelper';
import { callParent, hasParentIntegration } from './util/parentIntegration';


if (hasParentIntegration()) {

    (async () => {

        const response = await callParent('initializeForm');
        
        console.log('initializeForm response was', response);
        
        try {
            if (!!((response || '').trim())) {

                const parsed = JSON.parse(response);
                if (parsed.sections && Array.isArray(parsed.sections)) {
                    form.set(parsed);
                } else {
                    addSection();
                    resetFormData();
                    callParent('updateForm', form.get());
                }

            } else {
                console.log('No form data found. Initializing');
                addSection();
                resetFormData();
                callParent('updateForm', form.get());
                console.log('Form data initialized', form.get());
            }

            form.subscribe((nv) => {
                callParent('updateForm', nv)
            });
        } catch (e) {
            console.error('Error parsing sections', e);
            alert('Something went wrong. Please try again later')
        }
        
    })()


} else {
    form.subscribe(resetFormData);
}

export function resetFormData(): void {
    const newFormData: FormDataType  = {};
    

    (form.get()?.sections || []).forEach((section: FormSection) => {
        section.fields.forEach(field => {
            if (field.fieldName) {
                newFormData[field.fieldName] = field.value || ''
            }
        })
    });

    formData.set(newFormData)
}



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