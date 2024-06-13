export function insertAtPosition<T>(array: T[], element: T, position: number) {
    if (position < 0 || position > array.length) {
        throw new Error("Invalid position");
    }
    array.splice(position, 0, element);
    return array;
}