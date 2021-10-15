import {
    IAttributeState,
    IAttributeValueState,
    IGeneratorState,
    INft,
    INftGeneratorAttributesCompatibility,
    INftGeneratorAttributesCompatibilityCondition,
    INftGeneratorOptions,
    INftState,
    NftAttributeValue,
} from '../types'
import { IRandom } from './random'
import { rangeSize } from './range'

const evaluateCondition = (
    nft: INft,
    condition: INftGeneratorAttributesCompatibilityCondition
): boolean => {
    if (condition?.and && Array.isArray(condition.and)) {
        for (const andCondition of condition.and) {
            if (!evaluateCondition(nft, andCondition)) return false
        }
        return true
    } else if (condition?.or && Array.isArray(condition.or)) {
        for (const orCondition of condition.or) {
            if (evaluateCondition(nft, orCondition)) return true
        }
        return false
    } else if (condition?.attributes) {
        const attributesNames = Object.keys(condition.attributes)

        for (const attributeName of attributesNames) {
            if (
                condition.attributes[attributeName] === '*' ||
                (Array.isArray(condition.attributes[attributeName]) &&
                    condition.attributes[attributeName].length === 1 &&
                    condition.attributes[attributeName][0] === '*')
            ) {
                if (nft.attributes[attributeName] === undefined) {
                    return false
                }
            } else if (
                condition.attributes[attributeName] === 'undefined' ||
                (Array.isArray(condition.attributes[attributeName]) &&
                    condition.attributes[attributeName].length === 1 &&
                    condition.attributes[attributeName][0] === 'undefined')
            ) {
                if (nft.attributes[attributeName] !== undefined) {
                    return false
                }
            } else if (typeof condition.attributes[attributeName] === 'string') {
                if (condition.attributes[attributeName] !== nft.attributes[attributeName]) {
                    return false
                }
            } else if (Array.isArray(condition.attributes[attributeName])) {
                // console.log(condition.attributes[attributeName], nft.attributes[attributeName]);
                if (
                    condition.attributes[attributeName].indexOf(
                        nft.attributes[attributeName] as string
                    ) < 0
                ) {
                    return false
                }
            }
        }

        return true
    }
    return true
}

export const validateAttributesCompatibility = (
    nft: INft,
    attributesCompatibility: INftGeneratorAttributesCompatibility[]
): boolean => {
    for (const comp of attributesCompatibility) {
        // console.log(comp)
        if (evaluateCondition(nft, comp.condition)) return comp.type === 'deny' ? false : true
    }
    return true
}

export const validateTargetsByAttributes = (
    options: INftGeneratorOptions,
    state: IGeneratorState,
    nft: INft
): boolean => {
    const affectedNftMap: Map<string, INftState> = new Map()
    for (const attributeName of state.attributesList) {
        const attribute = state.attributes.get(attributeName)

        if (attribute) {
            for (const nftState of attribute.nfts) {
                if (nftState.nft.attributes[attributeName] === nft.attributes[attributeName]) {
                    affectedNftMap.set(nftState.nft.key, nftState)
                }
            }
        }
    }

    // console.log('affectedNftMap', affectedNftMap.size)

    for (const [key, nftState] of affectedNftMap.entries()) {
        nftState.nft.rarity.score = 0
        for (const attributeName of state.attributesList) {
            const attribute = state.attributes.get(attributeName)

            if (attribute) {
                const attributeScore =
                    1 /
                    ((attribute.values.get(nftState.nft.attributes[attributeName])?.count || 0) /
                        options.nftCount)

                nftState.nft.rarity.attributes[attributeName] = attributeScore
                nftState.nft.rarity.score += attributeScore
            }

            // console.log(
            //     nftState.nft.rarity.score,
            //     prevScore,
            //     currentScore,
            //     nftState.scoreTarget
            // )
        }
        if (nftState.scoreTarget && nftState.nft.rarity.score < (nftState.scoreTarget?.min || 0)) {
            // console.log('false')
            return false
        }
    }

    // console.log('true')
    return true
}

export const getRandomAttributeValue = (
    attribute: IAttributeState,
    random: IRandom
): NftAttributeValue => {
    const randomInt = random.getRandomInt(0, attribute.weightSum)
    let sum = 0
    let prevKey
    for (const [key, value] of attribute.values.entries()) {
        if (key) {
            sum += value.weight
            if (sum > randomInt) {
                // console.log({ randomInt, weightSum: attribute.weightSum, key, weight: value.weight })
                return key
            }
            prevKey = key
        }
    }

    // TODO: check this out something doesn't add up, sum doesn't get bigger than randomInt when randomInt is close to attribute.weightSum
    // fallback to return a random value without weights
    return Array.from(attribute.values.entries())[randomInt % attribute.values.size][0]
}

export const getAttributeValueWeight = (attributeValue: IAttributeValueState): number => {
    if (attributeValue.count < (attributeValue.countTarget.min || 1)) {
        return 40
    } else {
        if (attributeValue.count < rangeSize(attributeValue.countTarget) / 2) {
            return 20
        } else if (attributeValue.count < Number(attributeValue.countTarget.max)) {
            return 10
        }
    }
    return 1
}
