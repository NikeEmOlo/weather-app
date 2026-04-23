import { displaySuggestions } from "./display.js";

let keyPressTimer;

function initSearch() {
    const searchForm = document.querySelector("#search-form")
    const searchBar = document.querySelector("#search-bar")

    searchForm.addEventListener("submit", searchValidation)
    searchBar.addEventListener("input", searchSuggestionHandler)
}

function searchSuggestionHandler(e) {
    const query = e.target.value
    const inputEl = e.target
    clearTimeout(keyPressTimer)
    
    keyPressTimer = setTimeout(() => {
        fetchCitySuggestions(inputEl, query)
    }, 100);
}

async function fetchCitySuggestions(inputEl, query) {
    try{
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=city&limit=5&lang=en&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`)
        const data = await response.json()
        displaySuggestions(inputEl, data.results)
    } catch(e) {
        console.error(e)
    }
}




export {
    initSearch,
}