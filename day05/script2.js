const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./exemple1.txt')

class Seed {
    constructor(value, maps) {
        this.value = value
        this.maps = maps
    }

    /**
     * Get location from seed value
     * @constructor
    */
    getLocation() {
        let item = {
            type: 'seed',
            value: this.value
        }

        while (item.type !== 'location') {
            item = this.convert(item)
        }

        return item
    }

    /**
     * Convert item
     * @constructor
     * @param {{ type: string, value: number }} item
    */
    convert(item) {
        const map = this.maps.find(map => map.from === item.type)

        const fromValue = item.value
        let toValue
        const foundedMap = map.values.find(value => {
            const mapValues = this.getMapValues(value)
            return fromValue >= mapValues.sources.min && fromValue <= mapValues.sources.max
        })

        if (!foundedMap) {
            toValue = fromValue
        } else {
            const values = this.getMapValues(foundedMap)
            toValue = fromValue - values.sources.min + values.destinations.min
        }

        return {
            type: map.to,
            value: toValue
        }
    }

    /**
     * Get Map values
     * @constructor
     * @param {{ destinationRangeStart: number; sourceRangeStart: number; rangeLength: number }} map
    */
    getMapValues(map) {

        const sources = { min: map.sourceRangeStart, max: map.sourceRangeStart + map.rangeLength }
        const destinations = { min: map.destinationRangeStart, max: map.destinationRangeStart + map.rangeLength }

        return { sources, destinations }
    }
}

class SeedRow {
    constructor(from, to, maps) {
        this.from = from
        this.to = to
        this.maps = maps
    }

    /**
     * Get location from seed value
     * @constructor
    */
    getMinimumLocation() {

        let mininmumLocation
        for (let seedValue = this.from; seedValue <= this.to; seedValue++) {
            const seed = new Seed(seedValue, this.maps)
            const seedLocation = seed.getLocation()

            if (!mininmumLocation || seedLocation.value < mininmumLocation) {
                mininmumLocation = seedLocation.value
            }
        }

        return mininmumLocation
    }
}

class Almanac {
    constructor(fileLines) {
        this.maps = this.getMaps(fileLines)
        this.seedRows = this.getSeedRows(fileLines)
    }

    getSeedRows(fileLines) {
        const seedsLine = fileLines[0]

        const seedsConfig = seedsLine
            .split(': ')[1]
            .split(' ')
            .map(Number)

        const seedRows = []

        let currentSeed
        for (let i = 0; i < seedsConfig.length; i++) {
            if (i % 2 === 0) {
                currentSeed = seedsConfig[i]
            } else {
                seedRows.push(new SeedRow(currentSeed, currentSeed + seedsConfig[i] - 1, this.maps))
            }
        }

        return seedRows
    }

    /**
     * Get maps from input file lines
     * @constructor
     * @param {string[]} fileLines - Lines of input file
     * @returns {{ from: string, to: string, values: { 
     *     destinationRangeStart: number, 
     *     sourceRangeStart: number, 
     *     rangeLength: number 
     * }[]}}
     */
    getMaps(fileLines) {
        const fileLinesCopy = [...fileLines]
        fileLinesCopy.shift()
        fileLinesCopy.shift()

        const fileLinesGroups = []

        let group = { values: [] }
        for (const line of fileLinesCopy) {
            if (!'0123456789'.includes(line[0]) && line !== '') {
                group.title = line
            } else if (line !== '') {
                group.values.push(line)
            } else {
                fileLinesGroups.push({...group})
                group = { values: [] }
            }
        }
        fileLinesGroups.push({...group})

        return fileLinesGroups.map(group => {
            const [ titleInfo ] = group.title.split(' ') 
            const [ from, to ] = titleInfo.split('-to-')

            const values = group.values.map(val => {
                const [ destinationRangeStart, sourceRangeStart, rangeLength ] = val.split(' ').map(Number)
                return {
                    destinationRangeStart,
                    sourceRangeStart,
                    rangeLength
                }
            })
            return {
                from,
                to,
                values
            }
        })
    }
}

const almanac = new Almanac(fileLines)

let result

for (let seedRow of almanac.seedRows) {
    console.log({ seedRowFrom: seedRow.from })
    const loc = seedRow.getMinimumLocation()
    if (!result || result > loc) {
        result = loc
    }
}

console.log(result)