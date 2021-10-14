import { IRandom } from './random'
import {
    IAttributeState,
    IAttributeValueState,
    IGeneratorState,
    INftAttributesMap,
    INftGeneratorOptions,
    INumberRange,
    ITargetState,
    NftAttributeValue,
} from '../types'

export const getInitialState = (
    attributesMap: INftAttributesMap,
    options: INftGeneratorOptions,
    random: IRandom
): IGeneratorState => {
    // console.time('init')
    const attributesList = Object.keys(attributesMap) as string[] // list with attributes names
    const mandatoryAttributesList = Object.keys(attributesMap) // list with attributes names that don't have undefined as value
        .map(a => (attributesMap[a].indexOf(undefined) < 0 ? a : undefined))
        .filter(Boolean) as string[]
    const optionalAttributesList = attributesList.filter(
        a => mandatoryAttributesList.indexOf(a) < 0
    )

    const state: IGeneratorState = {
        attributesList,
        mandatoryAttributesList,
        optionalAttributesList,
        attributes: getInitialAttributesState(attributesMap, attributesList, options, random),
        nftCount: 0,
        nftList: [],
        nftMap: new Map(),
        targets: options.targets.rarity.map<ITargetState>(target => ({
            target,
            count: 0,
        })),
    }
    // console.timeEnd('init')
    return state
}

const getInitialAttributesState = (
    attributesMap: INftAttributesMap,
    attributesList: string[],
    options: INftGeneratorOptions,
    random: IRandom
): Map<string, IAttributeState> => {
    const state = new Map()

    for (const attributeName of attributesList) {
        const values = getInitialAttributeValuesState(
            attributeName,
            attributesMap[attributeName],
            options
        )
        const attributeState: IAttributeState = {
            values,
            weightSum: 4 * (values.size - (values.has(undefined) ? 1 : 0)),
            nfts: [],
        }

        state.set(attributeName, attributeState)
    }

    return state
}

const getInitialAttributeValuesState = (
    attributeName: string,
    values: NftAttributeValue[],
    options: INftGeneratorOptions
): Map<NftAttributeValue, IAttributeValueState> => {
    const state = new Map<NftAttributeValue, IAttributeValueState>()

    for (const value of values) {
        let target: INumberRange = { min: 1, max: Math.floor(options.nftCount * 0.1) } // default target is 1 - 10% of total nft count

        const attributeValuesOccurences = options?.targets?.attributesValuesOccurences || {}
        const attributeTarget =
            attributeValuesOccurences[attributeName] || attributeValuesOccurences['*']
        if (attributeTarget) {
            const valueTarget = attributeTarget[value || 'undefined'] || attributeTarget['*']

            if (valueTarget) {
                target = valueTarget
            }
        }

        state.set(value, {
            count: 0,
            weight: value ? 4 : 0,
            countTarget: target,
        })
    }

    return state
}
