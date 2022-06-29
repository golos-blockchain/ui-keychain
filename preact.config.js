export default (config, env, helpers) => {
    let resolve = config.resolve
    resolve.alias = {
        ...resolve.alias,
        process: 'process/browser',
        stream: 'stream-browserify',
    }
    config.plugins.push(
        new helpers.webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    )
    return config
}
