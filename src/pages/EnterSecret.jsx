import React from 'react'
import tt from 'counterpart'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import UpdateCallout from '../elements/UpdateCallout'
import { createSession, } from '../utils/front/sessionFront'
import { loadStoredItems, removeItems } from '../utils/storage'
import { decrypt } from '../utils/ciphering'
import { clearClients } from '../utils/clients'

class EnterSecret extends React.Component {
    state = {}

    validate = (values) => {
        let errors = {}
        if (!values.phrase) {
            errors = tt('g.required')
        }
        return errors
    }

    onSubmit = async (values, { setFieldError }) => {
        const store = (await loadStoredItems()).store
        let dec
        try {
            dec = decrypt(store, values.phrase)
        } catch (err) {
            setFieldError('phrase', tt('enter_secret_jsx.wrong'))
            return
        }
        try {
            dec = JSON.parse(dec)
        } catch (err) {
            setFieldError('phrase', err.message || err)
            return
        }
        await createSession(values.phrase)
        this.props.goStep()
    }

    goForgot = (e) => {
        e.preventDefault()
        this.setState({
            forgot: true
        })
    }

    yesForgot = async (e) => {
        e.preventDefault()
        await removeItems('store')
        await clearClients()
        this.props.goStep()
    }

    noForgot = (e) => {
        e.preventDefault()
        this.setState({
            forgot: false
        })
    }

    render() {
        if (this.state.forgot) {
            return <div className='EnterSecret'>
                <p>
                    {tt('enter_secret_jsx.forgot_confirm')}
                </p>
                <div>
                    <span className='float-right'>
                        <button className='button' onClick={this.noForgot}>
                            {tt('g.no')}
                        </button>
                        <button className='button hollow' onClick={this.yesForgot}>
                            {tt('g.yes')}
                        </button>
                    </span>
                </div>
            </div>
        }
        return <div className='EnterSecret'>
            <UpdateCallout updateState={this.props.updateState} />
            <Formik initialValues={{
                    phrase: '',
                }}
                validate={this.validate}
                onSubmit={this.onSubmit}
            >
            {({
                isValid, values
            }) => {
                const disabled = !values.phrase || !isValid
                return <Form>
                <div style={{ marginBottom: '1rem'}}>
                    {tt('enter_secret_jsx.enter_secret')}
                    <Field type='password' name='phrase'
                    />
                </div>
                <ErrorMessage name='phrase' component='div' className='error' />

                <a href='#' onClick={this.goForgot}>
                    {tt('enter_secret_jsx.forgot')}
                </a>

                <button className='button float-right' disabled={disabled} type='submit'>
                    {tt('g.sign_in')}
                </button>
            </Form>}}
            </Formik>
        </div>
    }
}

export default EnterSecret
