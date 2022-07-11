
import defaultCfg from '../config/default'
import { loadStoredItems, } from '../utils/storage'

export async function loadSettings() {
    const merged = { ...defaultCfg }

    const res = await loadStoredItems('config')
    const { config } = res
    if (config) {
        for (let [key, val] of Object.entries(config)) {
            merged[key] = val
        }
    }
    if (!merged.current_node) {
        merged.current_node = merged.nodes[0].address
    }
    return merged
}
