var browser = require('webextension-polyfill')
import ApiController from './ApiController'
import { loadPendingTx, setSignedTx, forbidTx } from './pendingTx'

console.log('Background script running...')

browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const { msg, data } = request
    if (msg === 'saveSession') {
        window._C1 = data.c1
        window._C2 = data.c2
    } else if (msg === 'getSession') {
        return { c1: window._C1, c2: window._C2 }
    } else if (msg === 'clearSession') {
        delete window._C1
        delete window._C2
        return !window._C1 && !window._C2
    } else if (msg === 'loadPendingTx') {
        const txData = loadPendingTx(data.id)
        return txData
    } else if (msg === 'setSignedTx') {
        return setSignedTx(data.id, data.signedTx)
    } else if (msg === 'forbidTx') {
        return forbidTx(data.id)
    } else if (msg === 'apiRequest') {
        const controller = new ApiController()
        const res = await controller.doRequest(data, sender)
        if (res) {
            return res
        }
    } else {
        console.error('Unknown message', request, sender)
    }
})
