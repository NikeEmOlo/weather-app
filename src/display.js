import {searchValidation, searchSuggestionHandler, searchBarKeydownHandler, setselectedCityData} from "./search.js"
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
                const listItem = new Element("li", ["suggestion"], {tabindex: "0"}, eventListenerFns)
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
    searchBar.addEventListener("keydown", searchBarKeydownHandler)
}

function displaySuggestions(inputEl, cities) {
    removeSuggestions()
    const suggestions = new SearchSuggestions({
        click: (e) => {
            removeSuggestions()
            fillInputBox(e, inputEl)
        },
        keydown: (e) => {
            if (e.key === "Enter") {
                removeSuggestions()
                fillInputBox(e, inputEl)
            }
        }
    }, cities)
    
    document.querySelector("#search-submit").insertAdjacentElement("beforebegin", suggestions.el)
}

function fillInputBox(e, inputEl) {
    inputEl.value = e.target.textContent;
    inputEl.setCustomValidity("")
    setselectedCityData(e.target.dataset, inputEl.value)
    inputEl.focus()
}

function removeSuggestions() {
    const existingList = document.querySelector(".suggestion-list")
    if(existingList) {
        existingList.remove()
    } else return
}
//-------------------------------------DISPLAY CITY WEATHER FORECAST-------------------------------------//
function displayCityWeather(weather) {
//----------------------PAGE WRAPPER----------------------//
    const page = document.querySelector("#main-page-wrap")
    while (page.children.length > 1) { // Clear page before re-building
        page.lastChild.remove();
    }
    page.classList.add("weather");
    setPageBackground(weather.iconName)

//----------------------SEARCH BAR----------------------//
    const searchWrap = document.querySelector("#search-form")
    searchWrap.classList.add("weather")


//------------------WEATHER ICON WRAPPER----------------------------//
    const iconWrap = new Element("div", ["icon-wrap"], {}, {})
    page.appendChild(iconWrap.el)

//----------------------ICON----------------------------//
    const icon = new Element("img", ["weather-icon"], {
        src: `https://cdn.meteocons.com/3.0.0-next.10/svg/fill/${weather.iconName}.svg`
    }, {})
    iconWrap.el.appendChild(icon.el)

//--------------------INFO BAR-----------------------//
    const infoWrap = new Element("div", ["info-wrap"], {}, {},)
    page.appendChild(infoWrap.el)

    const infoCond = new Text("h1", weather.conditions, ["conditions"], {}, {})
    infoWrap.el.appendChild(infoCond.el)

    const dataDesc = new Text("h2", weather.description, ["description"], {}, {})
    infoWrap.el.appendChild(dataDesc.el)

    const dataWrap = new Element("div", ["data-wrap"], {}, {})
    infoWrap.el.appendChild(dataWrap.el)

//--------------------TEMP STATS-----------------------//
    const temps = {
        Highs: weather.maxTemp,
        "Current Temperature": weather.temperature,
        Lows: weather.minTemp,
    }

    Object.entries(temps).forEach(([key, value]) => {
        const statWrap = new Element("div", ["stat-wrap"], {}, {})
        dataWrap.el.appendChild(statWrap.el)
        const label = new Text("h4", key, ["temp-label"], {}, {})
        statWrap.el.appendChild(label.el)
        const num = new Text("h3", value, ["temp-value"], {}, {})
        statWrap.el.appendChild(num.el)
    })
}

function setPageBackground(icon) {
  let gradient;
  const page = document.querySelector("#main-page-wrap")

  switch (icon) {
    case "clear-day":
      gradient = "linear-gradient(to bottom, #f97316, #fb923c, #7dd3fc, #38bdf8)";
      break;

    case "clear-night":
      gradient = "linear-gradient(to bottom, #0f172a, #1e3a5f, #1e40af)";
      break;

    case "partly-cloudy-day":
      gradient = "linear-gradient(to bottom, #f97316, #fdba74, #93c5fd, #60a5fa)";
      break;

    case "partly-cloudy-night":
      gradient = "linear-gradient(to bottom, #1e293b, #334155, #475569)";
      break;

    case "cloudy":
    case "wind":
      gradient = "linear-gradient(to bottom, #94a3b8, #cbd5e1, #e2e8f0)";
      break;

    case "rain":
      gradient = "linear-gradient(to bottom, #1e3a5f, #2563eb, #60a5fa)";
      break;

    case "showers-day":
      gradient = "linear-gradient(to bottom, #475569, #7dd3fc, #93c5fd)";
      break;

    case "showers-night":
      gradient = "linear-gradient(to bottom, #1e293b, #1e3a5f, #334155)";
      break;

    case "thunder-rain":
      gradient = "linear-gradient(to bottom, #0f172a, #1e293b, #374151)";
      break;

    case "thunder-showers-day":
      gradient = "linear-gradient(to bottom, #1f2937, #374151, #6b7280)";
      break;

    case "thunder-showers-night":
      gradient = "linear-gradient(to bottom, #0f172a, #111827, #1f2937)";
      break;

    case "snow":
      gradient = "linear-gradient(to bottom, #bfdbfe, #e0f2fe, #f0f9ff)";
      break;

    case "snow-showers-day":
      gradient = "linear-gradient(to bottom, #94a3b8, #bfdbfe, #e0f2fe)";
      break;

    case "snow-showers-night":
      gradient = "linear-gradient(to bottom, #1e293b, #334155, #bfdbfe)";
      break;

    case "fog":
      gradient = "linear-gradient(to bottom, #9ca3af, #d1d5db, #e5e7eb)";
      break;

    default:
      console.warn(`setPageBackground: unrecognised icon "${icon}", using fallback gradient`);
      gradient = "linear-gradient(to bottom, #f97316, #fb923c, #7dd3fc, #38bdf8)";
  }

  const darkIcons = new Set([
    "clear-night",
    "partly-cloudy-night",
    "showers-day",
    "showers-night",
    "rain",
    "thunder-rain",
    "thunder-showers-day",
    "thunder-showers-night",
    "snow-showers-night",
  ]);
  page.classList.toggle("dark-bg", darkIcons.has(icon));
  page.style.background = gradient;
}


export {
    initSearch,
    displaySuggestions,
    displayCityWeather,
}