const clemi = require("../../lib/index")

module.exports = clemi.define(class ModalCard extends clemi.Component {

    static get props(){
        return {
            withToolbar: {type:Boolean,callback:"enableToolbar"}
        }
    }

    enableToolbar(){
        if(this.props.withToolbar){
            this.el.toolbar.classList.add("enable")
        } else {
            this.el.toolbar.classList.remove("enable")
        }
    }

    static get template(){
        // language=HTML
        return `
            <style>             
                .card {
                    padding: 15px;
                    border-radius: 3px;
                    box-shadow: rgba(0,0,0,0.3) 0 5px 15px;
                }
                
                .title {
                    margin-bottom: 10px;
                    color: var(--theme-primary);
                }

                .toolbar {
                    margin-top: 10px;
                    display: none;
                    
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;
                }
                
                .toolbar.enable {
                    display: flex;
                }
                
                .toolbar slot::slotted(*) {
                    display: block;
                    margin: 0 5px !important;
                }
                
            </style>
            <div class="card">
                <div class="title" ><slot name="title"></slot></div>
                <div class="content"><slot></slot></div>
                <nav class="toolbar" id="toolbar"><slot name="toolbar"></slot></nav>
            </div>
        `
    }

})