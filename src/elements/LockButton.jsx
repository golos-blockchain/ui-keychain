import React from 'react'
import tt from 'counterpart'

import { removeItems } from '../utils/storage'
import { clearClients } from '../utils/clients'

class LockButton extends React.Component {
    state = {
    }

    onClick = async e => {
        e.preventDefault()
        const { clicked } = this.state
        if (!clicked) {
            this.setState({
                clicked: true
            })
            this.resetter = setTimeout(() => {
                this.setState({
                    clicked: false
                })
            }, 5000)
            return
        }
        clearTimeout(this.resetter)
        await removeItems('store')
        await clearClients()
        this.props.goStep()
    }

    render() {
        return <button style={{ 'margin-left': '1rem'}} className='button alert hollow' title={tt('main_jsx.lock_desc')}
            onClick={this.onClick}>
            {this.state.clicked ? tt('main_jsx.lock_confirm') : tt('main_jsx.lock')}
        </button>
    }
}

export default LockButton
            