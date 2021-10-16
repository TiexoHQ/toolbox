import { NftGenerator } from '../utils/nft-generator'
import { NftWorkerAction } from './types.worker'

// run generator
// const generator = new NftGenerator(ATTRIBUTES, OPTIONS, false)
// const nftList = generator.generate()

addEventListener('message', event => {
    const action = event.data?.action || {}

    switch (action.type) {
        case NftWorkerAction.GENERATE:
            console.log(event.data)
            // run generator
            if (action?.data?.attributes && action?.data?.options) {
                console.log(action.data.attributes, action.data.options)
                const generator = new NftGenerator(
                    action.data.attributes,
                    action.data.options,
                    false
                )
                const nftList = generator.generate()

                postMessage({
                    action: {
                        type: NftWorkerAction.GENERATE,
                        data: {
                            nftList,
                        },
                    },
                })
            }
            break
    }
    console.log('DONE!')
})
