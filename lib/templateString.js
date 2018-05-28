function template(strings, ...vars){

    let htmlString =
        strings.map((string,i) => {

            if(vars[i]){
                return string+vars[i]
            } else {
                return string
            }

        }).join("")

    let template = document.createElement("template")

    template.innerHTML = htmlString

    return template
}

module.exports = template