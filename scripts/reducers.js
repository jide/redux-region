import { addons } from 'react/addons';
import { makeUnique } from './utils';

import { UPDATE_REGION } from './constants';

export function regions(state = {}, action) {
    const { type, ...payload } = action;

    if (type === UPDATE_REGION) {
        try {
            let emptyState = {};
            let nextState;
            let uniqueState;

            for (let regionId in payload) {
                if (typeof state[regionId] === 'undefined') {
                    emptyState[regionId] = [];
                }
            }

            nextState = addons.update({ ...emptyState, ...state }, payload);

            uniqueState = {};

            for (let regionId in nextState) {
                uniqueState[regionId] = makeUnique(nextState[regionId]);
            }

            return uniqueState;
        }
        catch(e) {
            console.error(e.message);

            return state;
        }
    }
    else {
        return state;
    }
}
