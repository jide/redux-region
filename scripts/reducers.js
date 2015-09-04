import { addons } from 'react/addons';
import { makeUnique } from './utils';

import { UPDATE_REGION } from './constants';

export function regions(state = {}, action) {
    // todo: put payload in payload.update
    const { type, ...payload } = action;

    if (type === UPDATE_REGION) {
        let emptyState = {};
        let uniqueState = {};
        let nextState;

        for (let regionId in payload) {
            if (typeof state[regionId] === 'undefined') {
                emptyState[regionId] = [];
            }
        }

        try {
            nextState = addons.update({ ...emptyState, ...state }, payload);
        }
        catch(e) {
            console.warn(e.message);
            console.log(e.stack);
            return state;
        }

        for (let regionId in nextState) {
            uniqueState[regionId] = makeUnique(nextState[regionId]);
        }

        return uniqueState;
    }
    else {
        return state;
    }
}
