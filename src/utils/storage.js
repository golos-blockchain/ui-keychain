var browser = require('webextension-polyfill')

export async function storeItems(items) {
    if (typeof(browser) === 'undefined') {
        for (let [key, val] of Object.entries(items)) {
            localStorage.setItem(key, JSON.stringify(val))
        }
        return
    }
    return await browser.storage.local.set(items)
}

export async function loadStoredItems(keys) {
    if (typeof(browser) === 'undefined') {
        let res = {}
        if (Array.isArray(keys)) {
            for (let key of keys) {
                const val = localStorage.getItem(key)
                if (val)
                    res[key] = JSON.parse(val)
            }
        } else {
            const val = localStorage.getItem(keys)
            if (val)
                res[keys] = JSON.parse(val)
        }
        return res
    }
    return await browser.storage.local.get(keys)
}

export async function removeItems(items) {
    return await browser.storage.local.remove(items)
}
