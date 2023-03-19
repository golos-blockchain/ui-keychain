import React from 'react'
import tt from 'counterpart'
import { route } from 'preact-router'
import { auth, api } from 'golos-lib-js'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import Expandable from '../elements/Expandable'
import HostLink from '../elements/HostLink'
import AnotherKeys from '../modules/AnotherKeys'
import LoadingIndicator from '../elements/LoadingIndicator'
import { decrypt } from '../utils/ciphering'
import { hasClient, setConfirmTx } from '../utils/clients'
import { getSession, } from '../utils/front/sessionFront'
import { loadStoredItems } from '../utils/storage'
import { loadPendingTx, forbidTx, setSignedTx } from '../utils/front/pendingTxFront'
import { detectRoles } from '../utils/sign'
import { errorString } from '../utils/misc'
import { withRouter } from '../utils/router'

/*const loadStoredItems = async () => {
    return {store: '123'}
}
const getSession = async () => 'Password1'
const decrypt = () => {
    return { name: 'lex',
    active: '5K67PNheLkmxkgJ5UjvR8Nyt3GVPoLEN1dMZjFuNETzrNyMecPG' }
}
const loadPendingTx = async () => { return {
    tx: {
        operations: [['transfer', {
            from: 'lex',
            to: 'null',
            amount: '0.001 GOLOS',
            memo: 'jjj'
        }], ['vote', {
            from: 'lex',
            to: 'null',
            amount: '0.001 GOLOS',
            memo: 'jjj'
        }]]
    },
    host: 'cat.com'
}}
const forbidTx = async() => {}*/

class Sign extends React.Component {
    state = {
        loading: true
    }

    getId = () => {
        const { tx_id } = this.props.router.matches
        return tx_id
    }

    async componentDidMount() {
        const items = await loadStoredItems()
        const store = items.store
        const session = await getSession()
        if (store && !session) {
            route('/enter_secret')
            return
        }
        const decrypted = JSON.parse(decrypt(store, session))

        let pendingTx
        try {
            pendingTx = await loadPendingTx(this.getId())
        } catch (err) {
            alert('Pending tx loading error: ' + errorString(err))
            return
        }

        const { host } = pendingTx
        const client = await hasClient(host)

        let roles
        let missingRoles = new Set()
        try {
            roles = detectRoles(pendingTx.tx)
            for (const role of roles) {
                if (!decrypted[role])
                    missingRoles.add(role)
            }
        } catch (err) {
            alert('roles error: ' + errorString(err))
            return
        }

        this.setState({
            loading: false,
            store,
            decrypted,
            pendingTx,
            roles,
            missingRoles,
            client
        })
    }

    forbid = async (e) => {
        e.preventDefault()
        await forbidTx(this.getId())
        window.close()
    }

    validate = (values) => {
        let errors = {}
        const { missingRoles } = this.state
        for (let role of missingRoles) {
            if (!values[role]) errors[role] = tt('g.required')
        }
        return errors
    }

    onSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            const { decrypted } = this.state
            let invalid
            for (let role in values) {
                if (role === 'no_confirm_anymore') continue
                if (!values[role]) continue
                const res = await auth.login(decrypted.name, values[role])
                if (!res[role]) {
                    setFieldError(role, tt('sign_jsx.wrong_key'))
                    invalid = invalid || true
                }
            }
            if (!invalid) {
                const { roles, pendingTx } = this.state
                if (values.no_confirm_anymore) {
                    try {
                        const { host } = pendingTx
                        await setConfirmTx(host, false)
                    } catch (err) {
                        alert(err.toString())
                    }
                }
                const keys = new Set()
                for (let role of roles) {
                    keys.add(decrypted[role] || values[role])
                }
                const signedTx = auth.signTransaction(pendingTx.tx, [...keys])
                await setSignedTx(this.getId(), signedTx)
                window.close()
            }
        } catch (err) {
            alert(errorString(err))
            console.error(err)
        }
        setSubmitting(false)
    }

    render() {
        const { loading, store, pendingTx, missingRoles, client } = this.state
        if (loading) { return null }
        if (!store) {
            return <div className='Login'>
                {tt('login_jsx.error')}
            </div>
        }

        const { host, tx } = pendingTx

        let key = 1
        let ops = tx.operations.map(op => {
            return <Expandable key={++key} small={true} title={op[0]}>
                <pre>
                    {JSON.stringify(op[1], null, 2)}
                </pre>
            </Expandable>
        })

        return <div className='Sign'>
            <p>
                <HostLink host={host} />
                {' ' + tt('sign_jsx.wants_send_tx')}
            </p>
            {ops}
            <Formik initialValues={{
                    posting: '',
                    active: '',
                    owner: '',
                    no_confirm_anymore: !!client.notConfirmTx,
                }}
                validate={this.validate}
                onSubmit={this.onSubmit}
            >
            {({
                values, isValid, isSubmitting
            }) => {
                const disabled = !isValid
                return <Form>
                {missingRoles.size ?
                    <div style={{ marginBottom: '1rem' }}>
                        <p>{tt('sign_jsx.missing_roles')}</p>
                        <AnotherKeys keys={[...missingRoles]} />
                    </div> : null}
                <div className='input-group' style={{marginBottom: '1rem'}}>
                    <label>
                        <Field
                            className='input-group-field bold'
                            name='no_confirm_anymore'
                            type='checkbox'
                        />
                        {tt('sign_jsx.no_confirm_anymore')}
                        <HostLink host={host} />
                    </label>
                </div>
                {isSubmitting ? <LoadingIndicator type='circle' /> : <p>
                    <button className='button' type='submit' disabled={disabled}>
                        {tt('g.allow')}
                    </button>
                    <button className='button hollow' disabled={values.no_confirm_anymore} onClick={this.forbid}>
                        {tt('g.forbid')}
                    </button>
                </p>}
                </Form>}}
            </Formik>
        </div>
    }
}

export default withRouter(Sign)
