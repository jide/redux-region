### redux + React.addons.update + Region

```npm install && npm start```

A Region component :
````js
import makeRegion from './makeRegion';
import Badge from './Badge';

// Register the components you want to be able to mount in Regions here
const Region = makeRegion({
    Badge, ...
});

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
                component: 'Badge',
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
    aside: {
        $push: [
            {
                component: 'Badge',
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
                component: 'Badge',
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

Nested children :
````js
{
    aside: {
        $set: [
            {
                component: 'Badge',
                props: {
                    key: 'initial',
                    title: 'Hello world',
                    country: 'France',
                    children: [
                        {
                            type: 'small',
                            props: {
                                children: 'I am a child'
                            }
                        }
                    ]
                }
            }
        ]
    }
}

<Region id='aside'>
    <Badge key='initial' title='Hello world' country='France'>
        <small>I am a child</small>
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

Renders are too slow ! Manual rendering :
````js
{
    wrapper: {
        $set: {
            className: 'toggled'
        }
    }
}

<Region id='manual' manualUpdate={ (self, state) => React.findDOMNode(self).classList.add(state.className) }>
    <div>hello</div>
</Region>
````

We want animations ! You can use CSS classes, or the builtin animation to animate enter / leave / change position
````js
<Region animate={ { transitionName: 'fade' } }/>
````
