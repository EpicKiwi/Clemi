const {define,Component} = require("../../lib/index")

module.exports = define(class ThemeSwitch extends Component {

    static get template(){
        //language=HTML
        return `
            <div class="container">
                <input type="checkbox" data-on-change="onCheckChange" id="check">
                <label for="check">Dark theme</label>    
            </div>
        `
    }

    onCheckChange(){
        console.log(`Current theme : ${this.context.theme}`)
    }

})