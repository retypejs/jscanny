export type None = null;
export type Some<T> = T;
export type Option<T> = Some<T> | None;

export const None = null;

export function Some<T>(value: Some<T>): Some<T> {
    return value;
}

export function Option<T>(value: Option<T>): Option<T> {
    return value;
}