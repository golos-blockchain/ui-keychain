import React from 'react'
import tt from 'counterpart'
import { route } from 'preact-router'

import HostLink from '../elements/HostLink'
import { decrypt } from '../utils/ciphering'
import { getSession, } from '../utils/front/sessionFront'
import { loadStoredItems } from '../utils/storage'
import { loginClient } from '../utils/clients'
import { withRouter } from '../utils/router'

class Login extends React.Component {
    state = {
        loading: true
    }

    async componentDidMount() {
        const store = (await loadStoredItems()).store
        const session = await getSession()
        if (store && !session) {
            const host = this.getHost()
            route('/enter_secret/' + encodeURIComponent(host))
            return
        }
        this.setState({
            loading: false,
            store,
            session
        })
    }

    getHost = () => {
        const { host } = this.props.router.matches
        return decodeURIComponent(host)
    }

    allow = async (e) => {
        e.preventDefault()
        const { store, session } = this.state
        const host = this.getHost()
        try {
            let dec = decrypt(store, session)
            dec = JSON.parse(dec)
            await loginClient(host, dec.name)
            window.close()
        } catch (err) {
            alert(err.message || err)
        }
    }

    forbid = (e) => {
        e.preventDefault()
        window.close()
    }

    render() {
        const { loading, store } = this.state
        if (loading) { return null }
        if (!store) {
            return <div className='Login'>
                {tt('login_jsx.error')}
            </div>
        }

        const host = this.getHost()

        return <div className='Login'>
            <p>
                <HostLink host={host} />
                {' ' + tt('login_jsx.wants_your_nick')}</p>
            <p>{tt('login_jsx.and_no_more')}</p>
            <button className='button' onClick={this.allow}>
                {tt('g.allow')}
            </button>
            <button className='button hollow' onClick={this.forbid}>
                {tt('g.forbid')}
            </button>
        </div>
    }
}

export default withRouter(Login)
