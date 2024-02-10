const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./input.txt')

const numbers = '0123456789'

const numbersAndPositions = []

const getAroundCoordinates = (numberAndPosition, lastColIndex, lastRowIndex) => {

    const lines = { from: numberAndPosition.line - 1, to: numberAndPosition.line + 1 }
    const columns = { from: numberAndPosition.column.from - 1, to: numberAndPosition.column.to + 1 }

    const pointsToCheck = []
    if (lines.from >= 0) {
        for (let col = columns.from; col <= columns.to; col++) {
            if (col >= 0 && col <= lastColIndex) {
                pointsToCheck.push({ line: lines.from, col})
            }
        }
    }

    if (columns.from >= 0) {
        pointsToCheck.push({ line: numberAndPosition.line, col: columns.from})
    }

    if (columns.to <= lastColIndex) {
        pointsToCheck.push({ line: numberAndPosition.line, col: columns.to})
    }

    if (lines.to <= lastRowIndex) {
        for (let col = columns.from; col <= columns.to; col++) {
            if (col >= 0 && col <= lastColIndex) {
                pointsToCheck.push({ line: lines.to, col})
            }
        }
    }

    return pointsToCheck
}

const hasSymbolAround = (pointsList) => {
    for (let point of pointsList) {
        if (!'0123456789.'.includes(fileLines[point.line][point.col])) return true
    }
    return false
}

for (let lineIndex = 0; lineIndex < fileLines.length; lineIndex++) {
    const line = fileLines[lineIndex]
    for (let colIndex = 0; colIndex < line.length; colIndex++) {
        const char = line[colIndex]
        if (numbers.includes(char)) {
            let number = char
            const from = colIndex
            while(colIndex !== (line.length - 1) && numbers.includes(line[colIndex+1])) {
                colIndex++
                number = number + line[colIndex]
            }
            numbersAndPositions.push({
                value: Number(number),
                line: lineIndex,
                column: {
                    from,
                    to: colIndex
                }
            })
        }
    }
}

const res = numbersAndPositions.reduce((acc, numAndPos) => {
    const pointsAround = getAroundCoordinates(numAndPos, fileLines[0].length - 1, fileLines.length - 1)
    const isValid = hasSymbolAround(pointsAround)
    if (isValid) return acc + numAndPos.value
    return acc
}, 0)

console.log(res)