import React from 'react'
import tt from 'counterpart'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { createSession, } from '../utils/front/sessionFront'

const special = '!@#$%^&*()_+-="\'№;:.,?`~\\|/<>[]{}<>'

class CreateSecret extends React.Component {
    validate = (values) => {
        let errors = {}
        errors.phrase = this.validatePhrase(values.phrase, true)
        if (!errors.phrase) delete errors.phrase
        if (values.repeat) {
            errors.repeat = values.phrase === values.repeat ? undefined :
                tt('create_secret_jsx.secrets_are_not_same')
        }
        if (!errors.repeat) delete errors.repeat
        return errors
    }

    validatePhrase = (phrase, blur = false) => {
        let phraseError = undefined
        if (phrase.length > 512) {
            phraseError = tt('create_secret_jsx.too_long_secret')
        } else {
            let hasUpper = false, hasLatin = false, hasDigit = false
            for (let i = 0; i < phrase.length; ++i) {
                const c = phrase[i]
                const isUpper = c >= 'A' && c <= 'Z'
                const isLatin = c >= 'a' && c <= 'z'
                const isDigit = c >= '0' && c <= '9'
                const isSpecial = special.includes(c)
                if (isUpper) {
                    hasUpper = hasUpper || true
                } else if (isLatin) {
                    hasLatin = hasLatin || true
                } else if (isDigit) {
                    hasDigit = hasDigit || true
                } else if (!isSpecial) {
                    phraseError = tt('create_secret_jsx.non_latin')
                    break
                }
            }
            if (phrase.length < 8 || !hasUpper || !hasLatin || !hasDigit) {
                if (blur && !phraseError) phraseError = tt('create_secret_jsx.poor_secret')
            }
        }
        return phraseError
    }

    onSubmit = async (values) => {
        await createSession(values.phrase)
        this.props.goStep()
    }

    render() {
        return <div className='CreateSecret'>
            <p>
                {tt('create_secret_jsx.APPNAME_will_store_your_keys', { APPNAME: tt('APPNAME')})}
            </p>
            <p>
                {tt('create_secret_jsx.please_create_secret')}
            </p>

            <Formik initialValues={{
                    phrase: 'Password1',
                    repeat: 'Password1'
                }}
                validate={this.validate}
                onSubmit={this.onSubmit}
            >
            {({
                errors, values, isValid, handleChange
            }) => {
            const disabled = !values.phrase || !values.repeat || !isValid

            return <Form>
                <b>{tt('create_secret_jsx.your_secret')}</b>
                <Field type='password' name='phrase'
                />
                <ErrorMessage name='phrase' component='div' className='error' />

                <div style={{height: '1rem'}}/>
                <b >{tt('create_secret_jsx.reeenter_secret')}</b>
                <Field type='password' name='repeat'
                />
                <ErrorMessage name='repeat' component='div' className='error' />

                <button className='button' type='submit' disabled={disabled} style={{marginTop: '1rem'}}>
                    {tt('g.continue')}
                </button>
            </Form>}}
            </Formik>
        </div>
    }
}

export default CreateSecret
