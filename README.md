# Clemi

> A simple Web Component helper library

Clemi is a simple Web Component library.
It's doesn't provide any Polyfill and currently only work on CommonJS environments (ex Electron).
The goal of clemi is to provide a simple and time-saving way to define webcomponents. Clemi is inspired by components-based frameworks like VueJS and react.

With Clemi you can create powerfull components with less code.

## Installation

Just install Clemi like any other npm package and add it to your dependancies.

```bash
npm install clemi --save
```

## Guide

This guide is a little tutorial covering all the Clemi functionalities and helpers.
All the code will be written with last ES6 features.

### Component definition

With Clemi the component definition is non-verbose and easy.

```javascript
const {define,Component} = require("clemi")

module.exports = define(class MyFirstComponent extends Component {
    
})
```

Let's decompose this code...

With `require("clemi")` we import the library and expose the `define` function and `Component` class.

The `define` function is a simple wrapper of the normalized `window.customElements.define` taking a simple class as parameter. This function will define the component based on the class name uncamelized. In this case, the component declared will be `my-first-component`.

The class `MyFirstComponent` is your component class, the content is all to you and we will see later how to use it.

The superclass of `MyFirstComponent` is a Clemi defined `Component` class. This class is a wrapper around the `HTMLElement` class. It's defining all the helpers you will use in your components.

Finally, you're exporting the result of the `define` function.
The return value is simply the class itself.
So you're exporting the class after defining the component into `window`.
It will be useful for your future inherited components.

Now you have your component and you can use it in your DOM.

```html
<body>
    <script>require("./MyFirstComponent")</script>
    <my-first-component></my-first-component>
</body>
```

Don't forget :

* **Import** your component file with `require` at least one time in your application, if not you're not defining your component in `window`
* The **name** of your component is the name of the class uncamelized (also called kebab-case)

### Template and Shadow DOM

Clemi uses the shadow DOM to create the template of your component.
To define the template of a component you can do it by creating a *static getter* called `template` returning a string representing the template of your component.

```javascript
const {define,Component} = require("clemi")

module.exports = define(class FlatButton extends Component {
    
    static get template(){
        return `
            <button>My flat button</button>
        `
    }
    
})
```

In this code, we are defining a component called FlatButton (with the `flat-button` tag) and we giving it the HTML template of the string.

Now you can see your component with a shadow DOM attached and the content of the template mounted in it.

![A simple button with "My flat button" written in it](./doc/img/flat-button.png)


> If you need the root of the shadow dom in your code it's available below the property `this.root` of the component and it will be `null` if there is no template defined

#### Scoped style

With the power of the shadow DOM, all the style defined in it is scoped so you can define the style of the component inside a `style` stage in the template.
It will not affect the rest of the page.

```javascript
const {define,Component} = require("clemi")

module.exports = define(class FlatButton extends Component {
    
    static get template(){
        return `
            <style>
                button {
                    padding: 10px;
                    background-color: #f65c14;
                    border: none;
                    border-radius: 3px;
                    box-shadow: rgba(0,0,0,0.3) 0 3px 10px;
                    color: white;
                    text-transform: uppercase;
                }
            </style>
            <button>My flat button</button>
        `
    }
    
})
```

![The styled component with a regular button below with no style](./doc/img/styled-flat-button.png)

#### Get a DOM element

In the Clemi philosophy, the id of an element is only used to select an element in the tree to interact with it through your code.
When a component is defined, constructed and the Shadow DOM mounted, Clemi will analyse all the template and find the elements with and `id` attribute.
The elements will be stored under the `this.el` property with a camelized name of the `id`

```javascript
const {define,Component} = require("clemi")

module.exports = define(class FlatButton extends Component {
    
    static get template(){
        return `
            <button id="the-big-button" >My flat button</button>
        `
    }
    
    connectedCallback(){
        super.connectedCallback()
        this.el.theBigButton.innerHTML = "An awesome text"
    }
    
})
```

![The previous button with the text "An awesome text" inside](./doc/img/overwritten-text.png)

In this example we redefining the text of the button during the connection with the reference inside the `this.el` property.
The reference is made during the construction of the component and is available all the time.

Df you're adding dynamically a element with `id` attribute to your template, the element will be added to `this.el`.

> `connectedCallback` is a normalized method executed when the component is created and connected to the DOM. [More info on MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks)
> Don't forget to call the super method of `connectedCallback`, it's used to properly call the properties callbacks (see below).

#### Event handling

Clemi alo helps you to handle the events of your component by creating handlers on elements.

