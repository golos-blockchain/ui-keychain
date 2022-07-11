import React from 'react'
import tt from 'counterpart'
import { Formik, Field, } from 'formik'
import { route } from 'preact-router'

import { loadSettings, } from '../utils/settings'
import { storeItems } from '../utils/storage'
import { initGolos } from '../utils/initGolos'
import { withRouter } from '../utils/router'

class Settings extends React.Component {
    state = {}

    async componentDidMount() {
        const merged = await loadSettings()
        let initialValues = {
            current_node: merged.current_node
        }
        this.setState({
            initialValues,
            merged
        })
    }

    _renderNodes() {
        let fields = []
        const { merged } = this.state
        for (let i in merged.nodes) {
            let pair = merged.nodes[i]
            let { address, } = pair
            fields.push(
                <div style={{ display: 'block' }}>
                    <label style={{ textTransform: 'none', color: 'inherit', fontSize: 'inherit' }}>
                        <Field name='current_node'
                            type='radio'
                            value={address}
                        />
                        {address}
                    </label>
                </div>
            )
        }
        fields.push(
            <div style={{ display: 'block' }}>
                <label style={{ textTransform: 'none', color: 'inherit', fontSize: 'inherit' }}>
                    <Field name='current_node'
                        type='radio'
                        value={'custom'}
                    />
                    <Field name='custom_address'
                        type='text'
                        autoComplete='off'
                        style={{ width: '300px', display: 'inline-block' }}
                    />
                </label>
            </div>
        )
        return fields
    }

    _onSubmit = async (data) => {
        const { merged } = this.state
        let cfg = { ...merged }
        if (data.custom_address) {
            const exists = cfg.nodes.find(item => item.address === data.custom_address)
            if (!exists) {
                cfg.nodes.push({
                    address: data.custom_address
                })
            }
        }
        if (data.current_node === 'custom') {
            cfg.current_node = data.custom_address
        } else {
            cfg.current_node = data.current_node
        }
        await storeItems({ config: cfg })
        await initGolos(cfg)

        route('/main')
    }

    back = (e) => {
        e.preventDefault()
        route('/main')
    }

    render() {
        const { initialValues } = this.state
        if (!initialValues) {
            return null
        }
        return <div className='Settings'>
            <div className='row'>
                <div className='column small-12'>
                    <h4>
                        {tt('g.settings')}
                    </h4>
                </div>
            </div>
            <div className='secondary' style={{ marginBottom: '0.25rem' }}>
                {tt('app_settings.to_save_click_button')}
            </div>
            <Formik
                initialValues={initialValues}
                onSubmit={this._onSubmit}
            >
                {({
                    handleSubmit, isSubmitting, errors, values, handleChange,
                }) => (
                <form
                    onSubmit={handleSubmit}
                    autoComplete='off'
                >
                    <div className='row'>
                        <div className='column small-12' style={{paddingTop: 5}}>
                            {tt('app_settings.current_node')}
                            <div style={{marginBottom: '1.25rem'}}>
                                {this._renderNodes()}
                            </div>
                        </div>
                    </div>
                    <div className='row' style={{marginTop: 15}}>
                        <div className='small-12 columns'>
                            <div>
                                <button onClick={this.back} className='button hollow'>
                                    {tt('g.back')}
                                </button>
                                <button type='submit' className='button'>
                                    {tt('app_settings.save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}</Formik>
        </div>
    }
}

export default withRouter(Settings)
