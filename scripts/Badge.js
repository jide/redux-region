import React, { Component } from 'react';

export default class Badge extends Component {

    static defaultProps = {
        title: 'test'
    }

    render() {
        return (
            <div style={ this.props.style } className={ 'plop ' + this.props.className }>
                <strong>{ this.props.title }</strong><br/>
                <em>{ this.props.country }</em>
                <br/>
                { this.props.children }
                <br/>
                <br/>
            </div>
        );
    }

}
