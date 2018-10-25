require("./PhysicalElement")

let element = document.getElementById("custom");
let formName = document.getElementById("form-name");
let formAtomic = document.getElementById("form-atomic");

formName.addEventListener("keyup",() => element.name = formName.value);

formAtomic.addEventListener("keyup",() => element.atomicNumber = formAtomic.value);
formAtomic.addEventListener("change",() => element.atomicNumber = formAtomic.value);