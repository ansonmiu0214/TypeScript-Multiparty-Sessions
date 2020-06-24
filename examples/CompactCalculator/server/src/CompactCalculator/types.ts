export type ToPartial<TObj> = {
    [Key in keyof TObj]: TObj[Key] | undefined
};

export type MaybePromise<T> = T | Promise<T>;

export type FromPromise<T> = T extends MaybePromise<infer Payload> ? Payload : unknown;