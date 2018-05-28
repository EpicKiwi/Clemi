const clemi = require("../lib/index")

const Component = clemi.Component
const template = clemi.template
const Rx = require("rxjs/Rx")

window.customElements.define('welcome-user',
    class WelcomeUser extends Component {

        static get props(){return {
            "username": {},
            "hideDescription": {type: "bool"}
        }}

        constructor() {
            super();
            this.template = template`
<style>
    .hidden {
        display: none;
    }
</style>

<div class="welcome-user">
    <h3 id="title" >Welcome <span id="username"></span></h3>
    <p id="description" >Nice to meet you ! What can we do fore you ?</p>
</div>`
            this.props.username.onChange.subscribe(() => this.update())
            this.props.hideDescription.onChange.subscribe(() => this.update())
        }

        update(){
            this.elements.username.innerHTML = this.username
            this.hideDescription ?
                this.elements.description.classList.add("hidden") :
                this.elements.description.classList.remove("hidden")
        }

        connectedCallback() {
            this.update()
        }

        disconnectedCallback() {
        }

    });