On any HTML element of your template you can add the `data-on-*` attribute to associate a local method to an event.

For example on our button, we can add a `data-on-click` attribute to connect an event with a local method.
The value of the attribute is the name of the method.

```javascript
const {define,Component} = require("clemi")

module.exports = define(class FlatButton extends Component {
    
    static get template(){
        return `
            <button data-on-click="onAwesomeClick" >My awesome button</button>
        `
    }
    
    onAwesomeClick(e){
        console.log("TODO : Do cool stuff");
    }
    
})
```

Don't worry, the `onAwesomeClick` is called with your component bound. So you can use `this` without fear of an undefined property.

Finally, if you're adding dynamically a element with `data-on-*` attribute to your template, the event will be handled too.
 It's achieved by watching the shadow DOM tree with a `MutationObserver`.
 
### Properties

Clemi allow you to define easily the properties of your component liked to the associated attribute.

First of all you need to define the properties of your component inside a *static getter* called `props` like so :

```javascript
const {define,Component} = require("clemi")

module.exports = define(class FlatButton extends Component {
    
    static get props(){
        return {
            myColor: {type:String,callback:'onColorChanged'},
            largeButton: {type:Boolean,callback:'onLargeChanged'}
        }
    }
    
    onColorChanged(oldVal,newVal){ /* Do stuff */ }
    onLargeChanged(oldVal,newVal){ /* Do stuff */ }
    
})
```
```html
<flat-button my-color="#ddd" large-button></flat-button>
```

The result of this getter is an object with a property per key.
Each property definition can have the following properties :

* `type` : The type of the property (default:`String`)
* `callback` : The name of a local method to call when the property change (default : no callback)
* `default` : The default value of the property

The type of tha property can be the following and define the parsing method of the attribute :

* `String` : The default, no parsing
* `Number` : Parsed as float
* `Boolean` : `true` if the attribute is present, `false` otherwise or if the attribute value is exactly `"false"`
* `Object` or `Array` : Serialized as Json and parsed as Json

Anywhere in your component code you can access to the value of the properties through the `this.props` property.
Celmi define a getter and a setter inside `this.props` for each property you're defining.
The getter will parse the attribute value and the setter will serialize and set the new value of the attribute.

> **WARNING** using the setter of a property change the value and call the callback associated to the property (see below)

When the attribute value change, the callback associated to the property (if it's defined) is called with two parameters.
The old value of the attribute and the new value. 

> These two values are not parsed so prefer use `this.props` instead to get the current value of the property.

## API reference

### `define(componentClass:Class extends clemi.Component):Class`

Define the component of the class given and return the same class

### `Component`

Wrapper around the `HTMLElement` class.
`Component` class is used as superclass to create Clemi components.

> Clemi uses the `$` and `$$` prefixed function as private functions. To prevent overwrite, please use another prefix like `$_` of `_`.

#### Properties

* `el` : The property containing all the HTML elements of the template with an attribute `id`
* `root` : The property containing the root of the shadow dom if a template if defined (`null` otherwise)
* `props` : The property containing the value of each defined properties

#### Static methods

* `get template():string` : The getter defining the template in the shadow DOM of the component (not defined by default) *see "Template and Shadow DOM" part of the guide*
* `get props():Object` ; The getter defining the properties of the component *see "Properties" part of the guide*

#### Overwritable methods

> Always call the superclass method before any operation

* `connectedCallback():void` : Called by the browser when the component is collected to the DOM
* `attributeChangedCallback(attrName:string,oldVal:string,newval:string):void` : Called by the browser when an observed attribute change

#### Overwritable static methods

> Always call the superclass method before any operation

* `get observedAttributes():string[]` : The getter defining to the browser the attributes to watch

## To Do

There is some ideas of improvement for the next versions

* [ ] Add `required` parameter for the properties
* [ ] Add `validation` parameter for the properties
* [ ] Allow to create custom parsers for properties
* [ ] Create a Context system like [React's one](https://reactjs.org/docs/context.html)

## Contributing

You want to contribute to Clemi ? Awesome !

You can contribute by correcting english mistakes in the Docs.
Or by adding [an issue](https://github.com/EpicKiwi/Clemi/issues) if you found a bug.
Or better, by creating a [pull request](https://github.com/EpicKiwi/Clemi/pulls).

Or you can simply give me your feedback and your ideas for the next versions

## Changelog

* 2.0.0 : Major change of all the Component API
* 1.0 : You don't want to know what's the v1 looks like