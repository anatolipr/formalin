export type Condition = {
    fieldName: string;
    requiredValue: string;
}

export enum Type {
    text,
    number,
    textarea,
    radio,
    checkboxes,
    date,
    dropdown,
    title
}

export type Options {
    label: string;
    value: string;
}

export type FormField = {
    label: string;
    description: string;
    fieldName: string;
    required: boolean;
    type: Type;
    condition?: Condition;
    options?: Options;
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
    title: string;
    description: string;
    sections: FormSection[];
    buttons: Button[]
}