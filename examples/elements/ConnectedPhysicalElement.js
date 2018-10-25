const { define, Component, types, connect } = require("../../lib/index")
const PhysicalElement = require("./PhysicalElement")

module.exports = define(class ConnectedPhysicalElement extends connect(PhysicalElement) {

    static get props(){
        return {
            counter: new types.number({callback:"onIncrement",default:1})
        }
    }

    constructor(){
        super();
        this.name = "Connected"
    }

    connectedCallback(){
        super.connectedCallback();
        this.intervalId = setInterval(() => this.counter++, 1000)
    }

    diconnectedCallback(){
        clearInterval(this.intervalId);
    }

    onIncrement(){
        this.atomicNumber = this.counter % 100
    }

})