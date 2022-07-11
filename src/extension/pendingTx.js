export function addPendingTx(tx, host) {
    if (!window.currentTx) window.currentTx = 1
    if (!window.txs) window.txs = {}
    window.txs[window.currentTx] = { tx, host }
    return window.currentTx++
}

export function loadPendingTx(id) {
    return window.txs[id]
}

export function setSignedTx(id, signedTx) {
    window.txs[id].signedTx = signedTx
}

export function forbidTx(id) {
    window.txs[id].forbidden = true
}
