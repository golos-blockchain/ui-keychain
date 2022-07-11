import golos from 'golos-lib-js'

import config from '../config/default.json'

export async function initGolos(settings) {
    golos.config.set('websocket', settings.current_node)
    if (settings.chain_id) {
        golos.config.set('chain_id', settings.chain_id)
    }
    await golos.importNativeLib()
}
