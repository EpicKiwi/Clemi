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

    toAttribute(element,attributeName,value){
        if(value) {
            element.setAttribute(attributeName,this.toValue(value))
        } else {
            element.removeAttribute(attributeName)
        }
    }

    fromAttribute(element,attributeName){
        if(element.hasAttribute(attributeName)){
            return this.fromValue(element.getAttribute(attributeName))
        } else {
            return this.default
        }
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

    fromAttribute(element,attributeName){
        return element.hasAttribute(attributeName) &&
            !(element.getAttribute(attributeName) == "false")
    }

    toAttribute(element,attributeName,value){
        if(value){
            element.setAttribute(attributeName,"true");
        } else {
            element.removeAttribute(attributeName);
        }
    }
}

module.exports = {
    string: StringParser,
    number: NumberParser,
    object: ObjectParser,
    boolean: BooleanParser
}