import { broadcast } from 'golos-lib-js'

export function detectRoles(tx) {
    try {
        let roles = new Set()
        if (tx._meta && tx._meta._keys) {
            tx._meta._keys.forEach(roles.add, roles)
        }
        if (roles.size) {
            return roles
        }
        for (let op of tx.operations) {
            let r = broadcast._operations[op[0]].roles
            if (r[0]) roles.add(r[0])
        }
        return roles
    } catch (err) {
        console.error('detectRoles error: ', err)
        throw err
    }
}
