const decamelize = require("decamelize");

function defineComponent(ComponentClass) {
    let componentName = decamelize(ComponentClass.name, "-");
    window.customElements.define(componentName, ComponentClass);
    return ComponentClass;
}

module.exports = {
    defineComponent
}