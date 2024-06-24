import Foo from 'avos/src/foo-store/foo.js'

export const formData: Foo<{[key:string]:string}> = new Foo({}, 'formData')

export function updateFormData(fieldName: string, value: string): void {
    if (!fieldName) {
        return;
    }

    console.log('updateFormData', fieldName, value)
    formData.update($formData => {
        $formData[fieldName] = value
        return $formData
    })
}

