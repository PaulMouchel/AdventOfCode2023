const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./input.txt')

class Set {
    constructor(value){
        this.value = value
        const cubesStr = value.split(",").map(set => set.trim())
        this.cubes = cubesStr.reduce((acc, val) => {
            const [ value, color ] = val.split(" ")
            return {
                ...acc,
                [color]: Number(value)
            }
        }, {})
    }
}

class Game {
    constructor(value, index){
        this.sets = value.split(";").map(set => new Set(set.trim()))
        this.index = index
    }

    getMinimumCubes() {
        const cubesBySet = this.sets.map(set => set.cubes)
        const initialValue = { 
            red: 0, 
            green: 0, 
            blue: 0 
        }
        return cubesBySet.reduce((acc, val) => {
            const value = { ...initialValue, ...val }
            return {
                red: acc.red > value.red ? acc.red : value.red,
                green: acc.green > value.green ? acc.green : value.green,
                blue: acc.blue > value.blue ? acc.blue : value.blue,
            }
        }, initialValue)
    }

    getPower() {
        const minimumCubes = this.getMinimumCubes()
        return minimumCubes.red * minimumCubes.green * minimumCubes.blue
    }
}

const games = fileLines.map((line, index) => {
    const gameValue = line.split(':')[1]
    return new Game(gameValue, index + 1)
})

console.log(games.reduce((acc, game) => acc + game.getPower(), 0))