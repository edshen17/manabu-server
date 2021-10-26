type StringKeyObject = { [index: string]: any };
type Await<T> = T extends PromiseLike<infer U> ? U : T;

export { StringKeyObject, Await };
