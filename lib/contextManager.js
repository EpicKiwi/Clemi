const GLOABAL_CLEMI_CONTEXT = "$$CLEMI_CONTEXT"

function getGlobalContext(){
    if(!window[GLOABAL_CLEMI_CONTEXT]){
        window[GLOABAL_CLEMI_CONTEXT] = {}
    }
    return window[GLOABAL_CLEMI_CONTEXT]
}

function getContextOf(contextId){
    let context = getGlobalContext()

    if(!context[contextId]){
        context[contextId] = {}
    }

    return context[contextId]
}

module.exports = {
    getGlobalContext,
    getContextOf
}