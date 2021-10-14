export const isNumber = (input: any): boolean => {
    return input !== undefined && input !== null && input !== '' && !isNaN(Number(input))
}

export const replaceFieldAtIndex = (object: any, index: number, newKey: string, newValue: any) => {
    const copy = { ...(object || {}) }
    const finalObject = {}
    Object.keys(copy).forEach((el, localIndex) => {
        if (localIndex === index) {
            finalObject[newKey] = newValue
        } else {
            finalObject[el] = copy[el]
        }
    })

    return finalObject
}
