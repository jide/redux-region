import { addons } from 'react/addons';
import { makeUnique } from './utils';

export default function regionReducer(state = {}, action) {
    if (action.type === 'UPDATE_REGION') {
        try {
            let regions = {};

            for (let regionId in action.state) {
                if (typeof state[regionId] === 'undefined') {
                    regions[regionId] = [];
                }
            }

            let nextState = addons.update({ ...regions, ...state }, action.state);

            let uniqueState = {};

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
