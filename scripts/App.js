import React, {Component} from 'react';
//import { createRedux } from 'redux';
import { Provider } from 'redux/react';

import regionReducer from './regionReducer';
import * as regionActions from './regionActions';

import Region from './Region';
import Badge from './Badge';

//const redux = createRedux({ regions: regionReducer });

import { createRedux, createDispatcher, composeStores } from 'redux';
import thunkMiddleware from 'redux/lib/middleware/thunk';

const store = composeStores({ regions: regionReducer });

function logMiddleware() {
    return next => action => {
        console.log('%c %s', 'white-space:pre', JSON.stringify(action, null, 4));
        return next(action);
    };
}

// We could use a middleware for cards :
// action OPEN_CARD could be short circuit for the stack in odl, while
// staying basic for others.
function animMiddleware(getState) {
    return next => action => {
        if (action.type === 'CUSTOM_POP') {
            const state = getState();

            if (!state.regions || !state.regions.aside) {
                return;
            }

            const index = state.regions.aside.length - 1;

            if (index === -1) {
                return;
            }

            const region = [];

            region[index] = {
                props: {
                    $merge: {
                        className: 'fade-out'
                    }
                }
            };

            const animState = {
                aside: region
            };

            const popState = {
                aside: {
                    $splice: [
                        [-1, 1]
                    ]
                }
            };

            setTimeout(() => {
                next({ type: 'UPDATE_REGION', state: popState });
            }, 1000);

            return next({ type: 'UPDATE_REGION', state: animState });
        }

        return next(action);
    };
}

// Create a Dispatcher function for your composite Store:
const dispatcher = createDispatcher(
  store,
  getState => [logMiddleware(), animMiddleware(getState), thunkMiddleware(getState)] // Pass the default middleware
);

// Create a Redux instance using the dispatcher function:
const redux = createRedux(dispatcher);

const set = {
    aside: {
        $set: [
            {
                component: Badge,
                props: {
                    key: 'somekey',
                    title: 'test',
                    country: 'France'
                }
            }
        ]
    }
};

const update = {
    aside: [
        {
            props: {
                $merge: {
                    key: 'somekey',
                    title: 'test title updated',
                    className: 'fade-out-in'
                }
            }
        }
    ]
};

const push = {
    aside: {
        $push: [
            {
                component: Badge,
                props: {
                    key: 'somekey2',
                    title: 'other test',
                    country: 'Japan',
                    className: 'fade-in'
                }
            }
        ]
    }
};

const pushNoKey = {
    aside: {
        $push: [
            {
                component: Badge,
                props: {
                    title: 'no key',
                    country: 'Any',
                    className: 'fade-in'
                }
            }
        ]
    }
};

const pop = {
    aside: {
        $splice: [
            [-1, 1]
        ]
    }
};

const clear = {
    aside: {
        $set: []
    },
    wrapper: {
        $set: null
    }
};

const func = {
    wrapper: {
        $set: {
            className: 'toggled',
            style: {
                color: 'red'
            }
        }
    }
};

export default class App extends Component {

    render() {
        return (
            <Provider redux={redux}>
                { () => (
                    <div>
                        <Region id='wrapper' className='wrapper'>
                            { state => (
                                <div className={ 'some-class ' + (state && state.className ? state.className : '') }>
                                    hello <span style={ state && state.style ? state.style : null }>world</span>
                                </div>
                            ) }
                        </Region>
                        <Region id='aside' className='aside'/>
                        <Region id='bottom' className='bottom'/>

                        <button onClick={ () => redux.dispatch(regionActions.set({ type: 'UPDATE_REGION', state: set })) }>Init</button>
                        <button onClick={ () => redux.dispatch(regionActions.set({ type: 'UPDATE_REGION', state: update })) }>Update</button>
                        <button onClick={ () => redux.dispatch(regionActions.set({ type: 'UPDATE_REGION', state: push })) }>Push</button>
                        <button onClick={ () => redux.dispatch(regionActions.set({ type: 'UPDATE_REGION', state: pushNoKey })) }>Push no key</button>
                        <button onClick={ () => redux.dispatch(regionActions.set({ type: 'UPDATE_REGION', state: pop })) }>Pop</button>
                        <button onClick={ () => redux.dispatch(regionActions.set({ type: 'UPDATE_REGION', state: clear })) }>Clear</button>
                        <button onClick={ () => redux.dispatch(regionActions.set({ type: 'UPDATE_REGION', state: func })) }>Func</button>

                        <button onClick={ () => redux.dispatch({ type: 'CUSTOM_POP' }) }>Custom pop</button>
                    </div>
                )}
            </Provider>
        );
    }
}
