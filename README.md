### redux + React.addons.update + Region

```npm i && npm install```

A Region component :
````js
<Region id='aside'/>
````
One action :
````js
redux.dispatch(actions.set(payload))
````

Dispatches and result :
````js
{
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
}

<Region id='aside'>
    <Badge key='initial' title='Hello world' country='France'/>
</Region>
````

Then :
````js
{
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
}

<Region id='aside'>
    <Badge key='initial' title='Hello world, updated !' country='France' className: 'fade-out-in'/>
</Region>
````

Then :
````js
{
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
}

<Region id='aside'>
    <Badge key='initial' title='Hello world, updated !' country='France' className: 'fade-out-in'/>
    <Badge key='another' title='Some other item, with a key' country='Japan' className: 'fade-in'/>
</Region>
````
Because there is a key, if we dispatch it again it will move at the end and be updated.

Then :
````js
{
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
}

<Region id='aside'>
    <Badge key='initial' title='Hello world, updated !' country='France' className: 'fade-out-in'/>
    <Badge key='another' title='Some other item, with a key' country='Japan' className: 'fade-in'/>
    <Badge title='Some other item, with no key' country='Any' className: 'fade-in'/>
</Region>
````
Since there is no key, if we dispatch it again, another item will be pushed.

Then :
````js
{
    aside: {
        $splice: [
            [-1, 1]
        ]
    }
}

<Region id='aside'>
    <Badge key='initial' title='Hello world, updated !' country='France' className: 'fade-out-in'/>
    <Badge key='another' title='Some other item, with a key' country='Japan' className: 'fade-in'/>
</Region>
````

Finally :
````js
{
    aside: {
        $set: []
    }
}

<Region id='aside'/>
````

Crazy stuff :
````js
{
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
}

<Region id='aside'>
    <Badge key='initial' title='Hello world' country='France'>
        <small>child</small>
    </Badge>
</Region>
````

Maybe we want more control :
````js
{
    wrapper: {
        $set: {
            className: 'toggled',
            style: {
                color: 'red'
            }
        }
    }
}

<Region id='wrapper' className='wrapper'>
    { state => (
        <div className={ 'some-class ' + (state && state.className ? state.className : '') }>
            hello <span style={ state && state.style ? state.style : null }>world</span>
        </div>
    ) }
</Region>
````

What can we do with middlewares ? Animated pop (dirty implem) :
````js
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
````
