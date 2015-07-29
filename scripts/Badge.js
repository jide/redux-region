import React, { Component } from 'react';

export default class Badge extends Component {

    render() {
        return (
            <div className={ this.props.className }>
                <strong>{ this.props.title }</strong><br/>
                <em>{ this.props.country }</em>
                <br/>
                <br/>
            </div>
        );
    }

}
