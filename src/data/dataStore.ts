import Foo from 'avos/src/foo-store/foo.js'
import type { Condition, FormField } from './type/formConfigTypes';

type FormDataType = {[key:string]:string};

export const formData: Foo<FormDataType> = new Foo({}, 'formData')

import { form } from './stores'
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
                    
                    resetFormData();
                    callParent('updateForm', form.get());
                }

            } else {
                console.log('No form data found. Initializing');
                
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

export function meetsCondition(condition: Condition | undefined, fd: any, inputIndex: number | undefined): boolean {
    if (!condition || !condition.fieldName) {
        return true;
    }

    const { fieldName, requiredValue } = condition;

    const fieldToUse = inputIndex === undefined ? fieldName : `${fieldName}${inputIndex}`;

    const fieldValue = formData.get()[fieldToUse];

    if (requiredValue?.startsWith('!')) {
        return fieldValue != requiredValue.substring(1);
    }

    return fieldValue == requiredValue;
}

export function sectionRepeats(sectionIndex: number): number {

    const $form = form.get();

    const sectionId = $form.sections[sectionIndex].id;

    return parseInt(formData.get()[`_sr_${sectionId}`]) || 1;
}

export function addRepeat(sectionIndex: number): void {
    const $form = form.get();

    const sectionId = $form.sections[sectionIndex].id;
    const currentRepeats = sectionRepeats(sectionIndex);

    const repeats = currentRepeats + 1;

    setSectionRepeats(sectionId, repeats);
}

function setSectionRepeats(sectionId: string, repeats: number) {
    formData.update($formData => {
        $formData[`_sr_${sectionId}`] = repeats + '';
        return $formData;
    });
}

export function removeRepeat(sectionIndex: number, inputIndex: number) {
    
    if (! confirm(`Remove ${inputIndex}?`)) {
        return;
    }

    const $form = form.get();
    const fields: FormField[] = $form.sections[sectionIndex].fields;

    const sectionId = $form.sections[sectionIndex].id;
    const currentRepeats = sectionRepeats(sectionIndex);

    if (currentRepeats < 1) {
        return;
    }

    formData.update($formData => {

        let currentValues = [];

        for (let i = 1; i <= currentRepeats; i++) {
            let fieldValues: {[k: string]: string} = {};

            fields.filter(f => !!f.fieldName).forEach(field => {
                const fieldName = `${field.fieldName}${i}`;
                fieldValues[field.fieldName] = $formData[fieldName];
                delete $formData[fieldName];
            });
            currentValues.push(fieldValues);
        }

        currentValues.splice(inputIndex - 1, 1);

        for (let i = 0; i < currentValues.length; i++) {
            const fieldValues = currentValues[i];
            Object.keys(fieldValues).forEach(fieldName => {
                const newFieldName = `${fieldName}${i + 1}`;
                $formData[newFieldName] = fieldValues[fieldName];
            });
        }

        setSectionRepeats(sectionId, currentRepeats - 1);
        return $formData;
    });

    
}

export function getFormDataAsNestedJson() {
    const $form = form.get();
    const $formData = formData.get();

    const result: {[k: string]: any} = {};

    $form.sections.forEach(section => {

        if (!section.multi) {
            section.fields.filter(field => !!field.fieldName).forEach(field => {
                result[field.fieldName] = $formData[field.fieldName];
            })
        } else {

            const sectionId = section.id;
            const currentRepeats = sectionRepeats($form.sections.indexOf(section));

            let currentValues = [];

            for (let i = 1; i <= currentRepeats; i++) {
                let fieldValues: {[k: string]: string} = {};

                section.fields.filter(f => !!f.fieldName).forEach(field => {
                    const fieldName = `${field.fieldName}${i}`;
                    fieldValues[field.fieldName] = $formData[fieldName];
                });
                currentValues.push(fieldValues);
            }

            result[section.title] = currentValues;

        }

        
    });

    return result;
}