import React, { Component, } from 'react';

class Expandable extends Component {
    state = {
        opened: false,
    };

    onToggleExpander = () => {
        this.setState({
            opened: !this.state.opened,
        })
    };

    render() {
        const { title, small, } = this.props;
        const { opened, } = this.state;
        const iconSize = small ? '1rem' : '2rem'
        return (<div className={'Expandable' + (opened ? ' opened' : '')}>
            <div className={'Expander' + (small ? ' small' : '')} onClick={this.onToggleExpander}>
                <img src={opened ? '/icons/chevron-up-circle.svg' : '/icons/chevron-down-circle.svg'}
                    style={{ width: iconSize, height: iconSize }}
                />
                <h5 style={{ paddingLeft: '0.5rem', }}>{title}</h5>
            </div>
            <div className='Expandable__content'>
                {this.props.children}
            </div>
        </div>);
    }
}

export default Expandable;
