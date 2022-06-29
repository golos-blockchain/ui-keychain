const fs = require('fs')
const fse = require('fs-extra')

const target = process.env.TARGET

console.log('Running postbuild...')

function fileExists(path) {
    try {
        return fs.statSync(path).isFile()
    } catch (err) {
        return false
    }
}

const outDir = 'build-' + target + '/'

fs.copyFileSync('manifests/' + target +'/manifest.json', outDir + 'manifest.json')
if (fileExists(outDir + 'index.html')) {
    fs.renameSync(outDir + 'index.html', outDir + 'popup.html')
}

fse.copySync('src/extension/_locales', outDir + '_locales')

fs.copyFileSync('dist/background.js', outDir + 'background.js')
fs.copyFileSync('dist/content_script.js', outDir + 'content_script.js')

//fs.copyFileSync('node_modules/webextension-polyfill/dist/browser-polyfill.js',
//    outDir + 'browser-polyfill.js')

fs.copyFileSync('public/golos.png', outDir + 'golos.png')
fs.copyFileSync('public/inpage_keychain.js', outDir + 'inpage_keychain.js')
fse.copySync('public/icons', outDir + 'icons')

console.log('-- Fixing CSS in popup.html')

let doc = fs.readFileSync(outDir + 'popup.html', 'utf8')
doc = doc.replace('media="only x" onload="this.media=\'all\'"', '')
fs.writeFileSync(outDir + 'popup.html', doc)
