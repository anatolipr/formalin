import { test, expect } from 'vitest'
import { insertAtPosition } from './arrayUtil'

test('array insert', () => {
    const ar = [1,2,3]
    insertAtPosition(ar, 999, 1)
    expect(ar[1]).toBe(999)
    expect(ar).toEqual([1,999,2,3])
});

test('array invalid position', () => {
    const ar = [1,2,3]
    expect(() => insertAtPosition(ar, 999, 100)).toThrowError('Invalid position')
});
