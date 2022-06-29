var browser = require('webextension-polyfill')

export async function sendMessage(msg, data) {
    return await browser.runtime.sendMessage({
        msg,
        data
    })
}
