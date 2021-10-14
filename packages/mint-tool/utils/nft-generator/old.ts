export {}
// import Random, { IRandom } from './random'
// import { LocationSearchingSharp, TrendingDown } from '@mui/icons-material'
// import type {
//     INftAttributesMap,
//     INftGeneratorOptions,
//     INft,
//     INftRarityTarget,
//     INumberRange,
//     INftGeneratorAttributesCompatibility,
//     INftGeneratorAttributesCompatibilityCondition,
// } from './types'
// import { inRange, mergeRanges, rangeToArray } from './helpers/range'
// import { klona } from 'klona/full'

// interface ITotalAttributesCount {
//     [attribute: string]: {
//         [attributeValue: string]: number
//     }
// }

// interface INftRarityTargetTrack extends INftRarityTarget {
//     actualCount: number
// }

// export class NftGenerator {
//     // instance specific stuff
//     private attributesList: string[]
//     private mandatoryAttributesList: string[]
//     private optionalAttributesList: string[]
//     private random: IRandom

//     // generator specific
//     private finalNftsList: INft[] = []
//     private finalNftMap: Map<string, INft> = new Map()
//     private finalNftsCount: number = 0
//     private finalNftsAttributesValuesCount: ITotalAttributesCount = {}
//     private rarityTargets: Array<INftRarityTargetTrack> = []
//     private attributesCountPossibleValues: number[] = []

//     constructor(
//         public attributesMap: INftAttributesMap,
//         public options: INftGeneratorOptions,
//         public debug = true
//     ) {
//         this.attributesList = Object.keys(attributesMap) as string[] // list with attributes names
//         this.mandatoryAttributesList = Object.keys(attributesMap) // list with attributes names that don't have undefined as value
//             .map(a => (attributesMap[a].indexOf(undefined) < 0 ? a : undefined))
//             .filter(Boolean) as string[]
//         this.optionalAttributesList = this.attributesList.filter(
//             a => this.mandatoryAttributesList.indexOf(a) < 0
//         )
//         this.random = Random(options.randomSeed)
//     }

//     private getAttributeValuesCount(attributeName: string, value: string | undefined): number {
//         return (this.finalNftsAttributesValuesCount[attributeName] || {})[value || 'undefined'] || 0
//     }

//     private generateAttributesList(): string[] {
//         const attributesList = klona(this.optionalAttributesList)
//         const nftAttributesSet = new Set(this.mandatoryAttributesList)

//         if (this.attributesCountPossibleValues.length > 0) {
//             const count = this.random.getRandomItem(this.attributesCountPossibleValues)
//             if (nftAttributesSet.size + attributesList.length >= count) {
//                 while (nftAttributesSet.size < count) {
//                     const attr = this.random.getRandomItem(attributesList)
//                     attributesList.splice(attributesList.indexOf(attr), 1)
//                     nftAttributesSet.add(attr)
//                 }
//                 return Array.from(nftAttributesSet)
//             }
//         }

//         throw new Error('Could not generate a valid attribute count.')
//     }

//     private generateSingleNft(attributesList: string[]): INft {
//         const nft: INft = {
//             key: '',
//             attributes: {},
//             rarity: { attributes: {}, score: 0 },
//             attributesCount: 0,
//         }
//         const nftKey: string[] = []
//         for (const attributeName of this.attributesList) {
//             if (attributesList.indexOf(attributeName) >= 0) {
//                 nft.attributes[attributeName] = this.random.getRandomItem(
//                     this.attributesMap[attributeName]
//                 )
//                 nft.attributesCount++
//             } else {
//                 nft.attributes[attributeName] = undefined
//             }

//             nftKey.push(nft.attributes[attributeName] || '')
//         }
//         nft.key = nftKey.join('|')

//         return nft
//     }

//     private evaluateCondition(
//         nft: INft,
//         condition: INftGeneratorAttributesCompatibilityCondition
//     ): boolean {
//         if (condition.and && Array.isArray(condition.and)) {
//             for (const andCondition of condition.and) {
//                 if (!this.evaluateCondition(nft, andCondition)) return false
//             }
//             return true
//         } else if (condition.or && Array.isArray(condition.or)) {
//             for (const orCondition of condition.or) {
//                 if (this.evaluateCondition(nft, orCondition)) return true
//             }
//             return false
//         } else if (condition.attributes) {
//             const attributesNames = Object.keys(condition.attributes)

