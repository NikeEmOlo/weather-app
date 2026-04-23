let keyPressTimer;

function initSearch() {
    const searchForm = document.querySelector("#search-form")
    const searchBar = document.querySelector("#search-bar")

    searchForm.addEventListener("submit", searchValidation)
    searchBar.addEventListener("input", suggestionHandler)
}

function suggestionHandler(e) {
    const query = e.target.value
    clearTimeout(keyPressTimer)
    
    keyPressTimer = setTimeout(() => {
        fetchCitySuggestions(query)
    }, 200);
}

async function fetchCitySuggestions(query) {
    try{
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=city&limit=5&lang=en&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`)
        const data = await response.json()
        return data
    } catch(e) {
        console.error(e)
    }
}

function searchValidation() {
    //
}


export {
    initSearch,
}