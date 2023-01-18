var browser = require('webextension-polyfill')
import tt from 'counterpart'
import { fetchEx } from 'golos-lib-js/lib/utils'

import { isFirefox } from './misc'

const getFolder = () => {
    const folder = '/keychain-'
    return folder + (isFirefox() ? 'firefox' : 'chrome')
}

async function httpGet(url, timeout = fetchEx.COMMON_TIMEOUT, responseType = 'text') {
    let res = await fetchEx(url, {
        timeout
    })
    if (responseType === 'arraybuffer') {
        res = await res.arrayBuffer()
    } else {
        res = await res.text()
    }
    return res
}

export async function checkUpdates(settings, timeout = 1000) {
    try {
        const version = browser.runtime.getManifest().version
        const url = new URL(
            '/api/keychain/' + (isFirefox() ? 'firefox' : 'chrome'),
            settings.app_updater.host
        )
        url.searchParams.append('latest', '1')
        url.searchParams.append('after', version)
        let res = await fetchEx(url, { timeout: 3000 })
        res = await res.json()
        if (res.status === 'ok' && res.data) {
            const versions = Object.entries(res.data)
            if (versions[0]) {
                const [ v, obj ] = versions[0]
                if (obj.exe) {
                    return {
                        version: v,
                        exe: obj.exe,
                        exeLink: new URL(obj.exe_url, settings.app_updater.host).toString(),
                        txt: obj.txt,
                        txtLink: new URL(obj.txt_url, settings.app_updater.host).toString(),
                        title: tt('app_update.notify') + ' - ' + v,
                    }
                } else {
                    console.error(versions[0])
                }
            }
        } else {
            console.error(res)
        }
    } catch (err) {
        console.error('checkUpdates', err)
    }
    return {}
}

function joinSlash(l, r) {
    if (!r.startsWith('/') && !l.endsWith('/')) {
        r = '/' + r
    }
    return l + r
}

export async function getChangelog(settings, txtLink) {
    try {
        let res = await httpGet(txtLink, 1000, 'arraybuffer')
        const decoder = new TextDecoder('windows-1251')
        res = decoder.decode(res)
        return res
    } catch (err) {
        console.error('getChangelog', err)
        return ''
    }
}
