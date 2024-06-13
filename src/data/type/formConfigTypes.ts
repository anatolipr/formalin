export type Condition = {
    fieldName: string;
    requiredValue: string;
}

type Type = 'text' | 'number' | 'textarea' | 'radio' | 'checkboxes' | 'date' | 'dropdown' | 'title';
const TypeOptions: [Option<Type>] = [
    {
        label: 'Text',
        value: 'text'
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