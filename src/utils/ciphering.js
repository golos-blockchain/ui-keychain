import crypto from 'browserify-aes'

const toBinaryBuffer = o => (o ? Buffer.isBuffer(o) ? o : new Buffer(o, 'binary') : o)

export function encrypt(str, secretStr) {
    const h = Buffer.from(secretStr, 'utf8')
    const cipher = crypto.createCipher('aes-256-cbc', h)
    let message = toBinaryBuffer(str)
    message = Buffer.concat([cipher.update(message), cipher.final()])
    message = message.toString('hex')
    return message
}

export function decrypt(hexStr, secretStr) {
    const h = Buffer.from(secretStr, 'utf8')
    const cipher = crypto.createDecipher('aes-256-cbc', h)
    let message = Buffer.from(hexStr, 'hex')
    message = Buffer.concat([cipher.update(message), cipher.final()])
    return message.toString('utf8')
}
