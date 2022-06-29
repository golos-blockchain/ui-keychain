import React from 'react'
import tt from 'counterpart'
import { route } from 'preact-router'

import FoundationDropdownMenu from '../elements/FoundationDropdownMenu'
import { clearSession } from '../utils/front/sessionFront'
import { clearClients } from '../utils/clients'

class Header extends React.Component {
    signOut = async (e) => {
        e.preventDefault()
        try {
            await clearSession()
        } catch (err) {
            alert('Cannot clear passphrase, contact us please!')
            return
        }
        await clearClients()
        this.props.goStep()
    }

    openSettings = (e) => {
        e.preventDefault()
        route('/settings')
    }

	render() {
        const { account } = this.props

        let menu =[
            { value: tt('g.settings'), link: '#', onClick: this.openSettings },
            { value: tt('g.sign_out'), link: '#', onClick: this.signOut },
        ]

		return <div style={{margin: '1rem'}}>
            <img src='/golos.png' style={{width: '30px', verticalAlign: 'middle'}} />
            <span className='logo' style={{verticalAlign: 'middle'}}>
                Golos
            </span>
            {account ? <span className='float-right' style={{ paddingTop: '0.75rem' }}>
                <FoundationDropdownMenu
                    dropdownPosition='bottom'
                    dropdownAlignment='right'
                    label={account}
                    menu={menu}
                />
            </span> : null}
        </div>
	}
}

export default Header
