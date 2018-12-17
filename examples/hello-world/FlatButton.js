const clemi = require("../../lib/index");

module.exports = clemi.define(
  class FlatButton extends clemi.Component {
    static get template() {
      //language=HTML
      return clemi.html`
            <style>
                .button {
                    background: var(--theme-dark-background);
                    color: currentColor;
                    text-transform: uppercase;
                    border: none;
                    font-size: inherit;
                    padding: 7px;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: ease 0.3s box-shadow;
                }
                
                :host(.primary) .button {
                    background: var(--theme-primary);
                    color: var(--theme-on-primary);
                }
                
                .button:hover, .button:focus {
                    box-shadow: rgba(0,0,0,0.3) 0 3px 10px;
                }
                
                .button:active {
                    box-shadow: none;
                }
                
            </style>
            <button class="button" ><slot></slot></button>
        `;
    }
  }
);
