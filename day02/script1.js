const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./input.txt')

const maxCapacity = {
    red: 12, 
    green: 13, 
    blue: 14
}

const games = fileLines.map(line => line.split(':')[1].trim())

const countCubes = (set) => {
    const cubes = set.split(',').map(cubes => cubes.trim())
    return cubes.reduce((acc, val) => {
        const [ value, color ] = val.split(" ")
        return {
            ...acc,
            [color]: Number(value)
        }
    }, {})
}

const getSets = (game) => {
    return game.split(";").map(set => set.trim())
}

let gamesOk = []

for (let i = 0; i < games.length; i++) {
    const game = games[i]
    const sets = getSets(game)

    let setsOk = true

    sets.forEach(set => {
        const count = countCubes(set)
        Object.keys(count).forEach(key => {
            if (count[key] > maxCapacity[key]) {
                setsOk = false
            }
        })
    });

    if (setsOk) {
        gamesOk.push(i + 1)
    }
}

console.log(gamesOk.reduce((acc, val) => acc + val, 0))