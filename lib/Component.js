const decamelize = require("decamelize");
const camelcase = require("camelcase");
const {generateId} = require("./idGenerator")
const {getContextOf} = require("./contextManager")
const DATA_CLEMI_CONTEXT = "clemiContext"

class Component extends HTMLElement {
    constructor() {
        super();

        this.el = {};
        this.props = {};

        this.context = new Proxy({},{
            get: (obj,prop) => this.$contextGetHandler(prop),
            set: (obj,prop,val) => this.$contextSetHandler(prop,val)
        })

        this.$mountShadowTemplate();
        this.$defineProps();

        this.$watchShadowDom();
    }

    connectedCallback(){
        let props = this.constructor.props
        if(props) {
            Object.keys(props).forEach((key) => {
                if (!props[key].callback)
                    return;
                let callback = this[props[key].callback]
                if (!callback)
                    return console.warn(`${this.constructor.name} : No callback named ${props[key].callback} on property ${key}`)
                callback.bind(this)(undefined, this.props[key], null)
            })
        }
    }

    $contextGetHandler(prop){
        let source = this;
        while(source !== document.body){
            let contextId = source.dataset[DATA_CLEMI_CONTEXT]
            if(contextId) {
                let contextValue = getContextOf(contextId)
                if(contextValue[prop]) {
                    return contextValue[prop];
                }
            }

            if(source.parentElement)
                source = source.parentElement
            else if(source.parentNode && source.parentNode.host)
                source = source.parentNode.host
            else{
                return undefined
            }
        }
    }

    $contextSetHandler(prop,val){
        let contextId = this.dataset[DATA_CLEMI_CONTEXT]

        if(!contextId){
            contextId = generateId(this.constructor.name)
            this.dataset[DATA_CLEMI_CONTEXT] = contextId
        }

        let contextValue = getContextOf(contextId)

        contextValue[prop] = val

        return true;
    }

    $mountShadowTemplate() {
        let templateString = this.constructor.template;
        if (!templateString) {
            this.root = null;
            return;
        }

        let template = document.createElement("template");
        template.innerHTML = templateString;

        this.root = this.attachShadow({ mode: "open" });
        this.root.appendChild(template.content.cloneNode(true));

        this.$evaluateElement(this.root.children);
    }

    $defineProps() {
        let props = this.constructor.props
        if (!props) return;

        Object.keys(props).forEach(propName => {
            let prop = props[propName];
            let propAttrName = getPropAttributeName(propName);
            let propType = prop.type || String;
            let property = null;

            let def = null;

            switch (propType) {
                case Number:
                    def = prop.default || 0.0;
                    property = {
                        get: () =>
                            this.hasAttribute(propAttrName)
                                ? parseFloat(this.getAttribute(propAttrName))
                                : def,
                        set: val =>
                            val
                                ? this.setAttribute(propAttrName, val)
                                : this.removeAttribute(propAttrName)
                    };
                    break;
                case Boolean:
                    def = prop.default || false;
                    property = {
                        get: () => this.hasAttribute(propAttrName) && !(this.getAttribute(propAttrName) == "false"),
                        set: val =>
                            val
                                ? this.setAttribute(propAttrName, "")
                                : this.removeAttribute(propAttrName)
                    };
                    break;
                case Array:
                case Object:
                    def = prop.default || null;
                    property = {
                        get: () =>
                            this.hasAttribute(propAttrName)
                                ? JSON.parse(this.getAttribute(propAttrName))
                                : def,
                        set: val =>
                            val
                                ? this.setAttribute(propAttrName, JSON.stringify(val))
                                : this.removeAttribute(propAttrName)
                    };
                    break;
                default:
                    def = prop.default || null;
                    property = {
                        get: () =>
                            this.hasAttribute(propAttrName)
                                ? this.getAttribute(propAttrName)
                                : def,
                        set: val =>
                            val
                                ? this.setAttribute(propAttrName, val)
                                : this.removeAttribute(propAttrName)
                    };
                    break;
            }

            property.enumerable = true;
            Object.defineProperty(this.props, propName, property);
        });
    }

    static get observedAttributes(){
        if(!this.props) return [];
        return Object.keys(this.props).map((key) => getPropAttributeName(key));
    }

    attributeChangedCallback(name,oldVal,newVal){
        let props = this.constructor.props
        let callbackName = props[camelcase(name)].callback

        if(!callbackName) return;

        let callback = this[callbackName]

        if(!callback)
            return console.warn(`${this.constructor.name} : No callback named ${callbackName} on property ${name}`)

        if (callback) {
            return callback.bind(this)(
                oldVal,
                newVal
            );
        }
    }

    $evaluateElement(element) {
        let next = null;

        if (!(element instanceof Array || element instanceof HTMLCollection)) {
            if (!element.$$evaluated) {
                if (element.id) {
                    let elementIdName = camelcase(element.id);
                    this.el[elementIdName] = element;
                }

                Array.from(element.attributes).forEach(attr => {
                    let match = attr.name.match(/^data-on-(.+)$/);
                    if (!match) return;
                    let event = match[1];
                    let fun = attr.value;
                    element.addEventListener(event, this[fun].bind(this));
                });
            }
            element.$$evaluated = true;

            next = Array.from(element.children);
        } else {
            next = element instanceof HTMLCollection ? Array.from(element) : element;
        }

        return next.forEach(el => this.$evaluateElement(el));
    }

    $watchShadowDom() {
        if (!this.root) return;
        this.$shadowDomObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                let elements = Array.from(mutation.addedNodes).filter(
                    el => el instanceof HTMLElement
                );
                elements.forEach(el => this.$evaluateElement(el));
            });
        });
        this.$shadowDomObserver.observe(this.root, {
            childList: true,
            subtree: true
        });
    }
}

function getPropAttributeName(propName) {
    return decamelize(propName, "-");
}

module.exports = Component;
