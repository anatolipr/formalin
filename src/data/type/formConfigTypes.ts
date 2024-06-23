export type Condition = {
    fieldName: string;
    requiredValue: string;
}

export type Type = 'text' | 'number' | 'textarea' | 'radio' | 'checkboxes' | 'date' | 'dropdown' | 'title';
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
        value: 'radio'
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

export type Option<T> = {
    label: string;
    value: T;
}

export type FormField = {
    label: string;
    description: string;
    fieldName: string;
    required: boolean;
    type: Type;
    condition?: Condition;
    options?: Option<string>[];
}


export type FormSection = {
    title: string;
    description: string;
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