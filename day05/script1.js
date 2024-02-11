const { readFileSync } = require('fs');

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}
  
const fileLines = syncReadFile('./input.txt')

class Almanac {
    constructor(fileLines) {
        this.seeds = this.getSeeds(fileLines)
        this.maps = this.getMaps(fileLines)
    }

    /**
     * get seeds from input file lines
     * @constructor
     * @param {string[]} fileLines - Lines of input file
     */
    getSeeds(fileLines) {
        const seedsLine = fileLines[0]
        return seedsLine
            .split(': ')[1]
            .split(' ')
            .map(Number)
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

    /**
     * Get location from seed value
     * @constructor
     * @param {number} seedValue - Lines of input file
    */
    getLocation(seedValue) {
        let item = {
            type: 'seed',
            value: seedValue
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

const almanac = new Almanac(fileLines)
const results = almanac.seeds.map(seed => {
    return almanac.getLocation(seed)
})
const res = results.map(item => item.value)
console.log(res.sort((a, b) => a - b)[0])