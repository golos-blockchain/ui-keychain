import { loadStoredItems, storeItems, removeItems } from '../utils/storage'

const singletoneGetClients = async (host) => {
    let clients = {}
    const res = await loadStoredItems('clients')
    clients = res.clients || clients
    return clients
}

export async function loginClient(host, account) {
    let clients = await singletoneGetClients()

    clients[host] = { authorized: true, account }

    await storeItems({
        clients
    })
}

export async function logoutClient(host) {
    let clients = await singletoneGetClients()

    delete clients[host]

    await storeItems({
        clients
    })
}

export async function hasClient(host) {
    let clients = await singletoneGetClients()
    const client = clients[host]
    return client || { authorized: false }
}

export async function clearClients() {
    return await removeItems('clients')
}

export async function setConfirmTx(host, confirmTx) {
    let clients = await singletoneGetClients()
    clients[host].notConfirmTx = !confirmTx

    await storeItems({
        clients
    })
}
