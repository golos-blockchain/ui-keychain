import { sendMessage } from './common'

export async function loadPendingTx(id) {
    const txData = await sendMessage('loadPendingTx', {
        id,
    })
    return txData
}

export async function setSignedTx(id, signedTx) {
    return await sendMessage('setSignedTx', {
        id, signedTx
    })
}

export async function forbidTx(id) {
    return await sendMessage('forbidTx', {
        id,
    })
}
