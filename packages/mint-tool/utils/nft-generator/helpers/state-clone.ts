import { IAttributeState, IAttributeValueState, IGeneratorState, NftAttributeValue } from '../types'

export const cloneState = (state: IGeneratorState): IGeneratorState => {
    // console.time('clone')
    const clone: IGeneratorState = {} as any

    clone.attributesList = state.attributesList
    clone.mandatoryAttributesList = state.mandatoryAttributesList
    clone.optionalAttributesList = state.optionalAttributesList

    clone.attributes = cloneAttributesState(state.attributes)

    clone.nftCount = state.nftCount
    clone.nftList = Array.from(state.nftList)
    clone.nftMap = new Map(state.nftMap)

    clone.targets = state.targets

    // console.timeEnd('clone')
    return clone
}

const cloneAttributesState = (
    state: Map<string, IAttributeState>
): Map<string, IAttributeState> => {
    const clone = new Map()

    for (const [attributeName, value] of state.entries()) {
        const valueClone = {
            values: cloneAttributeValuesState(value.values),
            nfts: Array.from(value.nfts),
        }
        clone.set(attributeName, valueClone)
    }

    return state
}

const cloneAttributeValuesState = (
    state: Map<NftAttributeValue, IAttributeValueState>
): Map<NftAttributeValue, IAttributeValueState> => {
    const clone = new Map()

    for (const [key, value] of state.entries()) {
        clone.set(key, {
            count: value.count,
            countTarget: value.countTarget,
        })
    }

    return clone
}
