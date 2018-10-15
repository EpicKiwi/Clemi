const ID_COMPONENTS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

const ID_LENGTH = 5;

let pastIds = new Set()

function generateId(prefix){

    let finalId = ''

    do {

        let uid = Array.from({length: ID_LENGTH}, (el, index) => 1).reduce((acc) => {
            return acc + ID_COMPONENTS[Math.floor(Math.random() * ID_COMPONENTS.length)]
        }, '')

        finalId = prefix ? `${prefix.toLowerCase()}-${uid}` : uid

    }while (pastIds.has(finalId))

    pastIds.add(finalId)

    return finalId;
}

module.exports = {
    generateId
}