export declare class SourceCache<TId, TSource> {
    private storage;
    hasItem(id: TId): boolean;
    getItem(id: TId): TSource | null;
    setItem(id: TId, source: TSource): number;
}
