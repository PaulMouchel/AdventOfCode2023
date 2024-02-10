const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./input.txt')

class Card {
    constructor(cardValue) {
        const [ winnings, numbers ] = cardValue.split(' | ')
        this.winningNumbers = winnings.split(' ').filter(val => val !== '').map(Number)
        this.values = numbers.split(' ').filter(val => val !== '').map(Number)
    }

    getMatches() {
        return this.values.reduce((acc, val) => {
            if (this.winningNumbers.includes(val)) return [...acc, val]
            return acc
        }, [])
    }

    getNumberOfMatches() {
        return this.getMatches().length
    }

    getScore() {
        const numberOfMatches = this.getNumberOfMatches()
        if (numberOfMatches <= 1) return numberOfMatches
        return Math.pow(2, numberOfMatches - 1)
    }
}

class Game {
    constructor(fileLines) {
        this.cards = fileLines.map(line => new Card(line.split(':')[1].trim()))
    }

    getScore() {
        return this.cards.reduce((acc, val) => {
            return acc + val.getScore()
        }, 0)
    }
}

const game = new Game(fileLines)
console.log(game.getScore())