//             for (const attributeName of attributesNames) {
//                 if (condition.attributes[attributeName] === '*') {
//                     if (nft.attributes[attributeName] === undefined) {
//                         return false
//                     }
//                 } else if (typeof condition.attributes[attributeName] === 'string') {
//                     if (condition.attributes[attributeName] !== nft.attributes[attributeName]) {
//                         return false
//                     }
//                 } else if (Array.isArray(condition.attributes[attributeName])) {
//                     // console.log(condition.attributes[attributeName], nft.attributes[attributeName]);
//                     if (
//                         condition.attributes[attributeName].indexOf(
//                             nft.attributes[attributeName] as string
//                         ) < 0
//                     ) {
//                         return false
//                     }
//                 }
//             }

//             return true
//         }
//         return true
//     }

//     private validateAttributesCompatibility(
//         nft: INft,
//         attributesCompatibility: INftGeneratorAttributesCompatibility[]
//     ): boolean {
//         for (const comp of attributesCompatibility) {
//             // console.log(comp)
//             if (this.evaluateCondition(nft, comp.condition))
//                 return comp.type === 'deny' ? false : true
//         }
//         return true
//     }

//     private validateAttributesRarity(nft: INft): boolean {
//         // console.table([nft.attributes, nft.rarity.attributes])
//         const attributeRarityScrore = this.options.rarity.attributeRarityScrore || {}
//         if (Object.keys(attributeRarityScrore).length > 0) {
//             for (const attribute of this.attributesList) {
//                 const range = attributeRarityScrore[attribute] || attributeRarityScrore['*']
//                 const attributeScore =
//                     1 /
//                     ((this.getAttributeValuesCount(attribute, nft.attributes[attribute]) + 1) /
//                         this.options.nftCount)
//                 // console.log({ attribute, range, attributeScore })
//                 if (range && !inRange(attributeScore, range)) return false
//             }
//         }

//         return true
//     }

//     private validateRarityScore(nft: INft): boolean {
//         // clone nft list
//         const nftList = klona(this.finalNftsList)
//         nftList.push(nft)

//         // clone atribute values count
//         const nftsAttributesValuesCount = klona<ITotalAttributesCount>(
//             this.finalNftsAttributesValuesCount
//         )
//         // add the nft to counters
//         for (const attr of this.attributesList) {
//             if (!nftsAttributesValuesCount[attr]) {
//                 nftsAttributesValuesCount[attr] = {}
//             }
//             const value = nft.attributes[attr] || 'undefined'
//             nftsAttributesValuesCount[attr][value] =
//                 ((nftsAttributesValuesCount[attr] || {})[value] || 0) + 1
//         }

//         // init rarity target
//         const rarityTargets = klona(this.rarityTargets)
//         for (const target of rarityTargets) {
//             target.actualCount = 0
//         }

//         const attributeRarityScrore = this.options.rarity.attributeRarityScrore || {}
//         for (const nft of nftList) {
//             let nftRarityScore = 0
//             let attributesCount = 0
//             for (const attributeName of this.attributesList) {
//                 const attributeScoreRange =
//                     attributeRarityScrore[attributeName] || attributeRarityScrore['*']
//                 attributesCount += nft.attributes[attributeName] ? 1 : 0
//                 const value = nft.attributes[attributeName] || 'undefined'
//                 nft.rarity.attributes[attributeName] =
//                     1 / (nftsAttributesValuesCount[attributeName][value] / this.options.nftCount)

//                 nftRarityScore += nft.rarity.attributes[attributeName]
//             }
//             nft.rarity.score = nftRarityScore

//             const target = rarityTargets.find(
//                 t =>
//                     inRange(nft.rarity.score, t.rarityScore) &&
//                     inRange(attributesCount, t.attributesCount)
//             )

//             // console.log(target, nft.rarity.score, attributesCount)

//             // process.exit()

//             if (target) {
//                 target.actualCount = (target?.actualCount || 0) + 1
//                 if (target.actualCount > target.attributesCount) {
//                     return false
//                 }
//             } else {
//                 return false
//             }
//         }

//         return true
//     }

//     private isValidNft(nft: INft): boolean {
//         // check unicity
//         if (this.finalNftMap.has(nft.key)) {
//             // console.log('duplicate')
//             return false
//         }
//         // check attributes compatibility
//         if (!this.validateAttributesCompatibility(nft, this.options.attributesCompatibility)) {
//             // console.log('compat')
//             return false
//         }

