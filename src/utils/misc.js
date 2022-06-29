
export async function delay(msec) {
    return new Promise(resolve => setTimeout(resolve, msec))
}

export function errorString(error) {
    return error.toString() + '\n\n' + (error.stack || '')
}

export function isFirefox() {
    return chrome.runtime.getURL('').startsWith('moz-extension://')
}

export function isChrome() {
    return chrome.runtime.getURL('').startsWith('chrome-extension://')
}
