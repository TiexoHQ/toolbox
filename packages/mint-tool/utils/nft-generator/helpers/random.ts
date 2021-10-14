import { ArrowLeft } from '@mui/icons-material'

export interface IRandom {
    getCurrentSeed: () => number
    getRandomInt: (min: number, max: number) => number
    getRandomItem: <T = any>(arr: T[]) => T
    extractRandomItem: <T = any>(arr: Array<T>, startIndex?: number, endIndex?: number) => T
}

export const Random = (seed: number, resume = false): IRandom => {
    const MAX = 2147483647
    let _seed = seed
    if (!resume) {
        _seed = seed % MAX
        if (_seed) _seed += MAX - 1
    }

    /**
     * Returns a pseudo-random integer between 1 to 2^32
     **/
    function getRandomInt(min: number, max: number): number {
        _seed = (_seed * 16807) % MAX
        return (_seed % (max - min)) + min // make the number in range
    }

    function getRandomItem<T = any>(arr: Array<T>): T {
        return arr[getRandomInt(0, arr.length)]
    }

    function extractRandomItem<T = any>(arr: Array<T>, startIndex = 0, endIndex = arr.length): T {
        return arr.splice(getRandomInt(startIndex, endIndex), 1)[0]
    }

    function getCurrentSeed(): number {
        return _seed
    }

    return {
        getCurrentSeed,
        getRandomInt,
        getRandomItem,
        extractRandomItem,
    }
}

export default Random
