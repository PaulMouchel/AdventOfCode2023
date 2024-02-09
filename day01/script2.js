const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./input.txt')

const numbers = [...'0123456789'.split(''), 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

const findFirstNumber = (input, reverse) => {
    // const index = input.search(numbersRegex)

    let index = null

    for (const number of numbers) {
        if (!reverse) {
            const i = input.indexOf(number)
            if (i !== -1 && (index === null || i < index)) {
                index = i
            }
        } else {
            const i = input.lastIndexOf(number)
            if (i !== -1 && (index === null || i > index)) {
                index = i
            }
        }
        
    }

    const firstChar = input.at(index)
    if ('0123456789'.includes(firstChar)) return firstChar

    const start = `${input.at(index)}${input.at(index + 1)}${input.at(index + 2)}`

    const lettersNumbers= [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ]
    // console.log({ start})
    for (let i = 0 ; i < lettersNumbers.length ; i++) {
        const letterNumber = lettersNumbers[i]
        // console.log({ letterNumber })
        if (letterNumber.includes(start)) return i + 1
    }
    throw new Error('Numéro introuvable')
    // return input.split('').find(char => '0123456789'.includes(char))
}


const result = fileLines.reduce((acc, val) => {
    const lineValue = Number(`${findFirstNumber(val)}${findFirstNumber(val, true)}`)
    return acc + lineValue
}, 0)

console.log(result)
