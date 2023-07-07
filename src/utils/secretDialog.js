var browser = require('./polyfill')()

export async function enterSecretDialog(host = '') {
    const opts = {
        url: 'popup.html#/enter_secret/' + host + '/true',
        width: 350,
        height: 400,
        type: 'popup',
    }

    delete window.esDlg
    window.esDlg = {}
    return new Promise((resolve, reject) => {
        let listener, interv, windowId

        const finalize = () => {
            browser.windows.onRemoved.removeListener(listener)
            clearInterval(interv)
            delete window.esDlg
        }

        listener = (wId) => {
            if (wId == windowId) {
                finalize()
                reject(new Error())
            }
        }
        browser.windows.create(opts).then(wId => {
            windowId = wId
        })

        interv = setInterval(() => {
            const { err, res } = window.esDlg
            if (err) {
                finalize()
                reject(new Error())
            } else if (res) {
                finalize()
                resolve(res)
            }
        }, 1000)
    })
}

export function setDialogResult(err, res) {
    window.esDlg.err = err
    window.esDlg.res = res
}
