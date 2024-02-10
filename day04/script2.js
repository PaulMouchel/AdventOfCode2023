const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./input.txt')

class Card {
    constructor(cardNumber, cardValue, game) {
        this.game = game
        this.instances = 1
        this.cardNumber = cardNumber
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

    resolveRound() {
        const numberOfMatches = this.getNumberOfMatches()
        if (numberOfMatches > 0) {
            for (let i = this.cardNumber + 1; i <= this.cardNumber + numberOfMatches; i++) {
                this.game.cards.find(card => card.cardNumber === i).incrementInstances(this.instances)
            }
        }
    }

    incrementInstances(value) {
        this.instances += value
    }
}

class Game {
    constructor(fileLines) {
        this.rounds = fileLines.length + 1
        this.cards = fileLines.map(line => {
            const [ cardName, cardValue ] = line.split(':')
            const cardNumber = cardName.split(' ').at(-1)
            return new Card(Number(cardNumber), cardValue.trim(), this)
        })
    }

    play() {
        this.cards.forEach(card => {
            card.resolveRound()
        });
        return this
    }

    getScore() {
        return this.cards.reduce((acc, val) => {
            return acc + val.instances
        }, 0)
    }
}

console.log(new Game(fileLines).play().getScore())