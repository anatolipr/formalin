import { test, expect } from 'vitest'
import { type Option } from './formConfigTypes'
import { optionsToText, textToOptions } from './formutil';

test('options to text', () => {
    const options: Option[] = [
        {
            label: 'Foo Label',
            value: 'foo'
        },
        {
            label: 'Bar Label',
            value: 'bar'
        }
    ];


    const text = optionsToText(options);

    expect(text).toBe('Foo Label: foo, Bar Label: bar')

})

test('text to options', () => {
    const options1 = textToOptions('Foo Label: foo, Bar Label: bar, Baz:');
    expect(options1.length).toBe(3)
    expect(options1[0].label).toBe('Foo Label')
    expect(options1[0].value).toBe('foo')

    expect(options1[2].label).toBe('Baz')
    expect(options1[2].value).toBe('')

})