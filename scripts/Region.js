import React, { Component, PropTypes } from 'react';
import shallowEqual from 'react/lib/shallowEqual';
import { connect } from 'redux/react';

@connect((state, props) => ({
    region: state.regions && state.regions[props.id] || []
}))
export default class Region extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        region: PropTypes.oneOfType([PropTypes.element, PropTypes.object, PropTypes.array]).isRequired,
        children: PropTypes.func,
        className: PropTypes.string
    }

    static defaultProps = {
        className: ''
    }

    constructor(...args) {
        super(...args);

        this.renderItem = ::this.renderItem;
    }

    shouldComponentUpdate(nextProps) {
        const { region, ...otherProps } = this.props;
        const { region: nextRegion, ...nextOtherProps } = nextProps;

        return !shallowEqual(region, nextRegion) || !shallowEqual(otherProps, nextOtherProps);
    }

    renderItem(item, i = 0) {
        return <item.component key={ i } { ...item.props }/>;
    }

    render() {
        let content = null;

        if (typeof this.props.children === 'function') {
            content = this.props.children(this.props.region);
        }
        else if (Array.isArray(this.props.region)) {
            content = this.props.region.map(this.renderItem);
        }
        else if (this.props.region) {
            content = this.renderItem(this.props.region);
        }

        return (
            <div className={ this.props.className }>
                { content }
            </div>
        );
    }

}
