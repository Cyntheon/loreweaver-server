export type PickPartial<T, K> = Partial<Pick<T, K>> & Omit<T, K>;

export type PickRequired<T, K> = Required<Pick<T, K>> & Omit<T, K>;

export type Override<A, B> = Omit<A, keyof B> & B;
