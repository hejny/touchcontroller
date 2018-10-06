export class SourceCache<TId,TSource>{

    private storage: {id: TId,source:TSource}[] = [];

    hasItem(id: TId){
        return this.storage.some((item)=>item.id===id);
    }

    getItem(id: TId):TSource|null{
        return (this.storage.find((item)=>item.id===id)||{source:null}).source;
    }

    setItem(id: TId, source:TSource){
        return this.storage.push({id,source});
    }

}