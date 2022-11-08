//

export class SourceCache<TId, TSource> {
    private readonly storage: Array<{ id: TId; source: TSource }> = [];

    public hasItem(id: TId): boolean {
        return this.storage.some((item) => item.id === id);
    }

    public getItem(id: TId): TSource | null {
        return (this.storage.find((item) => item.id === id) || { source: null }).source;
    }

    public setItem(id: TId, source: TSource): void {
        this.storage.push({ id, source });
    }
}

/**
 * TODO: Maybe to indipendent LIB
 * TODO: Anotate
 * TODO: breakup into files
 * TODO: Write tests
 */
