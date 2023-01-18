var browser = require('webextension-polyfill')
import React from 'react'
import tt from 'counterpart'

class UpdateCallout extends React.Component {
    shwoPopup = (e) => {
        e.preventDefault()
        const { updateState } = this.props
        const opts = {
            url: '/popup.html#/update/' +
                encodeURIComponent(updateState.txtLink) + '/' + encodeURIComponent(updateState.exeLink),
            width: 350,
            height: 400,
            type: 'popup',
        }
        browser.windows.create(opts)
    }
    render() {
        const { updateState } = this.props
        if (!updateState || !updateState.version) {
            return null
        }
        return <div className='UpdateCallout'>
            <a href='#' onClick={this.shwoPopup}>
                {updateState.title}
            </a>
        </div>
    }
}

export default UpdateCallout
