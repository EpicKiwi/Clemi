class StringParser {

    static get defaultValue(){
        return ''
    }

    constructor(options){
        this.type = "string"
        this.callback = options.callback
        this.default = options.default || this.constructor.defaultValue
    }

    toValue(input){
        return input
    }

    fromValue(input){
        return input
    }

}

class NumberParser extends StringParser {

    static get defaultValue(){
        return 0
    }

    fromValue(input){
        return parseFloat(input)
    }

}

class ObjectParser extends StringParser {

    static get defaultValue(){
        return null
    }

    toValue(input){
        return JSON.stringify(input)
    }

    fromValue(input){
        return JSON.parse(input)
    }

}

class BooleanParser extends StringParser {
    static get defaultValue(){
        return false
    }


    fromValue(input){
        return !!((input || input === "" ) && input !== "false");
    }

    toValue(input){
        return input ? 'true' : null;
    }
}

module.exports = {
    string: StringParser,
    number: NumberParser,
    object: ObjectParser,
    boolean: BooleanParser
}