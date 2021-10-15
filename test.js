fs = require('fs')
readline = require('readline')

const OUT = '/Users/krisboit/Documents/metadata.mysql.csv'

async function main() {
    const csvStream = fs.createReadStream('/Users/krisboit/Documents/metadata_indexed.csv')

    let count = 0
    const rl = readline
        .createInterface({
            input: csvStream,
            crlfDelay: Infinity,
        })
        .on('line', line => {
            if (count === 0) {
                count++
                const data = line.split(',')
                data.shift()
                //console.log(data.map(c => c.replace(/\./gi, '_')))
                const dataStr = data
                    .map(c => c.replace(/\./gi, '_'))
                    .map(c => c.replace(/^data_info_data_/gi, ''))
                    .map(c => c.replace(/^data_info_/gi, ''))
                    .map(c => c.replace(/^data_/gi, ''))
                    .join(',')
                fs.writeFileSync(OUT, dataStr)
            } else {
                const data = line.split(',')
                data.shift()
                const dataStr = data.join(',')
                fs.appendFileSync(OUT, dataStr)
            }

            // console.log(count++)
            // console.log(args)
        })
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    // let head = true
    // for await (const line of rl) {
    //     const data = line.split(',')
    //     data.shift()

    //     console.log(data)

    //     if (head) console.log(data)
    //     head = false

    // const data = line.toString().split(',')
    // data.shift()

    // if (head) {
    //     head = false
    //     fs.writeFileSync(
    //         OUT,
    //         data.map(c => c.replace(/\./gi, '_').join(','))
    //     )
    // } else {
    //     fs.appendFileSync(OUT, data.join(','))
    // }
    // }
}
main()
// var readline = require('readline')
// const head = true
// readline
//     .createInterface({
//         input: csvStream,
//         terminal: false,
//     })
//     .on('line', function (line) {
//
//     })
