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
['radio', 'checkboxes', 'dropdown'];

const typeSupportPlaceholder: Type[] = 
['text', 'number', 'textarea', 'date'];

export function supportsOptions(type: Type): boolean {
    return typeSupportOptions.includes(type);
}

export function supportsPlaceholder(type: Type): boolean {
    return typeSupportPlaceholder.includes(type);
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
    type: Type;
    condition?: Condition;
    options?: Option<string>[];
    value: string;
}


export type FormSection = {
    title: string;
    description: string;
    condition?: Condition;
    fields: FormField[]
}

export type Button = {
    type: string;
    label: string;
    enabled: boolean;
}

export type Form = {
    title?: string | undefined;
    description?: string;
    sections: FormSection[];
    buttons?: Button[]
}