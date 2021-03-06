import React from 'react'
import { Field, ErrorMessage, } from 'formik'

class AmountField extends React.Component {
    _renderInput = ({ field, form }) => {
        const { value, ...rest } = field
        const props = this.props
        const { values, setFieldValue } = form
        return <input type='text' value={value.amountStr}
            {...rest} {...props} onChange={(e) => this.onChange(e, values, setFieldValue)}
            />
    }

    onChange = (e, values, setFieldValue) => {
        const newAmount = values.amount.withChange(e.target.value)
        if (newAmount.hasChange && newAmount.asset.amount >= 0) {
            setFieldValue('amount', newAmount)
        }
    }

    render() {
        const { placeholder, } = this.props
        return (<Field name='amount' type='text'
            placeholder={placeholder}
            autoComplete='off' autoCorrect='off' spellCheck='false'>
                {this._renderInput}
            </Field>)
    }
}

export default AmountField
