import React from 'react'
import tt from 'counterpart'

import { Field, ErrorMessage } from 'formik'

class AnotherKeys extends React.Component {
    validate() {
        let errors = {}
        return errors
    }

    render() {
        const { keys } = this.props
        let items = []
        for (let key of keys) {
            items.push(<div>
                {tt('add_keys_jsx.' + key) + ':'}
                <Field name={key} type='password' />
                <ErrorMessage name={key} component='div' className='error' />
            </div>)
        }
        return <div>
            {items}
        </div>
    }
}

export default AnotherKeys
