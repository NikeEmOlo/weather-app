// ------------------------------------CREATE ELEMENT CLASSES----------------------------------//
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

class Text extends Element {
  constructor(tag, textContent = "", classNames = [], attributes = {}, eventListenerFns = {}) {
    super(tag, classNames, attributes, eventListenerFns);
    this.el.textContent = textContent;
  }
}

class SearchSuggestions extends Element {
    constructor(eventListenerFns = {}, data) {
        super("ul", ["suggestion-list"], {}, {})

        if (data.length > 0) {
            data.forEach((d) => {
                const listItem = new Element("li", ["suggestion"], {}, eventListenerFns)
                listItem.el.textContent = `${d.city}, ${d.state}`
                this.el.appendChild(listItem.el)
            })
        } else {
            const listItem = new Element("li", ["suggestion"], {}, eventListenerFns)
            listItem.el.textContent = "Type at least three letters"
            this.el.appendChild(listItem.el)
        }

    }
}

// ------------------------------------SEARCH BAR---------------------------------------------//
function displaySuggestions(inputEl, data) {
    const existingList = document.querySelector(".suggestion-list")
    if (existingList) {
        existingList.remove()
    } 
    const suggestions = new SearchSuggestions({
        click: (e) => {
            inputEl.value = e.target.textContent
        }}, data)
    document.querySelector("#search-form").appendChild(suggestions.el)
}


export {
    displaySuggestions,
}