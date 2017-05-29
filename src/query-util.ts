export function foldAllObjects<S>(query: Parse.Query,
                           akku: S,
                           f: (akku: S, objs: Parse.Object[]) => S,
                           options?: Parse.Query.FindOptions,
                           offset: number = 0): Parse.IPromise<S> {
    const MAX_LIMIT = 1000;

    return query
        .limit(MAX_LIMIT)
        .skip(offset)
        .find(options)
        .then(objs => {
            let objsLength = objs.length;
            let newAkku = (objsLength > 0) ? f(akku, objs) : akku;
            if (objsLength < MAX_LIMIT) {
                return newAkku;
            } else {
                return foldAllObjects(query, newAkku, f, options, offset + MAX_LIMIT);
            }
        });
}

export function getAllObjects<T extends Parse.Object>(query: Parse.Query, options?: Parse.Query.FindOptions): Parse.IPromise<T[]> {
    return foldAllObjects<T[]>(query, [], (akku, objs: T[]) => akku.concat(objs), options);
}

export function countAllObjects(query: Parse.Query, options?: Parse.Query.FindOptions): Parse.IPromise<number> {
    return foldAllObjects(query, 0, (akku, objs) => akku + objs.length, options);
}