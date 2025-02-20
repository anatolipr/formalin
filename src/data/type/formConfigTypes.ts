export type Condition = {
    fieldName: string;
    requiredValue: string;
}

export type Type = 'text' | 'number' | 'textarea' | 'radios' | 'checkboxes' | 'date' | 'dropdown' | 'title';
export const TypeOptions: Option<Type>[] = [ 
    {
        label: 'Text',
        value: 'text'
    },
    {
        label: 'Number',
        value: 'number'
    },
    {
        label: 'Textarea',
        value: 'textarea'
    },
    {
        label: 'Radio',
        value: 'radios'
    },
    {
        label: 'Checkboxes',
        value: 'checkboxes'
    },
    {
        label: 'Date',
        value: 'date'
    },
    {
        label: 'Dropdown',
        value: 'dropdown'
    },
    {
        label: 'Title',
        value: 'title'
    }
]

//
const typeSupportOptions: Type[] = 
['radios', 'checkboxes', 'dropdown'];

const typeSupportPlaceholder: Type[] = 
['text', 'number', 'textarea', 'date'];

const typeSupportPattern: Type[] = 
['text', 'number', 'date'];

export function supportsOptions(type: Type): boolean {
    return typeSupportOptions.includes(type);
}

export function supportsValue(type: Type): boolean {
    return type !== 'title';
}

export function supportsPlaceholder(type: Type): boolean {
    return typeSupportPlaceholder.includes(type);
}

export function supportsPattern(type: Type): boolean {
    return typeSupportPattern.includes(type);
}

export type Option<T> = {
    label: string;
    value: T;
}

export type FormField = {
    label: string;
    description: string;
    fieldName: string;
    placeholder: string;
    required: boolean;
    validation: string;
    type: Type;
    condition?: Condition;
    options?: Option<string>[];
    value: string;
}


export type FormSection = {
    id: string;
    title: string;
    description: string;
    condition?: Condition;
    fields: FormField[];
    multi: boolean;
    key: string;
}

export type Button = {
    /** 
     * The type of button. Eg. 'submit', 'reset', 'cancel'
     */
    type: string;
    label: string;
    enabled: boolean;
    /**
     * The event that will be triggered when the button is clicked
     */
    value: string;
}

export type Form = {
    id?: string | undefined;
    title?: string | undefined;
    description?: string;
    sections: FormSection[];
    buttons?: Button[];
    css?: string;
}