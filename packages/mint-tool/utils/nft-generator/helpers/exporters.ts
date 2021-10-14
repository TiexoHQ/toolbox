export const nftListToCSV = nftList => {
    const columns = new Set()
    let rows: string = ''
    nftList.map(n => {
        const row: any[] = []
        let count = 0
        for (const attribute of Object.keys(n.attributes)) {
            columns.add(attribute)
            columns.add(`score_${attribute}`)

            row.push(n.attributes[attribute])
            row.push(n.rarity.attributes[attribute])

            if (n.attributes[attribute]) {
                count++
            }
        }

        columns.add('attributes_count')
        columns.add('attributes_count2')
        columns.add('attributes_count_diff')

        columns.add('score')
        row.push(n.attributesCount)
        row.push(count)
        row.push(count - n.attributesCount)
        row.push(n.rarity.score)

        rows += `${row.join(',')}\n`
    })

    return `${Array.from(columns).join(',')}\n${rows}`
}
