import React from 'react'

class HostLink extends React.Component {
    render() {
        const host = this.props.host
        const url = new URL('http://host')
        url.host = host
        const str = url.toString()
        return <a href={str} target='_blank' rel='noopener noreferer'>
            {host}
        </a>
    }
}

export default HostLink