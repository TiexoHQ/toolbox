import Random, { IRandom } from './helpers/random'
import type {
    INftAttributesMap,
    INftGeneratorOptions,
    INft,
    INumberRange,
    INftGeneratorAttributesCompatibility,
    INftGeneratorAttributesCompatibilityCondition,
    IGeneratorState,
    ITargetState,
} from './types'
import { inRange, mergeRanges, rangeToArray } from './helpers/range'
import { klona } from 'klona'
import { getInitialState } from './helpers/generator-initial-state'
import { cloneState } from './helpers/state-clone'
import {
    getAttributeValueWeight,
    getRandomAttributeValue,
    validateAttributesCompatibility,
    validateTargetsByAttributes,
} from './helpers/nft-attributes'
import Debug from 'debug'

export class NftGenerator {
    // instance specific stuff
    private random: IRandom

    private state: IGeneratorState = undefined as any

    constructor(
        // TODO: add initial nft list
        public attributesMap: INftAttributesMap,
        public options: INftGeneratorOptions,
        public debug = true
    ) {
        this.random = Random(options.randomSeed)
    }

    public generate(): INft[] {
        const debug = Debug('generate()')
        const debugClone = Debug('clone')

        // console.time('generate()')
        // init generator state

        debug('initializing state')
        this.state = getInitialState(this.attributesMap, this.options, this.random)

        // start generating
        let currentTargetIndex = 0
        const defaultTarget: ITargetState = {
            target: { nftCount: Infinity },
            count: 0,
        } // just a default target to ensure the desired amount of nfts are generated
        let nextState: IGeneratorState
        let tries = 0
        debug('start generation')
        while (this.state.nftCount < this.options.nftCount && tries < this.options.maxTries) {
            // debug('try %d', tries)
            tries++
            if (tries % 1000 === 0) console.log('tries', tries)
            // console.time('generate():while')
            // console.time('generate():while:init')

            // getting current target
            const currentTarget = this.state.targets[currentTargetIndex] || defaultTarget
            // check if current target was fulfilled
            if (currentTarget.count >= currentTarget.target.nftCount) {
                currentTargetIndex++
                continue // target was fulfilled, index was increased, just redo the loop to set the correct current target
            }

            // setup nextState obj
            // console.time('cloneState')
            nextState = cloneState(this.state)
            // console.timeEnd('cloneState')
            // console.timeEnd('generate():while:init')

            // console.time('generate():while:generateAttr')
            // generate a list of attributes for the new nft
            const attributesNames = this.generateRandomAttributesList(
                currentTarget.target.attributesCount || {
                    min: 0,
                    max: this.state.attributesList.length,
                }
            )
            // console.timeEnd('generate():while:generateAttr')

            // console.time('generate():while:generateNft')
            // generate the nft
            const nft = this.generateSingleNft(nextState, attributesNames, currentTarget)
            if (!nft) {
                continue
            }
            // console.timeEnd('generate():while:generateNft')

            // update next state and check that the newlygenerated nft doesn't impact the other nfts
            if (!validateTargetsByAttributes(this.options, nextState, nft)) {
                this.log('validateTargetsByAttributes')
                continue
            }

            this.state = nextState
            if (this.state.nftCount % 100 === 0) console.log('nfts', this.state.nftCount)
            // console.timeEnd('generate():while')
        }
        // console.timeEnd('generate()')
        return this.state.nftList
    }

    private generateRandomAttributesList(countRange: INumberRange): string[] {
        const attributesList = klona(this.state.optionalAttributesList)
        const attributes = new Set<string>(this.state.mandatoryAttributesList)
        const attributesCount = this.random.getRandomInt(
            Math.max(countRange.min || 0, this.state.mandatoryAttributesList.length),
            Math.max(
                this.state.mandatoryAttributesList.length,
                countRange.max || this.state.attributesList.length
            )
        )

        while (attributes.size < attributesCount) {
            attributes.add(this.random.extractRandomItem(attributesList))
        }

        return Array.from(attributes)
    }

    private generateSingleNft(
        state: IGeneratorState,
        attributesList: string[],
        target: ITargetState
    ): INft {
        const nft: INft = {
            key: '',
            attributes: {},
            rarity: { attributes: {}, score: 0 },
            attributesCount: 0,
        }
        const nftKey: string[] = []
        for (const attributeName of state.attributesList) {
            const stateAttributeMap = state.attributes.get(attributeName)

            if (stateAttributeMap) {
                if (attributesList.indexOf(attributeName) >= 0) {
                    // get Random attribute value
                    nft.attributes[attributeName] = getRandomAttributeValue(
                        stateAttributeMap,
                        this.random
                    )

                    nft.attributesCount++
                } else {
                    nft.attributes[attributeName] = undefined
                }

                // add nft info in state
                const stateAttributeValueMap = stateAttributeMap.values.get(
                    nft.attributes[attributeName]
                )
                if (stateAttributeValueMap) {
                    stateAttributeValueMap.count++

                    // update weight
                    const nextWeight = getAttributeValueWeight(stateAttributeValueMap)
                    if (nextWeight !== stateAttributeValueMap.weight) {
                        stateAttributeMap.weightSum += nextWeight - stateAttributeValueMap.weight
                        stateAttributeValueMap.weight = nextWeight
                    }

                    // update rarity info
                    nft.rarity.attributes[attributeName] =
                        1 / (stateAttributeValueMap.count / this.options.nftCount)
                    nft.rarity.score += nft.rarity.attributes[attributeName]
                }
                stateAttributeMap.nfts.push({
                    nft,
                    scoreTarget: target.target.rarityScore,
                })

                // add attribute value in key
                nftKey.push(nft.attributes[attributeName] || '')
            } else {
                // something went wrong, return an invalid nft
                this.log('generateSingleNft - something went wrong')
                return undefined as any
            }
        }
        nft.key = nftKey.join('|')

        // do some validations
        // unicity check
        if (this.state.nftMap.has(nft.key)) {
            console.log('generateSingleNft - unicity check', nft.key)
            return undefined as any
        }
        // attributes compatibility
        if (!validateAttributesCompatibility(nft, this.options.attributesCompatibility)) {
            this.log(
                'generateSingleNft - validateAttributesCompatibility'
                //Object.keys(nft.attributes)
            )
            return undefined as any
        }

        // rarity score check
        if (!inRange(nft.rarity.score, target.target.rarityScore || { min: 0, max: Infinity })) {
            this.log('generateSingleNft - rarity score check')
            return undefined as any
        }

        state.nftCount++
        state.nftList.push(nft)
        state.nftMap.set(nft.key, nft)
        target.count++
        // this.log(state.nftCount)
        return nft
    }

    private log(...args) {
        if (this.debug) console.log(...args)
    }
}
