import type { Option } from "./formConfigTypes";


export function optionsToText(options: Option<string>[]): string {
    return options.map(op => `${op.label}: ${op.value}`).join(', ')
}

export function textToOptions(text: string): Option<string>[] {
    return text.split(',').map(pairStr => {
        const pair = pairStr.split(/:|=/)
        return {
            label: pair[0].trim(), 
            value: pair.length > 0 ? pair[1].trim() : ''
        }
    })
}

