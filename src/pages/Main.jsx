import React from 'react'
import golos, { formatter } from 'golos-lib-js'
import { Asset } from 'golos-lib-js/lib/utils'
import tt from 'counterpart'

import UpdateCallout from '../elements/UpdateCallout'
import FoundationDropdownMenu from '../elements/FoundationDropdownMenu'
import LoadingIndicator from '../elements/LoadingIndicator'
import LockButton from '../elements/LockButton'
import Donate from '../modules/Donate'
import Transfer from '../modules/Transfer'

class Main extends React.Component {
    state = {
        loading: true,
        loadingError: '',
        showTransfer: null,
        showDonate: null
    }

    load = async (fullReload = true) => {
        if (fullReload) {
            this.setState({
                loading: true
            })
        }

        const { account } = this.props
        let acc, dgp
        try {
            acc = await golos.api.getAccountsAsync([account])
            dgp = await golos.api.getDynamicGlobalPropertiesAsync()
        } catch (err) {
            this.setState({
                loading: false,
                loadingError: err.message || err
            })
            return
        }
        if (!acc[0]) {
            this.setState({
                loading: false,
                loadingError: 'no account ' + account
            })
            return
        }
        this.setState({
            loading: false,
            account: acc[0],
            dgp
        })
    }

    componentDidMount() {
        this.load()
    }

    componentDidUpdate(prevProps) {
        if (this.props.account !== prevProps.account)
            this.load()
    }

    showTransfer = (e, sym) => {
        e.preventDefault()
        this.setState({
            showTransfer: {
                sym
            }
        })
    }

    showDonate = (e) => {
        e.preventDefault()
        this.setState({
            showDonate: {
            }
        })
    }

    hideForms = () => {
        this.setState({
            showDonate: null,
            showTransfer: null
        })
    }

    render() {
        const { keys } = this.props
        const { loading, loadingError, dgp, account, showTransfer, showDonate } = this.state
        if (loading) {
            return <div className='Main__loading'>
                <LoadingIndicator type='circle' />
            </div> 
        }
        if (loadingError) {
            return loadingError
        }

        if (showTransfer) {
            return <Transfer account={account} keys={keys}
                sym={showTransfer.sym}
                reload={this.load}
                back={this.hideForms}
            />
        }

        if (showDonate) {
            return <Donate account={account} keys={keys}
                back={this.hideForms}
                reload={this.load}
            />
        }

        const { balance, sbd_balance,
            tip_balance, vesting_shares, savings_balance,
            savings_sbd_balance } = account

        let vesting = formatter.vestToGolos(Asset(vesting_shares),
            dgp.total_vesting_shares, dgp.total_vesting_fund_steem).toString()

        let tipMenu = [
            { value: tt('main_jsx.transfer'), link: '#', onClick: e => this.showDonate(e) },
        ]

        let golosMenu = [
            { value: tt('main_jsx.transfer'), link: '#', onClick: e => this.showTransfer(e, 'GOLOS') },
        ]

        let gbgMenu = [
            { value: tt('main_jsx.transfer'), link: '#', onClick: e => this.showTransfer(e, 'GBG') },
        ]

        return <div className='Main'>
            <UpdateCallout updateState={this.props.updateState} />
            <div className='Main__balance row'>
                <div className="column small-6 medium-6" style={{ paddingLeft: '1rem' }}>
                    {tt('main_jsx.tip').toUpperCase()}
                </div>
                <div className="column small-6 medium-6">
                    <FoundationDropdownMenu
                        className='Wallet_dropdown'
                        dropdownPosition='bottom'
                        dropdownAlignment='right'
                        label={tip_balance}
                        menu={tipMenu}
                    />
                </div>
            </div>
            <div className='Main__balance row zebra'>
                <div className="column small-6 medium-6" style={{ paddingLeft: '1rem' }}>
                    {tt('main_jsx.vs').toUpperCase()}
                </div>
                <div className="column small-6 medium-6">
                    {vesting}
                </div>
            </div>
            <div className='Main__balance row'>
                <div className="column small-6 medium-6" style={{ paddingLeft: '1rem' }}>
                    {tt('main_jsx.golos').toUpperCase()}
                </div>
                <div className="column small-6 medium-6">
                    <FoundationDropdownMenu
                        className='Wallet_dropdown'
                        dropdownPosition='bottom'
                        dropdownAlignment='right'
                        label={balance}
                        menu={golosMenu}
                    />
                </div>
            </div>
            <div className='Main__balance row zebra'>
                <div className="column small-6 medium-6" style={{ paddingLeft: '1rem' }}>
                    {tt('main_jsx.gold').toUpperCase()}
                </div>
                <div className="column small-6 medium-6">
                    <FoundationDropdownMenu
                        className='Wallet_dropdown'
                        dropdownPosition='bottom'
                        dropdownAlignment='right'
                        label={sbd_balance}
                        menu={gbgMenu}
                    />
                </div>
            </div>
            <div className='Main__balance row'>
                <div className="column small-6 medium-6" style={{ paddingLeft: '1rem' }}>
                    {tt('main_jsx.saving').toUpperCase()}
                </div>
                <div className="column small-6 medium-6">
                    {savings_balance}<br/>
                    {savings_sbd_balance}
                </div>
            </div>
            <LockButton goStep={this.props.goStep} />
        </div>
    }
}

export default Main
