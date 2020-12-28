export type MaybePromise<T> = T | Promise<T>;
export type FromPromise<T> = T extends MaybePromise<infer Payload> ? Payload : unknown;