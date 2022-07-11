import React from 'react'
import tt from 'counterpart'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Asset, AssetEditor } from 'golos-lib-js/lib/utils'
import { broadcast } from 'golos-lib-js'

import AmountField from '../elements/forms/AmountField'
import AssetBalance from '../elements/forms/AssetBalance'
import { loadStoredItems } from '../utils/storage'

class Transfer extends React.Component {
    back = () => {
        this.props.back()
    }

    balance = () => {
        const { account, sym } = this.props
        if (sym === 'GOLOS') {
            return Asset(account.balance)
        } else {
            return Asset(account.sbd_balance)
        }
    }

    balanceClick = (e, setFieldValue) => {
        e.preventDefault()
        setFieldValue('amount', AssetEditor(this.balance()))
    }

    validate = (values) => {
        const errors = {}
        const balance = this.balance()
        if (balance && values.amount.asset.gt(balance)) {
            errors.amount = tt('transfer_jsx.insufficient_funds')
        }
        return errors
    }

    onSubmit = async (values, { setSubmitting, setFieldError }) => {
        const from = this.props.account.name
        const { to, memo } = values
        const amount = values.amount.asset
        const { keys } = this.props
        try {
            await broadcast.transferAsync(keys.active, from, to, amount, memo)
        } catch (err) {
            setFieldError('memo', err.message || err)
            setSubmitting(false)
            return
        }
        await this.props.reload(false)
        setSubmitting(false)
    }

    render() {
        const { sym, keys } = this.props
        if (!keys.active) {
            return <div className='Transfer'>
                {tt('transfer_jsx.no_active')}<br/>
                <button className='button hollow' onClick={this.back}>
                    {tt('g.back')}
                </button>
            </div>
        }

        return <div className='Transfer'>
            <Formik initialValues={{
                    to: '',
                    amount: AssetEditor(0, 3, 'GOLOS'),
                    memo: ''
                }}
                validate={this.validate}
                onSubmit={this.onSubmit}
            >
            {({
                errors, values, isValid, setFieldValue
            }) => {
                const disabled = !values.amount.asset.amount || !isValid
                return <Form>
                    <h4>{tt('main_jsx.transfer')}</h4>
                    <div className='row' style={{marginBottom: '1rem'}}>
                        <div className='column small-12'>
                            <Field name='to' type='text'
                                placeholder={tt('transfer_jsx.to')}
                            />
                        </div>
                    </div>
                    <div className='row' style={{marginBottom: '1rem'}}>
                        <div className='column small-10'>
                            <AmountField 
                                placeholder={tt('transfer_jsx.amount')}
                            />
                        </div>
                        <div className='column small-2' style={{ paddingTop: '0.55rem', paddingLeft: '0.5rem'}}>
                            {sym}
                        </div>
                    </div>
                    <ErrorMessage name='amount' component='div' className='error' />
                    <div className='row' style={{marginBottom: '1rem'}}>
                        <AssetBalance onClick={e => this.balanceClick(e, setFieldValue)} balanceValue={this.balance().toString()} />
                    </div>
                    <div className='row' style={{marginBottom: '1rem'}}>
                        <div className='column small-12'>
                            <Field name='memo' type='text'
                                placeholder={tt('transfer_jsx.memo')}
                            />
                        </div>
                    </div>
                    <ErrorMessage name='memo' component='div' className='error' />
                    <div className='row'>
                        <button className='button hollow' onClick={this.back}>
                            {tt('g.back')}
                        </button>
                        <button className='button' disabled={disabled} type='submit'>
                            {tt('main_jsx.transfer')}
                        </button>
                    </div>
                </Form>
            }}
            </Formik>
        </div>
    }
}

export default Transfer
