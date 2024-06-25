import Foo from 'avos/src/foo-store/foo.js'
import type { Condition } from './type/formConfigTypes';

export const formData: Foo<{[key:string]:string}> = new Foo({}, 'formData')

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