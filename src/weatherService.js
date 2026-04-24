import {parse, format} from "date-fns"
import {displayCityWeather} from "./display.js"

class WeatherProfile{
    constructor(current, daily) {
        const today = daily[0]
        const now = current
        this.conditions = now.conditions
        this.description = today.description
        this.temperature = now.temp
        this.maxTemp = today.tempmax
        this.minTemp = today.tempmin
        this.date = format(parse(today.datetime, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy'); //reversed the date formatting
        this.iconName = now.icon
    }

    convertToFarenheit(C) {
        const F = Math.round((C * 9/5) + 32)
        return F
    }
}

async function fetchWeatherData(city) {

    try{
        const {lat, lon, id, stateCode} = city;

        if (!lat || !lon) {
            throw new Error("Invalid coordinates")
        }

        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&include=days%2Ccurrent&key=${process.env.VISUAL_CROSSING_API_KEY}&contentType=json`)
        if (!response.ok) {
            throw new Error(`API eorro: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)
        if (!data.days || data.days.length === 0) {
            throw new Error("No forecast data returned")
        } else if (!data.currentConditions) {
            throw new Error("No current conditions data returned")
        }

        const currentConditions = data.currentConditions
        const dailyConditions = data.days
        const weatherData = new WeatherProfile(currentConditions, dailyConditions)
        console.log(weatherData)
        displayCityWeather(weatherData)    
    } catch(e) {
        throw new Error(e)
    } 
}

export {
    fetchWeatherData,
}