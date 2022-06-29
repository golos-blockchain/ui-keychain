import React from 'react'
import tt from 'counterpart'

import LoadingIndicator from '../elements/LoadingIndicator'
import { getChangelog } from '../utils/updater'
import { withRouter } from '../utils/router'

class DownloadUpdate extends React.Component {
    state={loading: true}
    async componentDidMount() {
        const { settings } = this.props

        const text = await getChangelog(settings, { txt: this.getTxt() })
        this.setState({
            text,
            loading: false
        })
    }

    getTxt = () => {
        const { txt } = this.props.router.matches
        return txt
    }

    download = () => {
        let { exe_link } = this.props.router.matches
        exe_link = decodeURIComponent(exe_link)
        window.open(exe_link, '_blank')
    }

    render() {
        const { text } = this.state
        return <div className='DownloadUpdate'>
            {this.state.loading ? <LoadingIndicator type='circle' /> : <div>
                <div>{text}</div>
                <button className='button' style={{ marginTop: '2rem' }} onClick={this.download}>
                    {tt('app_update.download')}
                </button>
            </div>}
        </div>
    }

}

export default withRouter(DownloadUpdate)
