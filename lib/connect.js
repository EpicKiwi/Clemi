function connect(componentClass){
    return class connected extends componentClass {
        static get $isConnected(){
            return true;
        }

        static get connectedProps(){
            return {
                ...componentClass.connectedProps,
                ...componentClass.props
            }
        }

        static get props(){
            return {}
        }

        constructor(){
            super();
            if(!this.$connectedPropsValues){
                this.$connectedPropsValues = {}
            }
        }

        $getProps(){
            return {...this.constructor.props,...this.constructor.connectedProps}
        }

        $getProperty(propName,prop){
            if(componentClass.$isConnected){
                return super.$getProperty(propName,prop)
            }
            if(this.constructor.connectedProps[propName]){
                return {
                    get: () => prop.fromValue(this.$connectedPropsValues[propName]),
                    set: (val) => {
                        let newVal = prop.toValue(val);
                        let oldVal = this.$connectedPropsValues[propName];
                        this.$connectedPropsValues[propName] = newVal;
                        this.$callPropCallback(prop,oldVal,newVal)
                    }
                }
            }
            return super.$getProperty(propName,prop)
        }

    }
}

module.exports = {connect}