import React from 'react'
import tt from 'counterpart'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import golos from 'golos-lib-js'

import AnotherKeys from '../modules/AnotherKeys'
import Expandable from '../elements/Expandable'
import LoadingIndicator from '../elements/LoadingIndicator'
import { encrypt } from '../utils/ciphering'
import { getSession, clearSession } from '../utils/front/sessionFront'
import { storeItems } from '../utils/storage'

class AddKeys extends React.Component {
    state={}

    async componentDidMount() {
        const secret = await getSession()
        this.setState({
            secret
        })
    }

    back = async () => {
        try {
            await clearSession()
        } catch (err) {
            alert('Cannot clear passphrase, contact us please, and do not use this passphrase!')
            return
        }
        this.props.goStep()
    }

    detectKeyType = async (values) => {
        let keyType = ''
        this.setState({
            keyType,
            detecting: true
        })
        if (values.account && values.key) {
            let loginRes = {}
            try {
                loginRes = await golos.auth.login(values.account, values.key)
            } catch (err) {
            }
            if (!loginRes.password) {
                if (loginRes.posting) {
                    keyType = 'posting'
                } else if (loginRes.active) {
                    keyType = 'active'
                } else if (loginRes.owner) {
                    keyType = 'owner'
                }
            } else {
                keyType = 'password'
            }
        }
        this.setState({
            keyType,
            detecting: false
        })
    }

    onChange = (e, handle, values) => {
        let newValues = {...values}
        newValues[e.target.name] = e.target.value
        this.detectKeyType(newValues)
        return handle(e)
    }

    onSubmit = async (values, { setSubmitting, setFieldError }) => {
        let loginRes = null
        try {
            loginRes = await golos.auth.login(values.account, values.key)
        } catch (err) {
            if (err === 'No such account') {
                setFieldError('account', tt('add_keys_jsx.no_account'))
            } else if (err === 'Account is frozen') {
                setFieldError('account', tt('add_keys_jsx.account_frozen'))
            } else {
                console.error(err)
                setFieldError('account', err.message || err)
            }
            return
        }
        if (!loginRes.password && loginRes.memo) {
            setFieldError('key', tt('add_keys_jsx.memo'))
            return
        }
        if (!loginRes.posting && !loginRes.active && !loginRes.owner) {
            setFieldError('key', tt('add_keys_jsx.wrong'))
            return
        }

        let acc = null
        try {
            acc = (await golos.api.getAccounts([values.account]))[0]
        } catch (err) {
            console.error(err)
            setFieldError('account', err.message || err)
            return
        }
        const setKey = (role) => {
            if (loginRes[role]) {
                bucket[role] = loginRes[role]
                return true
            }
            if (!values[role])
                return true
            const pub = golos.auth.wifToPublic(values[role])
            for (let ka of acc[role].key_auths) {
                if (ka[0] === pub) {
                    bucket[role] = values[role]
                    return true
                }
            }
            setFieldError(role, tt('add_keys_jsx.wrong'))
            return false
        }

        let bucket = {}
        bucket.name = values.account
        if (!setKey('active')) return
        if (!setKey('posting')) return
        if (!setKey('owner')) return

        const str = JSON.stringify(bucket)
        const { secret } = this.state
        const hex = encrypt(str, secret)
        try {
            await storeItems({ store: hex })
        } catch (err) {
            setFieldError('key', err.message || err)
            return
        }
        this.props.goStep()
    }

    render() {
        const { keyType, detecting } = this.state
        return <div style={{ margin: '1rem' }}>
            <Formik initialValues={{
                    account: '',
                    key: ''
                }}
                onSubmit={this.onSubmit}
            >
            {({
                errors, values, handleChange
            }) => {
                const disabled = detecting || !values.account || !values.key || errors.account || errors.key
                return <Form>
                <div style={{ marginBottom: '1rem'}}>
                    {tt('add_keys_jsx.enter_your_name')}
                    <Field type='text' name='account'
                        onChange={e => this.onChange(e, handleChange, values)}
                    />
                </div>
                <ErrorMessage name='account' component='div' className='error' />

                <div style={{ marginBottom: '1rem'}}>
                    {tt('add_keys_jsx.and_your_password')}
                    <Field type='password' name='key'
                        onChange={e => this.onChange(e, handleChange, values)}
                    />
                </div>
                <ErrorMessage name='key' component='div' className='error' />

                {detecting ? <LoadingIndicator type='circle' /> : null}
                {keyType ? (keyType === 'password' ?
                    <div style={{ marginBottom: '1rem' }}>
                        {tt('add_keys_jsx.it_is_a_password')}
                    </div> :
                    <div>
                        {tt('add_keys_jsx.it_is_a_KEY', {KEY: tt('add_keys_jsx.' + keyType)})}
                        <Expandable small={true} title={tt('add_keys_jsx.enter_more_keys')}>
                            <AnotherKeys keys={['posting', 'active', 'owner'].filter(key => key != keyType)} />
                        </Expandable>
                    </div>) : null}

                <button className='button hollow' onClick={this.back}>
                    {tt('g.back')}
                </button>
                <button className='button float-right' disabled={disabled} type='submit'>
                    {tt('g.continue')}
                </button>
            </Form>}}
            </Formik>
        </div>
    }
}

export default AddKeys
