export function uniqueBy(arr, getValue) {
    const unique = [];
    const found = {};
    const length = arr.length;

    for (let i = length - 1; i >= 0; i--) {
        const obj = arr[i];
        const value = getValue(obj, i);

        if (!found[value]) {
          found[value] = true;
          unique.push(obj);
        }
    }

    return unique;
}

export function makeUnique(items) {
    if (Array.isArray(items)) {
        return uniqueBy(items, (item, i) => {console.log(i, item.props.key, item);
            return item.props && item.props.key ? item.props.key : i;
        });
    }
    else {
        return items;
    }
}
