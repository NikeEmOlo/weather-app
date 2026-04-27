import { displaySuggestions } from "./display.js";
import { fetchWeatherData } from "./weatherService.js"

let keyPressTimer;
let selectedCityData = null;
let selectedCity = "";

function searchSuggestionHandler(e) {
    const query = e.target.value
    const inputEl = e.target

    selectedCityData = null;
    inputEl.setCustomValidity("")

    clearTimeout(keyPressTimer)
    
    keyPressTimer = setTimeout(() => {
        fetchCitySuggestions(inputEl, query)
    }, 100);
}

function searchValidation(e) {
    e.preventDefault(); // Block form submission
    const input = document.querySelector("#search-bar")
    input.setCustomValidity("")
    if (!selectedCityData) {
        input.setCustomValidity("Select a valid city from the list")
        input.reportValidity();
        return
    } else {
        input.setCustomValidity("");
        fetchWeatherData(selectedCityData)
    }
}


async function fetchCitySuggestions(inputEl, query) {
    if (!query.trim()) {
        const existingList = document.querySelector(".suggestion-list")
        if (existingList) existingList.remove()
        return
    }

    try{
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=city&limit=5&lang=en&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`)
        
        if(!response.ok) {
            throw new Error(`Request failed: ${response.status}`)
        }
        
        const data = await response.json()

        if (data.results.length === 0) {
            displaySuggestions(inputEl, "Hmm, we can't find what you're looking for")
        } else {
            const cityData = extractCityData(data.results)
            displaySuggestions(inputEl, cityData)
        }

    } catch(e) {
        displaySuggestions(inputEl, "Something went wrong")
        console.error(e)
    }
}

function extractCityData(data) {
    let cityData = []
    data.forEach((city) => {
        const cityInfo = {
            name: city.city,
            country: city.country,
            stateCode: city.state_code,
            lat: city.lat,
            lon: city.lon,
            id: city.place_id,
        }
        cityData.push(cityInfo)
    });
    return cityData;
}

function setselectedCityData(data, city) {
    selectedCityData = data
    selectedCity = city
    return selectedCityData
}

function searchBarKeydownHandler(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (selectedCityData) searchValidation(e);
}

export {
    searchSuggestionHandler,
    searchValidation,
    searchBarKeydownHandler,
    setselectedCityData,
}