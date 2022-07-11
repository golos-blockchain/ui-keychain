
var golosKeychain = {
    currentId: 1,

    requests: {},

    dispatchCustomEvent: function (name, data, callback) {
        this.requests[this.currentId] = callback 
        data = {
            id: this.currentId,
            name,
            data
        }
        const ev = new CustomEvent('gkc_request', {
            detail: data
        })
        document.dispatchEvent(ev)
        this.currentId++
    },
    login: function({ callback }) {
        this.dispatchCustomEvent('login', null, callback)
    },
    loggedIn: function({ callback }) {
        this.dispatchCustomEvent('loggedIn', null, callback)
    },
    logout: function({ callback }) {
        this.dispatchCustomEvent('logout', null, callback)
    },
    sign: function({ tx, callback }) {
        this.dispatchCustomEvent('sign', { tx }, callback)
    }
}

window.addEventListener('message', function (event) {
    if (event.source !== window) return

    if (event.data && event.data.type === 'gkc_response') {
        const response = event.data.response
        if (response && response.id) {
            const request = golosKeychain.requests[response.id]
            if (request) {
                if (response.err) {
                    request(response.err, null)
                } else {
                    request(null, response.data)
                }
                delete golosKeychain.requests[response.id]
            } else {
                console.warn('GKC - no request callback with ' + response.id)
            }
        } else {
            console.error('GKC - wrong response ', event)
        }
    }
}, false)
