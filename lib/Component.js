const decamelize = require("decamelize");
const camelcase = require("camelcase");

class Component extends HTMLElement {
    constructor() {
        super();

        this.el = {};

        this.$mountShadowTemplate();
        this.$defineProps();

        this.$watchProps();
        this.$watchShadowDom();
    }

    connectedCallback(){
        Object.keys(this.props).forEach((key) => {
            let callback = this.props[key].callback.bind(this)
            callback(undefined,this[key],null)
        })
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
        if (!this.props) return;

        Object.keys(this.props).forEach(propName => {
            let prop = this.props[propName];
            let propAttrName = this.$$getPropAttributeName(propName);
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
                        get: () => this.hasAttribute(propAttrName),
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
            Object.defineProperty(this, propName, property);
        });
    }

    $watchProps() {
        if (!this.props) return;
        this.$propsObserver = new MutationObserver(mutations => {
            let observedAttributes = Object.keys(this.props).map(el => {
                return { attribute: this.$$getPropAttributeName(el), name: el };
            });

            mutations.forEach(mutation => {
                let observable = observedAttributes.find(
                    el => el.attribute == mutation.attributeName
                );
                if (!observable) return;
                if (this.props[observable.name].callback) {
                    return this.props[observable.name].callback.bind(this)(
                        mutation.oldValue,
                        this[observable.name],
                        mutation
                    );
                }
            });
        });
        this.$propsObserver.observe(this, { attributes: true });
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

    $$getPropAttributeName(propName) {
        return decamelize(propName, "-");
    }
}



module.exports = Component;
