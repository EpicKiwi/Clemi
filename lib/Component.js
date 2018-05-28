const Rx = require("rxjs/Rx")
const kebabCase = require("kebab-case")

class Component extends HTMLElement {

    constructor(){
        super();

        this.elements = {}
        this.events = {}
        this.props = {}

        this.$template = null

        this.$buildPropsObject()
    }

    $mountShadowTemplate(){
        if(!this.template){
            this.root = null
            return
        }

        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(this.template.content.cloneNode(true));

        this.$buildElementsObject()
        this.$buildEventsObject()
    }

    $buildElementsObject(){
        this.elements = {}
        this.root.querySelectorAll("*[id]").forEach((el) => {
            this.elements[el.id] = el
        })
    }

    $buildEventsObject(){
        this.events = {}
        this.root.querySelectorAll("*[data-on]").forEach((el,i) => {
            var elementEvents = {}

            let eventNames = el.hasAttribute('data-on') ? el.getAttribute("data-on").replace(" ","").split(/[,;]/) : []
            eventNames.forEach((eventName) => {
                elementEvents[eventName] = Rx.Observable.fromEvent(el,eventName)
            })

            if(el.id) {
                this.events[el.id] = elementEvents
            }
            this.events[i] = elementEvents
        })
    }

    $buildPropsObject(){
        if(!this.constructor.props) return

        this.props = {}

        if(this.constructor.props instanceof Array){
            this.constructor.props.forEach((el) => {
                this.props[el] = {}
            });
        } else if(this.constructor.props instanceof Object){
            this.props = this.constructor.props
        }

        Object.keys(this.props).forEach((propName) => {
            let prop = this.props[propName]
            prop.name = propName
            prop.attributeName = kebabCase(prop.name)
            prop.onChange = new Rx.Subject()
            prop.type = prop.type || "string"
            let property = null

            switch(prop.type){
                case "array":
                    prop.default = prop.default || []
                    property = {
                        get: () => this.hasAttribute(prop.attributeName) ? this.getAttribute(prop.attributeName).split(",") : prop.default,
                        set: (val) => val ? this.setAttribute(prop.attributeName,val.join(",")) : this.removeAttribute(prop.attributeName)
                    }
                    break;
                case "float":
                    prop.default = prop.default || 0.0
                    property = {
                        get: () => this.hasAttribute(prop.attributeName) ? parseFloat(this.getAttribute(prop.attributeName)) : prop.default,
                        set: (val) => val ? this.setAttribute(prop.attributeName,val) : this.removeAttribute(prop.attributeName)
                    }
                    break;
                case "int":
                    prop.default = prop.default || 0
                    property = {
                        get: () => this.hasAttribute(prop.attributeName) ? parseInt(this.getAttribute(prop.attributeName)) : prop.default,
                        set: (val) => val ? this.setAttribute(prop.attributeName,val) : this.removeAttribute(prop.attributeName)
                    }
                    break;
                case "bool":
                    prop.default = prop.default || false
                    property = {
                        get: () => this.hasAttribute(prop.attributeName),
                        set: (val) => val ? this.setAttribute(prop.attributeName,"") : this.removeAttribute(prop.attributeName)
                    }
                    break;
                default:
                    prop.default = prop.default || null
                    property = {
                        get: () => this.hasAttribute(prop.attributeName) ? this.getAttribute(prop.attributeName) : prop.default,
                        set: (val) => val ? this.setAttribute(prop.attributeName,val) : this.removeAttribute(prop.attributeName)
                    }
                    break;
            }

            Object.defineProperty(this,prop.name,property)
        })

    }

    get template(){
        return this.$template
    }

    set template(val){
        this.$template = val
        this.$mountShadowTemplate()
    }

    static get observedAttributes() {
        let props = []

        if(this.props instanceof Array){

            props = this.props.map((el) => {
                return kebabCase(el)
            });

        } else if(this.props instanceof Object){

            props = Object.keys(this.props).map((propName) => {
                return kebabCase(propName)
            });

        }

        return props;
    }

    attributeChangedCallback(name, oldVal, newVal) {
        let property = Object.values(this.props).find((prop) => prop.attributeName == name)
        if(!property) return

        let eventObject = {
            prop: property,
            rawValues: {
                old: oldVal,
                nec: newVal
            },
            value: this[property.name]
        }

        property.onChange.next(eventObject)
    }

}

module.exports = Component