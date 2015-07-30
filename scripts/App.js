import React, {Component} from 'react';
import { Provider } from 'redux/react';
import { createRedux, createDispatcher, composeStores } from 'redux';
import thunkMiddleware from 'redux/lib/middleware/thunk';

import * as reducers from './reducers';
import * as actions from './actions';

import Region from './Region';
import Badge from './Badge';

const store = composeStores(reducers);

function logMiddleware() {
    return next => action => {
        console.log('%c %s', 'white-space:pre', JSON.stringify(action, null, 4));
        return next(action);
    };
}

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
                next({ type: 'UPDATE_REGION', ...popState });
            }, 1000);

            return next({ type: 'UPDATE_REGION', ...animState });
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
                    key: 'initial',
                    title: 'Hello world',
                    country: 'France'
                }
            }
        ]
    }
};

const merge = {
    aside: [
        {
            props: {
                $merge: {
                    key: 'initial',
                    title: 'Hello world, updated !',
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
                    key: 'another',
                    title: 'Some other item, with a key',
                    country: 'Japan',
                    className: 'fade-in'
                }
            }
        ]
    }
};

const pushBis = {
    aside: {
        $push: [
            {
                component: Badge,
                props: {
                    key: 'another',
                    title: 'Some other item, with a key',
                    country: 'Japan, updated',
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
                    title: 'Some other item, with no key',
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

const crazy = {
    aside: {
        $set: [
            {
                component: Badge,
                props: {
                    key: 'initial',
                    title: 'Hello world',
                    country: 'France',
                    children: [
                        <small>child</small>
                    ]
                }
            }
        ]
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

                        <button onClick={ () => redux.dispatch(actions.set(set)) }>Init</button>
                        <button onClick={ () => redux.dispatch(actions.set(merge)) }>Merge</button>
                        <button onClick={ () => redux.dispatch(actions.set(push)) }>Push has key</button>
                        <button onClick={ () => redux.dispatch(actions.set(pushBis)) }>Push same key</button>
                        <button onClick={ () => redux.dispatch(actions.set(pushNoKey)) }>Push no key</button>
                        <button onClick={ () => redux.dispatch(actions.set(pop)) }>Pop</button>
                        <button onClick={ () => redux.dispatch(actions.set(clear)) }>Clear</button>
                        <button onClick={ () => redux.dispatch(actions.set(func)) }>Func</button>
                        <button onClick={ () => redux.dispatch(actions.set(crazy)) }>Crazy</button>

                        <button onClick={ () => redux.dispatch({ type: 'CUSTOM_POP' }) }>Custom pop</button>
                    </div>
                )}
            </Provider>
        );
    }

}
