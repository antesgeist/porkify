// const jsdom = require('jsdom')
// console.log(jsdom.JSDOM)

// import { JSDOM } from 'jsdom'
// const window = JSDOM.window

// let i = 0
// setInterval(() => {
//     console.log(`iteration ${i}`)
//     i++
// }, 2000)

// DEBUGGER SCRATCH

console.log('Debugger Initialized')

/*
    5.25
    5.5
    5.75
    5.33
    5.25
*/

const fractions = [
    {
        regex: /.*(\.25).*/g,
        fraction: '1/4',
    },
    {
        regex: /.*(\.33).*/g,
        fraction: '1/3',
    },
    {
        regex: /.*(\.5).*/g,
        fraction: '1/2',
    },
    {
        regex: /.*(\.75).*/g,
        fraction: '3/4',
    },
]

const string = '5.25 AND 5.33 AND 5.5 AND 5.75'
const int = 1.75

const stringReplacer = (str) => {
    // split string into array
    const splitStr = str.split(' ')

    // map into each string
    const newStrArr = splitStr.map((val) => {
        let newVal = val
        // loop into each regex
        fractions.forEach((frac) => {
            newVal = newVal.replace(frac.regex, frac.fraction)
        })
        return newVal
    })
    return newStrArr.join(' ')
}

const integerReplacer = (str) => {
    /* eslint prefer-template: "off" */
    let newStr = str + ''
    // loop into each regex
    fractions.forEach((frac) => {
        newStr = newStr.replace(frac.regex, frac.fraction)
    })

    if (newStr.match(/(0\s)(.*)/g)) {
        newStr = newStr.replace(/(0\s)(.*)/g, '$2')
    }
    return newStr
}

console.log(stringReplacer(string))
console.log(integerReplacer(int))