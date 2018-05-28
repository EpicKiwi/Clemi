require("./WelcomeUser")

const Rx = require("rxjs/Rx")

const welcome = document.getElementById("welcome")

Rx.Observable.fromEvent(document.getElementById("username"),"keyup").subscribe((e) => {
    welcome.username = e.target.value
})

Rx.Observable.fromEvent(document.getElementById("hide-desc"),"click").subscribe((e) => {
    welcome.hideDescription = e.target.checked
})