//         // check attributes rarity score
//         // if (!this.validateAttributesRarity(nft)) return false

//         // check rarity and attributes count
//         if (!this.validateRarityScore(nft)) {
//             // console.log('rarity', nft.rarity.score, nft.attributesCount)
//             return false
//         }

//         return true
//     }

//     private refreshRarityScores() {
//         for (const target of this.rarityTargets) {
//             target.actualCount = 0
//         }

//         for (const nft of this.finalNftsList) {
//             let nftRarityScore = 0
//             let attributesCount = 0
//             for (const attributeName of this.attributesList) {
//                 attributesCount += nft.attributes[attributeName] ? 1 : 0
//                 // TODO: potential optimisation: calculate attributes rarity score outside of this loop. Right now the calculation is made for each nft, but the result is the same
//                 const value = nft.attributes[attributeName] || 'undefined'
//                 nft.rarity.attributes[attributeName] =
//                     1 /
//                     (this.finalNftsAttributesValuesCount[attributeName][value] /
//                         this.options.nftCount)

//                 nftRarityScore += nft.rarity.attributes[attributeName]
//             }
//             nft.rarity.score = nftRarityScore
//             const target = this.rarityTargets.find(
//                 t =>
//                     inRange(nft.rarity.score, t.rarityScore) &&
//                     inRange(attributesCount, t.attributesCount)
//             )
//             if (target) target.actualCount = (target?.actualCount || 0) + 1
//         }
//     }

//     private saveNft(nft: INft) {
//         this.finalNftsList.push(nft)
//         this.finalNftMap.set(nft.key, nft)
//         const nftAttributesNames = Object.keys(nft.attributes)
//         for (const attributeName of nftAttributesNames) {
//             if (!this.finalNftsAttributesValuesCount[attributeName])
//                 this.finalNftsAttributesValuesCount[attributeName] = {}

//             this.finalNftsAttributesValuesCount[attributeName][
//                 nft.attributes[attributeName] || 'undefined'
//             ] =
//                 (this.finalNftsAttributesValuesCount[attributeName][
//                     nft.attributes[attributeName] || 'undefined'
//                 ] || 0) + 1
//         }
//         this.finalNftsCount++

//         // refresh rarity scores
//         //this.refreshRarityScores()
//     }

//     public generate() {
//         if (this.debug) {
//             console.time('NFT generation took')
//             console.log('NFT generation started...')
//         }
//         // initialize vars
//         this.finalNftsList = []
//         this.finalNftMap = new Map()
//         this.finalNftsCount = 0
//         this.finalNftsAttributesValuesCount = {}
//         this.rarityTargets = this.options.rarity.general.map(t => ({ ...t, actualCount: 0 })) // just making a copy and initialize actual count to 0

//         let attributesCount: Set<number> = new Set<number>()
//         for (const target of this.rarityTargets) {
//             if (target.actualCount < target.nftCount) {
//                 rangeToArray(target.attributesCount)
//                     .filter(v => v >= this.mandatoryAttributesList.length)
//                     .map(v => attributesCount.add(v))
//             }
//         }
//         this.attributesCountPossibleValues = Array.from(attributesCount)

//         // start generation
//         let tries = 0
//         while (this.finalNftsCount < this.options.nftCount) {
//             tries++

//             if (this.debug && tries % 10000 === 0)
//                 console.log('Tries:', tries, '/', this.options.maxTries) // TODO: remove this
//             if (tries > this.options.maxTries) break // stop if max tries

//             // generate a list of attributes based on rules for the new nft
//             const nftAttributesList = this.generateAttributesList()

//             // generate a nft
//             const nft = this.generateSingleNft(nftAttributesList)

//             // run checks
//             if (this.isValidNft(nft)) {
//                 // save nft
//                 this.saveNft(nft)
//             }

//             // some helping progress debug
//             if (this.finalNftsCount % (this.options.nftCount / 100) === 0)
//                 console.log(
//                     `${this.finalNftsCount} / ${this.options.nftCount} generated (${
//                         Math.floor((this.finalNftsCount / this.options.nftCount) * 10000) / 100
//                     }%)`
//                 )
//         }
//         if (this.debug) console.log('Tries:', tries, '/', this.options.maxTries)

//         // TODO: calculate final rarity score

//         if (this.debug) console.timeEnd('NFT generation took')
//         return this.finalNftsList
//     }
// }
