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
            item = items[i];
            if (item) {
                key = item.props && item.props.key ? item.props.key : i;

                if (!found[key]) {
                    unique[i] = dict[key];
                    found[key] = true;
                }
            }
        }

        return unique;
    }
    else {
        return items;
    }
}
