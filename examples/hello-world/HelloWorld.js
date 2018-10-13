const clemi = require("../../lib/index")

require("./ModalCard")
require("./FlatButton")

module.exports = clemi.define(class HelloWorld extends clemi.Component {

    onDocClicked(){
        this.dispatchEvent(new Event("doc"))
    }

    onStarClicked(){
        this.dispatchEvent(new Event("star"))
    }

    static get template(){
        //language=HTML
        return `
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
                
                p {
                    margin-bottom: 10px;
                }
                
                pre {
                    text-align: center;
                }
                
            </style>
            <modal-card with-toolbar>
            
                <h1 slot="title" >Hello, <slot>world</slot> !</h1>
            
                <p>Welcome to the <strong>Clemi</strong> webcomponents library. That library is a helper for the v1 Web Components usable in any Electron application.</p>
            
                <p>This modal is a Web Component composed of 2 sub components. Try adding a name in child of the component.</p>
                
                <pre>&lt;hello-world&gt;Steve&lt;/hello-world&gt;</pre>
                
                <flat-button 
                        slot="toolbar" 
                        class="primary" 
                        data-on-click="onDocClicked"
                >Read the doc</flat-button>
                <flat-button 
                        slot="toolbar"
                        data-on-click="onStarClicked"
                >Star</flat-button>
            
            </modal-card>`
    }
});