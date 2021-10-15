// configs

export type NftAttributeValue = string | undefined

export interface INftGeneratorOptions {
    maxTries: number // number of tries to generate the desired number of nfts, just a protection agains infinite loops
    randomSeed: number // seed for random number generator, can be randomly generated

    nftCount: number // target number of nfts to be generated

    attributesCompatibility: INftGeneratorAttributesCompatibility[]

    targets: ITargetType
}

export interface ITargetType {
    rarity: INftGeneratorRarityTarget[]
    attributesValuesOccurences?: {
        [attributeName: string]: {
            [attributeValue: string]: INumberRange
        }
    }
}

export interface INftGeneratorAttributesCompatibility {
    type: 'allow' | 'deny'
    name?: string
    condition: INftGeneratorAttributesCompatibilityCondition
}

export interface INftGeneratorAttributesCompatibilityCondition {
    and?: Array<INftGeneratorAttributesCompatibilityCondition>
    or?: Array<INftGeneratorAttributesCompatibilityCondition>
    attributes?: {
        [attribute: string]: string[] | '*' | 'undefined'
    }
}

export interface INumberRange {
    min?: number
    max?: number
}

export interface INftGeneratorRarityTarget {
    rarityScore?: INumberRange
    attributesCount?: INumberRange
    nftCount: number
}

export interface INftAttributesMap {
    [attribute: string]: NftAttributeValue[]
}

interface INftRarityScore {
    attributes: {
        [attributeName: string]: number
    }
    score: number
}

export interface INft {
    key: string
    attributes: {
        [attributeName: string]: NftAttributeValue
    }
    attributesCount: number
    rarity: INftRarityScore
}

// generator
export interface IGeneratorState {
    attributesList: string[]
    mandatoryAttributesList: string[]
    optionalAttributesList: string[]
    attributes: Map<string, IAttributeState>
    nftCount: number
    nftList: INft[]
    nftMap: Map<string, INft>
    targets: ITargetState[]
}

export interface IAttributeState {
    values: Map<NftAttributeValue, IAttributeValueState>
    weightSum: number
    nfts: INftState[]
}

export interface IAttributeValueState {
    weight: number
    count: number
    countTarget: INumberRange
}

export interface INftState {
    nft: INft
    frozen?: boolean
    scoreTarget?: INumberRange
}

export interface ITargetState {
    target: INftGeneratorRarityTarget
    count: number
}

export interface SelectOptions {
    label: string
    value: string | number
}

export enum AttrType {
    ATTRIBUTES = 'ATTRIBUTES',
    AND = 'AND',
    OR = 'OR',
    NOT_SELECTED = 'NOT_SELECTED',
}

export interface IAttributeDto {
    name: string
    displayName: string
    canMiss: boolean
    values: Array<{
        name: string
        displayName: string
    }>
    selectedValueName: string
}

export enum StorageKeys {
    SETTINGS_KEY = 'SETTINGS_KEY',
    ATTRIBUTES = 'ATTRIBUTES',
}
