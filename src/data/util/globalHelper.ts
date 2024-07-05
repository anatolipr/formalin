export function registerGlobal(name: string, value: any) {
    (window as any)[Symbol.for(name)] = value;
}