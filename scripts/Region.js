import React, { Component, PropTypes, addons } from 'react/addons';
import shallowEqual from 'react/lib/shallowEqual';
import { connect } from 'redux/react';
import Animate from 'rc-animate';

import { getKeys, findByKey } from './utils';

@connect((state, props) => ({
    region: state.regions && state.regions[props.id] || []
}))
export default class Region extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        region: PropTypes.oneOfType([PropTypes.element, PropTypes.object, PropTypes.array]).isRequired,
        types: PropTypes.object.isRequired,
        children: PropTypes.func,
        className: PropTypes.string,
        animate: PropTypes.shape(Animate.PropTypes),
        manualUpdate: PropTypes.func
    }

    static defaultProps = {
        className: '',
        animate: null
    }

    constructor(props, ...args) {
        super(props, ...args);

        this.state = {
            region: props.region
        };

        this.renderItem = ::this.renderItem;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.manualUpdate) {
            return false;
        }

        return !shallowEqual(this.props.children, nextProps.children) || !shallowEqual(this.state.region, nextState.region);
    }

    componentWillReceiveProps(nextProps) {
        if (!shallowEqual(this.state.region, nextProps.region)) {
            const setFinalState = () => {
                this.setState({
                    region: nextProps.region
                });
            };

            if (nextProps.manualUpdate) {
                nextProps.manualUpdate(this, nextProps.region);
            }
            else if (nextProps.animate && (nextProps.animate.transitionMoveAppear || nextProps.animate.transitionMoveLeave) && (Array.isArray(nextProps.region) && Array.isArray(this.props.region))) {
                const prevKeys = getKeys(this.props.region);
                const nextKeys = getKeys(nextProps.region);
                const beforeDisapearRegion = this.props.region.slice();
                const afterDisapearRegion = beforeDisapearRegion.slice();

                for (let i in prevKeys) {
                    const key = nextKeys[i];
                    const prevIndex = prevKeys.indexOf(key);
                    const nextIndex = nextKeys.indexOf(key);

                    if (key && (prevIndex !== -1 && nextIndex !== -1 && prevIndex !== nextIndex)) {
                        beforeDisapearRegion[prevIndex] = addons.update(beforeDisapearRegion[prevIndex], {
                            props: {
                                $merge: {
                                    style: {
                                        visibility: 'hidden',
                                        animationDuration: '0s',
                                        transitionDuration: '0s'
                                    }
                                }
                            }
                        });

                        afterDisapearRegion.splice(findByKey(afterDisapearRegion, key), 1);
                    }
                }

                this.setState({
                    region: beforeDisapearRegion
                }, () => {
                    this.setState({
                        region: afterDisapearRegion
                    }, () => {
                        nextProps.animate.transitionMoveAppear && !nextProps.animate.transitionMoveLeave ? setTimeout(setFinalState) : setFinalState();
                    });
                });
            }
            else {
                setFinalState();
            }
        }
    }

    renderItem(item, i = 0) {
        if (typeof item === 'object' && item.type) {
            let children;
            const RegisteredComponent = this.props.types[item.type] ? this.props.types[item.type] : item.type;

            if (item.props && item.props.children) {
                children = Array.isArray(item.props.children) ? item.props.children.map(this.renderItem) : this.renderItem(item.props.children);
            }

            return <RegisteredComponent key={ i } { ...(item.props || {}) } children={ children }/>;
        }
        else {
            return item;
        }
    }

    render() {
        let content;

        if (typeof this.props.children === 'function') {
            content = this.props.children(this.state.region);
        }
        else if (this.props.children) {
            content = this.props.children;
        }
        else if (Array.isArray(this.state.region)) {
            content = this.state.region.map(this.renderItem);
        }
        else if (this.state.region) {
            content = this.renderItem(this.state.region);
        }

        return (
            <div className={ this.props.className }>
                <Animate { ...this.props.animate }>
                    { content }
                </Animate>
            </div>
        );
    }

}
