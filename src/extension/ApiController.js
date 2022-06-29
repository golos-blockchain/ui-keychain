var browser = require('webextension-polyfill')

import { hasClient, logoutClient } from '../utils/clients'
import { addPendingTx, loadPendingTx } from './pendingTx'
import { delay, isFirefox } from '../utils/misc'

class ApiController {
    getSenderHost(sender) {
        if (!sender) throw new Error('No sender')
        let { url } = sender
        if (!url) throw new Error('No senderURL')
        try {
            url = new URL(url)
        } catch (err) {
            throw new Error('Cannot parse sender URL: ' + url)
        }
        let { host, protocol } = url
        if (protocol === 'file:') {
            return 'localfile'
        } else if (!host) {
            throw new Error('No host in sender URL: ' + url)
        }
        const parts = host.split('.')
        if (parts[0] === 'www') {
            host = parts.slice(1).join('.')
        }
        return host
    }

    returnError(err, request) {
        return { id: request.id, err }
    }

    returnResponse(data, request) {
        return { id: request.id, data }
    }

    async doRequest(request, sender) {
        let res = null
        try {
            const host = this.getSenderHost(sender)

            const { name, data } = request
            if (name === 'login') {
                res = await this.login(request, host)
            } else if (name === 'loggedIn') {
                res = await this.loggedIn(request, host)
            } else if (name === 'logout') {
                res = await this.logout(request, host)
            } else if (name === 'sign') {
                res = await this.sign(request, host)
            } else {
                throw new Error('Unknown request')
            }
        } catch (err) {
            return this.returnError(err, request)
        }
        return this.returnResponse(res, request)
    }

    async login(request, host) {
        const opts = {
            url: 'popup.html#/login/' + encodeURIComponent(host),
            width: 350,
            height: 400,
            type: 'popup',
        }
        if (isFirefox()) {
            opts.allowScriptsToClose = true
        }
        browser.windows.create(opts)
        return null
    }

    async loggedIn(request, host) {
        return await hasClient(host)
    }

    async logout(request, host) {
        await logoutClient(host)
        return true
    }

    async sign(request, host) {
        const { data } = request
        const { tx } = data
        const id = addPendingTx(tx, host)
        const opts = {
            url: 'popup.html#/sign/' + id,
            width: 350,
            height: 400,
            type: 'popup',
        }
        if (isFirefox()) {
            opts.allowScriptsToClose = true
        }
        browser.windows.create(opts)
        for (let i = 0; i < 60; ++i) {
            console.log('Checking pending tx: ' + id)
            const data = loadPendingTx(id)
            if (data.signedTx) {
                return data.signedTx
            } else if (data.forbidden) {
                return false
            }
            await delay(500)
        }
        return false
    }
}

export default ApiController
