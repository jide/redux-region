import React, {Component} from 'react';
import { Provider } from 'redux/react';
import { createRedux, createDispatcher, composeStores } from 'redux';
import thunkMiddleware from 'redux/lib/middleware/thunk';

import * as reducers from './reducers';
import * as actions from './actions';

import makeRegion from './makeRegion';

import Badge from './Badge';

const Region = makeRegion({
    Badge
});

// todo: put payload in payload.update or payload.region

// Update any part of the state
// + middleware for regions with keys handling ?
// actions.updateState({
//   region: {
//     aside: $set: []
//   }
// });

// region actions :
// put, remove, update, move

const store = composeStores(reducers);

function logMiddleware() {
    return next => action => {
        console.log('%c %s', 'white-space:pre', JSON.stringify(action, null, 4));
        return next(action);
    };
}

// Create a Dispatcher function for your composite Store:
const dispatcher = createDispatcher(
  store,
  getState => [logMiddleware(), thunkMiddleware(getState)] // Pass the default middleware //animMiddleware(getState), , updateByKeyMiddleware()
);

// Create a Redux instance using the dispatcher function:
const redux = createRedux(dispatcher);

const set = {
    aside: {
        $set: [
            {
                type: 'Badge',
                props: {
                    key: 'initial',
                    title: 'Hello world',
                    country: 'France'
                }
            }
        ]
    }
};

// Use a middleware to find index 
const merge = {
    aside: {
        $merge: [
            {
                props: {
                    key: 2,
                    title: 'Hello world, updated key 2 !'
                }
            }
        ]
    }
};

const push1 = {
    aside: {
        $push: [
            {
                type: 'Badge',
                props: {
                    key: 1,
                    title: 'Some other item, with a key 1',
                    country: 'Japan'
                }
            }
        ]
    }
};

const push2 = {
    aside: {
        $push: [
            {
                type: 'Badge',
                props: {
                    key: 2,
                    title: 'Some other item, with a key 2',
                    country: 'Japan, updated'
                }
            }
        ]
    }
};

const push3 = {
    aside: {
        $push: [
            {
                type: 'Badge',
                props: {
                    key: 3,
                    title: 'Some other item, with a key 3',
                    country: 'Any'
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

const nested = {
    aside: {
        $push: [
            {
                type: 'Badge',
                props: {
                    key: 'nested',
                    title: 'Hello world',
                    country: 'France',
                    children: [
                        {
                            type: 'div',
                            props: {
                                children: 'I am a child'
                            }
                        }
                    ]
                }
            }
        ]
    }
};

const manual = {
    manual: {
        $set: {
            className: 'toggled'
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
                        <Region id='aside' animate={ { transitionAppear: true, transitionMoveAppear: true, transitionMoveLeave: false, transitionName: 'fade' } } className='aside'/>
                        <Region id='manual' className='manual' manualUpdate={ (self, state) => React.findDOMNode(self).classList.add(state.className) }>
                            <div>hello</div>
                        </Region>
                        <div style={ { float: 'right' } }>
                            region A :<br/>
                            <button onClick={ () => redux.dispatch(actions.set(func)) }>Func</button><br/><br/>
                            region B :<br/>
                            <button onClick={ () => redux.dispatch(actions.set(set)) }>Set</button><br/>
                            <button onClick={ () => redux.dispatch(actions.set(push1)) }>Push 1</button><br/>
                            <button onClick={ () => redux.dispatch(actions.set(push2)) }>Push 2</button><br/>
                            <button onClick={ () => redux.dispatch(actions.set(push3)) }>Push 3</button><br/>
                            <button onClick={ () => redux.dispatch(actions.set(nested)) }>Push 4 with children</button><br/>
                            <button onClick={ () => redux.dispatch(actions.set(pop)) }>Pop</button><br/>
                            <button onClick={ () => redux.dispatch(actions.set(clear)) }>Clear both</button><br/>
                            <button onClick={ () => redux.dispatch(actions.set(manual)) }>Manual</button><br/>
                        </div>
                    </div>
                )}
            </Provider>
        );
    }

}
