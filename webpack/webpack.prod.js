const webpack = require('webpack')

const config = {
    entry: {
        background: './src/extension/background.js',
        content_script: './src/extension/content_script.js'
    },
    resolve: {
        alias: {
            process: 'process/browser',
            stream: 'stream-browserify',
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ]
}

module.exports = config
