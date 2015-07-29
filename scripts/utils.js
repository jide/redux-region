export function uniqueBy(arr, getValue) {
    let unique = [];
    let found = {};

    arr.forEach((obj, i) => {
        let value = getValue(obj, i);

        if (!found[value]) {
          found[value] = true;
          unique.push(obj);
        }
    });

    return unique;
}

export function makeUnique(items) {
    if (Array.isArray(items)) {
        return uniqueBy(items, (item, i) => {
            return item.props && item.props.key ? item.props.key : i;
        });
    }
    else {
        return items;
    }
}
