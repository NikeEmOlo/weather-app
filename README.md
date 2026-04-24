# Weather Or Not

Completed as part of [The Odin Project](https://theodinproject.org) full stack development course.

## About

A weather search app that lets you look up current weather conditions for any city. Start typing a city name to see suggestions, select one, and get the current temperature, highs, lows, and conditions.

## Goals

This project was built to practice:

- Writing asynchronous JavaScript
- Fetching and handling data from external APIs
- Presenting fetched data in a dynamic UI

## APIs

- [Geoapify](https://www.geoapify.com/) — city autocomplete suggestions and lat/lon lookup
- [Visual Crossing](https://www.visualcrossing.com/) — current weather data

## Setup

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root with your API keys:
   ```
   GEOAPIFY_API_KEY=your_key_here
   VISUAL_CROSSING_API_KEY=your_key_here
   ```
   > **Note:** The `.env` file for this project has been committed to version control. Both APIs used are free tiers with no billing risk, so this was an acceptable trade-off for convenience. I understand that in a production project, `.env` files should always be gitignored and secrets managed through a secure store.
4. Start the development server:
   ```
   npm start
   ```

## Built With

- Vanilla JavaScript (ES Modules)
- Webpack
- CSS
