import {searchValidation, searchSuggestionHandler, setselectedCityData} from "./search.js"
import { applyStyleList } from "./helpers.js"

let weatherDisplayed = false;

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

        if (typeof data === "string") {
            const listItem = new Element("li", ["suggestion"], {}, {})
            listItem.el.textContent = data
            this.el.appendChild(listItem.el)
        } else if (data.length === 0) {
            const listItem = new Element("li", ["suggestion"], {}, {})
            listItem.el.textContent = "Type at least three letters"
            this.el.appendChild(listItem.el)
        } else {
            data.forEach((d) => {
                const listItem = new Element("li", ["suggestion"], {}, eventListenerFns)
                listItem.el.textContent = `${d.name}, ${d.country}`
                listItem.el.dataset.stateCode = d.stateCode
                listItem.el.dataset.id = d.id
                listItem.el.dataset.lat = d.lat
                listItem.el.dataset.lon = d.lon
                this.el.appendChild(listItem.el)
            })
        }
    }
}

// ------------------------------------SEARCH BAR---------------------------------------------//
function initSearch() {
    const searchForm = document.querySelector("#search-form")
    const searchBar = document.querySelector("#search-bar")

    searchForm.addEventListener("submit", searchValidation)
    searchBar.addEventListener("input", searchSuggestionHandler)
}

function displaySuggestions(inputEl, cities) {
    const existingList = document.querySelector(".suggestion-list")
    if (existingList) {
        existingList.remove()
    } 
    const suggestions = new SearchSuggestions({click: (e) => fillInputBox(e, inputEl)}, cities)
    document.querySelector("#search-form").appendChild(suggestions.el)
}

function fillInputBox(e, inputEl) {
    inputEl.value = e.target.textContent;
    inputEl.setCustomValidity("")
    setselectedCityData(e.target.dataset, inputEl.value)
}
//-------------------------------------DISPLAY CITY WEATHER FORECAST-------------------------------------//

function displayCityWeather(weather) {
//----------------------PAGE WRAPPER----------------------//
    const page = document.querySelector("#main-page-wrap")
    page.classList.add("weather")

//----------------------SEARCH BAR----------------------//
    const searchWrap = document.querySelector("#search-form")
    page.classList.add("weather")

    applyStyleList(searchWrap, searchConfig.styles)

//------------------WEATHER ICON WRAPPER----------------------------//
    const iconWrap = new Element("div", ["icon-wrap"], {}, {})
    let iconWrapConfig = {
        styles: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }
    }
    applyStyleList(iconWrap.el, iconWrapConfig.styles)
    page.appendChild(iconWrap.el)

//----------------------ICON----------------------------//
    const icon = new Element("img", [".weather-icon"], {
        src: `https://cdn.meteocons.com/3.0.0-next.10/svg/fill/${weather.iconName}.svg`
    }, {})
    let iconConfig = {
        styles: {
            height: "300px",
            width: "auto",
        }
    }
    applyStyleList(icon.el, iconConfig.styles)
    iconWrap.el.appendChild(icon.el)

//--------------------INFO BAR-----------------------//
    const infoWrap = new Element("div", ["info-wrap"], {}, {},)
    let infoWrapConfig = {
        styles: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // height: "clamp(150px, 30vh, 40%)",
            minHeight: "50vh",
            width: "100%",
            backgroundColor: "red",
        }
    }
    applyStyleList(infoWrap.el, infoWrapConfig.styles)
    page.appendChild(infoWrap.el)
}


export {
    initSearch,
    displaySuggestions,
    displayCityWeather,
}