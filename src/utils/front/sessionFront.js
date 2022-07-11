import { encrypt, decrypt } from '../../utils/ciphering'
import { sendMessage } from './common'

export async function createSession(phrase) {
    const c1 = crypto.randomUUID().split(/-/).join('')
    const c2 = encrypt(phrase, c1)
    return await sendMessage('saveSession', {
        c1,
        c2
    })
}

export async function getSession() {
    const res = await sendMessage('getSession')
    if (res && res.c1  && res.c2) {
        const phrase = decrypt(res.c2, res.c1)
        return phrase
    }
    return null
}

export async function clearSession() {
    const res = await sendMessage('clearSession')
    if (!res) throw new Error()
}
