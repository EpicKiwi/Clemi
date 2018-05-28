const clemi = require("../../lib/index")

const Component = clemi.Component

window.customElements.define('welcome-user',
    class WelcomeUser extends Component {

        static get props(){return {
            "username": {},
            "hideDescription": {type: "bool"}
        }}

        constructor() {
            super();

            // language=HTML
            this.template = `
                    <div class="welcome-user">
                        <h3 id="title" >Welcome <span id="username" class="username"></span></h3>
                        <p id="description" >Nice to meet you ! What can we do fore you ?</p>
                    </div>`

            // language=CSS
            this.style = `
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    p:not(:last-child) {
                        margin-bottom: 10px;
                    }
                    
                    .username {
                        color: #da3d00;
                    }
                    
                    .hidden {
                        display: none;
                    }`

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