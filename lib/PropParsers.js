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
        return input || this.default
    }

}

class NumberParser extends StringParser {

    static get defaultValue(){
        return 0
    }

    fromValue(input){
        return input ? parseFloat(input) : this.default
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
        return input ? JSON.parse(input) : this.default
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

const TYPES_EQUIVALENTS = [
    {type: String, parser: StringParser},
    {type: Number, parser: NumberParser},
    {type: Object, parser: ObjectParser},
    {type: Array, parser: ObjectParser},
    {type: Boolean, parser: BooleanParser}
]

module.exports = {
    string: StringParser,
    number: NumberParser,
    object: ObjectParser,
    boolean: BooleanParser,
    TYPES_EQUIVALENTS
}