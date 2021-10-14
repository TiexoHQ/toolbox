import { INumberRange } from '../types'

export const inRange = (value: number, range: INumberRange) => {
    const min = range.min || 0
    const max = range.max || Infinity
    return value >= min && value <= max
}

export const mergeRanges = (range1: INumberRange, range2: INumberRange): INumberRange => {
    return {
        min: Math.min(range1.min || 0, range2.min || 0),
        max: Math.max(range1.max || Infinity, range2.max || Infinity),
    }
}

export const rangeToArray = (range: INumberRange) => {
    if (!range.max) throw new Error('Canot convert range to array when max is not defined.')
    const result: number[] = []
    for (let i = range.min || 0; i <= range.max; i++) {
        result.push(i)
    }

    return result
}

export const rangeSize = (range: INumberRange, defaults: INumberRange = {}): number => {
    const min = range.min || defaults.min || 0
    const max = range.max || defaults.max || 0

    return max - min
}
