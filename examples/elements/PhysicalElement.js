const { define, Component, types, html } = require("../../lib/index");

module.exports = define(class PhysicalElement extends Component {
  static get props() {
    return {
      name: { type: String, callback: "renderName" },
      atomicNumber: { type: Number, callback: "renderAtomic", default: null }
    };
  }

  renderName() {
    this.el.name.innerHTML = this.name;
    this.el.symbol.innerHTML = this.symbol;
    this.style.color = this.color;
  }

  renderAtomic() {
    if (this.atomicNumber) {
      this.el.atomic.innerHTML = this.atomicNumber;
    } else {
      this.el.atomic.innerHTML = "";
    }
  }

  get symbol() {
    let { name } = this;
    if (name) {
      return name.charAt(0).toUpperCase() + name.charAt(1).toLowerCase();
    }
    return "";
  }

  get color() {
    if (!this.name) return "#383838";
    let { name } = this;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    let c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + ("00000".substring(0, 6 - c.length) + c);
  }

  static get template() {
    //language=html
    return html`
      <style>
        * {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }

        :host {
          display: block;
          width: 100px;
          height: 100px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          border: solid 5px currentColor;
        }

        :host(.intermediate) {
          border-style: dashed;
        }

        .container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 5px;
        }

        .symbol-container {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: center;
        }

        .symbol {
          flex: 1;
          font-size: 55px;
          font-family: serif;
          font-weight: bold;
        }

        .atomic {
          margin-top: 10px;
        }

        .full-name {
          text-align: center;
        }
      </style>
      <div class="container">
        <div class="symbol-container">
          <div class="symbol" id="symbol"></div>
          <div class="atomic" id="atomic"></div>
        </div>
        <div class="full-name" id="name"></div>
      </div>
    `;
  }
});
