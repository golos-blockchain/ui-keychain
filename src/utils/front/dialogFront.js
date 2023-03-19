import { sendMessage } from './common'

export async function setDialogResult(err, res) {
    await sendMessage('setDialogResult', {
    	err, res
    })
}
