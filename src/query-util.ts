export function foldAllObjects<T>(query: Parse.Query,
                           akku: T,
                           f: (akku: T, objs: Parse.Object[]) => T,
                           options?: Parse.Query.FindOptions,
                           offset?: number): Parse.IPromise<T> {
    const MAX_LIMIT = 1000;
    offset = offset || 0;

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
    return foldAllObjects(query, [], (akku, objs) => akku.concat(objs), options);
}

export function countAllObjects(query: Parse.Query, options?: Parse.Query.FindOptions): Parse.IPromise<number> {
    return foldAllObjects(query, 0, (akku, objs) => akku + objs.length, options);
}