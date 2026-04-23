class Element {
    constructor(tag = "div", classNames = [], attributes = {}, eventListenerFns = {}) {
        this.el = document.createElement(tag)
        
        classNames.forEach((className) => {
            this.el.classList.add(className)
        })

        Object.entries(attributes).forEach(([key, value]) => {
            this.el.setAttribute(key, value)
        })

        Object.entries(eventListenerFns).forEach(([key, value])=> {
            this.el.addEventListener(key, value)
        })
    }
}