const decamelize = require("decamelize");
const camelcase = require("camelcase");

class Component extends HTMLElement {
    constructor() {
        super();

        this.el = {};

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
                callback.bind(this)(undefined, this[key], null)
            })
        }
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

    $getProps(){
        return this.constructor.props
    }

    $getPropertyToDefine(propAttrName,prop){
        return {
            get: () => {
                let value = this.hasAttribute(propAttrName) ? this.getAttribute(propAttrName) : null;
                return prop.fromValue(value);
            },
            set: (val) => {
                let newVal = prop.toValue(val)
                if(newVal === null || newVal === undefined){
                    return this.removeAttribute(propAttrName);
                }
                return this.setAttribute(propAttrName,newVal);
            }
        }
    }

    $defineProps() {
        let props = this.$getProps()
        if (!props) return;
        Object.keys(props).forEach(propName => {
            let prop = props[propName];
            let propAttrName = getPropAttributeName(propName);
            let property = this.$getPropertyToDefine(propAttrName,prop) ;
            property.enumerable = true;
            Object.defineProperty(this, propName, property);
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
