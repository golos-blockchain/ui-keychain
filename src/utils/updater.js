var browser = require('webextension-polyfill')
import semver from 'semver'
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
            getFolder(),
            settings.app_updater.host
        ).toString()
        let res = await httpGet(url, timeout)
        const doc = document.createElement('html')
        doc.innerHTML = res
        let files = []
        let links = doc.getElementsByTagName('a')
        let maxItem
        if (links) {
            for (let i = 0; i < links.length && i < 50; ++i) {
                const link = links[i]
                const href = link.getAttribute('href')
                if (!href.startsWith('keychain')) continue
                const [ productName, _rest ] = href.split('-')
                if (!_rest) continue
                const verParts = _rest.split('.')
                const ext = verParts.pop()
                let curVer = verParts.join('.')
                if (verParts.length === 2) {
                    curVer += '.0'
                }
                if (semver.gte(version, curVer)) {
                    continue
                }
                if (!maxItem || semver.gt(curVer, maxItem.version)) {
                    maxItem = { version: curVer, txt: '' }
                    maxItem[ext === 'txt' ? 'txt' : 'exe'] = href
                } else if (semver.eq(curVer, maxItem.version)) {
                    maxItem[ext === 'txt' ? 'txt' : 'exe'] = href
                }
            }
        }
        if (maxItem && maxItem.exe) {
            return {
                version: maxItem.version,
                exe: maxItem.exe,
                exeLink: downloadLink(settings, maxItem.exe),
                txt: maxItem.txt,
                txtLink: downloadLink(settings, maxItem.txt),
                title: tt('app_update.notify') + ' - ' + maxItem.version,
            }
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

function downloadLink(settings, exeHref) {
    let url = exeHref
    const folder = getFolder()
    url = joinSlash(folder, url)
    url = new URL(url, settings.app_updater.host).toString()
    return url
}

export async function getChangelog(settings, updateRes) {
    try {
        let url = updateRes.txt
        url = joinSlash(getFolder(), url)
        url = new URL(url, settings.app_updater.host).toString()
        let res = await httpGet(url, 1000, 'arraybuffer')
        const decoder = new TextDecoder('windows-1251')
        res = decoder.decode(res)
        return res
    } catch (err) {
        console.error('getChangelog', err)
        return ''
    }
}
