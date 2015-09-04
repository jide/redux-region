export function makeUnique(items) {
    if (Array.isArray(items)) {
        const unique = [];
        const dict = {};
        const found = {};
        let item;
        let key;

        for (let i in items) {
            item = items[i];
            key = item.props && item.props.key ? item.props.key : i;
            dict[key] = item;
        }

        for (let i = items.length - 1; i >= 0; i--) {
        //for (let i = 0; i < items.length; i++) {
            item = items[i];
            if (item) {
                key = item.props && item.props.key ? item.props.key : i;

                if (!found[key]) {
                    //unique.push(dict[key]);
                    unique[i] = dict[key];
                    found[key] = true;
                }
            }
        }

        return unique.filter(i => !!i);
    }
    else {
        return items;
    }
}

export function findByKey(region, key) {
    for (let i in region) {
        if (region[i].props && region[i].props.key === key) {
            return i;
        }
    }

    return -1;
}

export function getKeys(region) {
    return region
        .filter(item => !!(item.props && item.props.key))
        .map(item => item.props.key);
}

export function diffRegions(fromRegion, toRegion) {
    return {
        removedIndexes: findRemoved(fromRegion, toRegion),
        addedIndexes: findRemoved(toRegion, fromRegion)
    };
}

export function findRemoved(fromRegion, toRegion) {
    const removed = [];

    //for (let id in fromRegions) {
        for (let i in fromRegion) {
            const item = fromRegion[i];

            if (item.props && item.props.key && findByKey(toRegion, item.props.key) === -1) {
                removed.push(i);
            }
        }
    //}

    return removed;
}
