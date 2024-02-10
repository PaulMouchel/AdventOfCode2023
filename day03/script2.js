const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./input.txt')

class Star {
    constructor(row, col) {
        this.row = row
        this.col = col
    }

    getAroundCoordinates(grid) {
        return [
            { row: this.row - 1, col: this.col - 1 },
            { row: this.row - 1, col: this.col },
            { row: this.row - 1, col: this.col + 1 },
            { row: this.row, col: this.col - 1 },
            { row: this.row, col: this.col + 1 },
            { row: this.row + 1, col: this.col - 1 },
            { row: this.row + 1, col: this.col },
            { row: this.row + 1, col: this.col + 1 },
        ].filter(pos => pos.col >= 0 && pos.col <= grid.LAST_COL_INDEX && pos.row >= 0 && pos.row <= grid.LAST_ROW_INDEX)
    }

    getNumbersAround(grid) {
        const coordsWithValues = this.getAroundCoordinates(grid).map(coords => ({ ...coords, value: grid.getValue(coords)}))
        const flteredCoordinatesWithValues = coordsWithValues.filter(coords => coords.value !== '.')
        const numbers = flteredCoordinatesWithValues.map(coordsWhithValue => {
            return grid.getNumber(coordsWhithValue)
        })
        const uniqueNumbers = [...new Set(numbers.map(num => JSON.stringify(num)))].map(val => JSON.parse(val))

        return uniqueNumbers.map(num => num.value)
    }

    isGear(grid) {
        return this.getNumbersAround(grid).length === 2
    }
}

class Gear extends Star  {
    constructor(row, col) {
        super(row, col)
    }

    getPower(grid) {
        const numbers = this.getNumbersAround(grid)
        return numbers[0] * numbers[1]
    }
}

class GridRow {
    constructor(row, rowIndex) {
        this.rowIndex = rowIndex
        this.row = row
    }

    getStarsPositions() {
        return this.row.split('').reduce((acc, val, index) => {
            if (val === '*') return [...acc, index]
            return acc
        }, [])
    }
}

class Grid {
    constructor(fileLines) {
        this.lines = fileLines
        this.LAST_COL_INDEX = fileLines[0].length - 1
        this.LAST_ROW_INDEX = fileLines.length - 1
        this.stars = this.getStars()
        this.gears = this.stars.filter(star => star.isGear(this)).map(star => new Gear(star.row, star.col))
    }

    getStars() {
        let stars = []
        for ( let rowIndex = 0; rowIndex < this.lines.length; rowIndex++ ) {
            const row = new GridRow(this.lines[rowIndex], rowIndex)
            stars = [...stars, ...row.getStarsPositions().map(starPosition => (new Star(row.rowIndex, starPosition)))]
        }
        return stars
    }

    getValue(coords) {
        return this.lines[coords.row][coords.col]
    }

    getNumber(coords) {
        let finalValue = this.getValue(coords)
        let col = coords.col - 1
        while(col >= 0) {
            const value = this.getValue({ ...coords, col })
            if (Number(value).toString() === value) {
                finalValue = `${value}${finalValue}`
            } else {
                break
            }
            col -= 1
        }
        const min = col + 1

        col = coords.col + 1
        while(col <= this.LAST_COL_INDEX) {
            const value = this.getValue({ ...coords, col })
            if (Number(value).toString() === value) {
                finalValue = `${finalValue}${value}`
            } else {
                break
            }
            col += 1
        }
        const max = col - 1

        return { value: Number(finalValue), min, max }
    }

    findNumbers(coordinates) {
        console.log({coordinates })
    }
}

const grid = new Grid(fileLines)
const res = grid.gears.reduce((acc, gear) => {
    return acc + gear.getPower(grid)
}, 0)

console.log(res)