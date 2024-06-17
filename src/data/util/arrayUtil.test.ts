import { expect, describe, it } from 'vitest'
import { insertAtPosition, moveElement } from './arrayUtil'

describe('insert at position tests', () => {
    it('should insert an element at a position', () => {
        const ar = [1,2,3]
        insertAtPosition(ar, 999, 1)
        expect(ar[1]).toBe(999)
        expect(ar).toEqual([1,999,2,3])
    })

    it('throws an error when out of bounds', () => {
        const ar = [1,2,3]
        expect(() => insertAtPosition(ar, 999, 100)).toThrowError('Invalid position')
    });
})

describe('moveElement functionality', () => {
    it('should move first element to become second', () => {
        const ar = [1,2,3]
        expect(moveElement(ar, 0, 1)).toEqual([2,1,3])
    })

    it('should throw an error if out of bounds', () => {
        const ar = [1,2,3]
        expect(() => {
            moveElement(ar, 0, 100)
        }).toThrowError()

        expect(() => {
            moveElement(ar, 100, 1)
        }).toThrowError()
    })
})




