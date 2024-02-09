const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./input.txt')

const findFirstNumber = (input) => {
    return input.split('').find(char => '0123456789'.includes(char))
}

const result = fileLines.reduce((acc, val) => {
    const lineValue = Number(`${findFirstNumber(val)}${findFirstNumber(val.split('').reverse().join(''))}`)
    return acc + lineValue
}, 0)

console.log(result)