var browser = require('webextension-polyfill')
console.log('CS Start')

const inject = () => {
    try {
        const script = document.createElement('script')
        script.id = 'golos_keychain_inpage'
        script.src = browser.runtime.getURL('./inpage_keychain.js')
        const parent = document.head || document.documentElement
        parent.insertBefore(script, parent.children[0])
    } catch (e) {
        console.error('GKS - Cannot inject script', e)
    }
}

inject()

document.addEventListener('gkc_request', async (request) => {
    // Chrome JSON serialization
    const message = { ...request.detail }
    if (message.data && message.data.tx) {
        message.data.tx.expiration = message.data.tx.expiration.toISOString().split('.')[0]
    }
    const res = await browser.runtime.sendMessage({
        msg: 'apiRequest',
        data: message,
    })
    window.postMessage({
        type: 'gkc_response',
        response: res
    })
})
