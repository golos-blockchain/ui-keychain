import React from 'react'
import tt from 'counterpart'
import golos from 'golos-lib-js'
import { route, useRouter } from 'preact-router'

import Header from './modules/Header'
import CreateSecret from './pages/CreateSecret'
import EnterSecret from './pages/EnterSecret'
import AddKeys from './pages/AddKeys'
import Main from './pages/Main'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Sign from './pages/Sign'
import DownloadUpdate from './pages/DownloadUpdate'
import routing from './routing'

import { decrypt } from './utils/ciphering'
import { getSession, } from './utils/front/sessionFront'
import { loadStoredItems } from './utils/storage'
import { loadSettings } from './utils/settings'
import { initGolos } from './utils/initGolos'
import { checkUpdates } from './utils/updater'
import { OurRouter } from './utils/router'

tt.registerTranslations('en', require('./locales/en.json'))
tt.registerTranslations('ru', require('./locales/ru-RU.json'))

const locale = (navigator.language || navigator.userLanguage).split('-')[0]

tt.setLocale(locale === 'ru' ? 'ru' : 'en');
tt.setFallbackLocale('en');

class Popup extends React.Component {
    state = {
        loading: true,
        account: '',
    }

    async componentDidMount() {
        const settings = await loadSettings()
        await initGolos(settings)
        let { hash } = window.location
        hash = hash.substring(1)
        if (!hash.startsWith('/login/')
            && !hash.startsWith('/sign/')
            && !hash.startsWith('/update/')
            && !hash.startsWith('/enter_secret/')) {
            this.goStep()
        } else {
            this.setState({ loading: false, settings })
        }
    }

    goStep = async () => {
        const settings = await loadSettings()
        const updateState = await checkUpdates(settings)
        const session = await getSession()
        const store = (await loadStoredItems()).store
        let account = ''
        if (session) {
            if (store) {
                let dec = decrypt(store, session)
                dec = JSON.parse(dec)
                account = dec.name
                this.setState({
                    account,
                    updateState,
                    keys: { posting: dec.posting, active: dec.active }
                }, () => {
                    window.location.hash = ('/main')
                })
            } else {
                window.location.hash = ('/add_keys')
            }
        } else if (store) {
            window.location.hash = ('/enter_secret')
        } else {
            window.location.hash = ('/')
        }
        this.setState({
            loading: false,
            account,
            updateState
        })
    }

    render() {
        const stepProps = { goStep: this.goStep }
        const { account, keys, updateState } = this.state
        const { path } = useRouter()
        if (!golos.isNativeLibLoaded()) {
            console.warn('Native lib not yet loaded...')
            return <div className='Popup theme-light'>
            </div>
        }
        return <div className='Popup theme-light'>
            <Header account={path === '/settings' ? undefined : account} {...stepProps} />
            <div>
                {this.state.loading ? null
                    : <OurRouter>
                    <Main path={routing.main} account={account} keys={keys} updateState={updateState} {...stepProps} />
                    <AddKeys path={routing.add_keys} {...stepProps} />
                    <EnterSecret path={routing.enter_secret} {...stepProps} updateState={updateState} />
                    <Settings path={routing.settings} />
                    <Login path={routing.login} />
                    <Sign path={routing.sign} />
                    <DownloadUpdate path={routing.update} settings={this.state.settings} />
                    <CreateSecret path={routing.create_secret} {...stepProps} />
                </OurRouter>}
            </div>
        </div>
    }
}

export default Popup
