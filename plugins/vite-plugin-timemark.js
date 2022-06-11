import fs from 'fs'
import {resolve} from 'path'

const fileRegex = /\.(css|js)$/i
const vendorRegex = /vendor/
let viteConfig

export default function timeMarkPlugin () {
    return {
        name: 'timemark-plugin',
        configResolved(config){
            viteConfig = config
        },
        writeBundle: async(options,bundle) => {

            const bundles = Object.entries(bundle)
            const root = viteConfig.root
            const outDir = viteConfig.build.outDir || 'dist'
            bundles.forEach(bundle => {
                const bundleFileName = bundle[0]
                const bundleFilePath = resolve(root, outDir, bundleFileName)
                if(fileRegex.test(bundleFileName) && !vendorRegex.test(bundleFileName)) {
                    try{
                        const code = fs.readFileSync(bundleFilePath, {encoding: 'utf8'})
                        const timestamp = new Date().getTime();
                        const dateString = new Date(timestamp).toLocaleString('en-US');
                        const data = `/* Last build:  ${dateString} */\n${code}`
                        fs.writeFileSync(bundleFilePath, data)
                    } catch (e) {
                        console.log(e)
                    }
                }
            })
        }

    }
}
