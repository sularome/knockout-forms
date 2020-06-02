export interface Left<T> {
    readonly _tag: 'Left'
    readonly left: T
}
  
export interface Right<U> {
    readonly _tag: 'Right'
    readonly right: U
}

export type Either<T, U> = Left<T> | Right<U>;

export function isLeft<T, U>(value: Either<T, U>): value is Left<T> {
    return value._tag === "Left";
}

export function left<T = never, U = never>(value: T): Either<T, U> {
    return { _tag: 'Left', left: value }
}

export function right<T = never, U = never>(value: U): Either<T, U> {
    return { _tag: 'Right', right: value }
}

export function map<T, U, V>(value: Either<T, U>, callback: (a: U) => V): Either<T, V> {
    return isLeft(value) ? value : right(callback(value.right))
}

export function chain<T, U, V>(value: Either<T, U>, callback: (a: U) => Either<T, V>): Either<T, V> {
    return isLeft(value) ? value : callback(value.right)
}