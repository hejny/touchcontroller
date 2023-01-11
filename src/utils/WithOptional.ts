import { Omit } from './Omit';

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
// TODO: type RequiredOptions<TOptions, TDefault extends TOptions> = WithOptional<TOptions, keyof TDefault>;

/**
 * TODO: Use type-fest
 */
