const {shell} = require("electron")

require("./HelloWorld")

let modal = document.getElementById("modal")

modal.addEventListener("doc",(e) => {
    shell.openExternal("https://www.npmjs.com/package/clemi")
})


modal.addEventListener("star",(e) => {
    shell.openExternal("https://github.com/EpicKiwi/Clemi")
})