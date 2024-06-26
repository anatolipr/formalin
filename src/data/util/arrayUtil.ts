export function insertAtPosition<T>(array: T[], element: T, position: number) {
    if (position < 0 || position > array.length) {
        throw new Error("Invalid position");
    }
    array.splice(position, 0, element);
    return array;
}

export function moveElement<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
        throw new Error("Index out of bounds");
    }
    
    const element = array.splice(fromIndex, 1)[0];
    array.splice(toIndex, 0, element);
    return array;
}

export function moveElementUp<T>(array: T[], index: number): T[] {
    if (index <= 0) {
        return array;
    }
    return moveElement(array, index, index - 1);
}

export function moveElementDown<T>(array: T[], index: number): T[] {
    if (index >= array.length - 1) {
        return array;
    }
    return moveElement(array, index, index + 1);
}