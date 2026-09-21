/* =========================================================
   NER SMART LOGISTICS
   WEATHER API
   OpenWeather
   ========================================================= */

const OPENWEATHER_API_KEY = "3e0d99601d6f4bd248df16b3f5f470bb";


/* =========================================================
   GET WEATHER
   ========================================================= */

async function getWeather(latitude, longitude) {

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?lat=${latitude}` +
            `&lon=${longitude}` +
            `&appid=${OPENWEATHER_API_KEY}` +
            `&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error(
                `Weather API error: ${response.status}`
            );

        }

        const data = await response.json();

        return data;

    }

    catch (error) {

        console.error(
            "Unable to fetch weather:",
            error
        );

        return null;

    }

}

/* =========================================================
   NER WEATHER DASHBOARD
   ========================================================= */

async function updateRainfallCard() {

    /*
     * Guwahati coordinates
     * We are using Guwahati as the initial
     * weather reference point for the dashboard.
     */

    const latitude = 26.1445;
    const longitude = 91.7362;

    const weatherData =
        await getWeather(
            latitude,
            longitude
        );


    const rainfallElement =
        document.getElementById(
            "rainfallValue"
        );


    if (!rainfallElement) {

        return;

    }


    if (!weatherData) {

        rainfallElement.textContent =
            "-- mm";

        return;

    }


    /*
     * OpenWeather provides rain data
     * when rainfall has been recorded.
     *
     * rain.1h = rainfall during the
     * previous 1 hour.
     */

    let rainfall = 0;


    if (
        weatherData.rain &&
        weatherData.rain["1h"]
    ) {

        rainfall =
            weatherData.rain["1h"];

    }


    rainfallElement.textContent =
        `${rainfall} mm`;

}


/* =========================================================
   START WEATHER UPDATE
   ========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        updateRainfallCard();

    }

);

/* =========================================================
   UPDATE DASHBOARD WEATHER CARD
   Uses the SAME weather data already fetched by getWeather()
   ========================================================= */

async function updateDashboardWeather() {

    /*
     * Using the same Guwahati coordinates
     * as the Weather & Field Deployment page.
     */

    const latitude = 26.1445;
    const longitude = 91.7362;


    const weatherData =
        await getWeather(
            latitude,
            longitude
        );


    if (!weatherData) {

        return;

    }


    /* -----------------------------------------------------
       TEMPERATURE
       ----------------------------------------------------- */

    const temperatureElement =
        document.getElementById(
            "dashboardWeatherTemperature"
        );


    if (temperatureElement) {

        temperatureElement.textContent =
            `${Math.round(weatherData.main.temp)}°C`;

    }


    /* -----------------------------------------------------
       WEATHER CONDITION
       ----------------------------------------------------- */

    const conditionElement =
        document.getElementById(
            "dashboardWeatherCondition"
        );


    if (
        conditionElement &&
        weatherData.weather &&
        weatherData.weather.length > 0
    ) {

        const condition =
            weatherData.weather[0].description;

        conditionElement.textContent =
            condition.charAt(0).toUpperCase() +
            condition.slice(1);

    }


    /* -----------------------------------------------------
       WEATHER ICON
       ----------------------------------------------------- */

    const iconElement =
        document.getElementById(
            "dashboardWeatherIcon"
        );


    if (
        iconElement &&
        weatherData.weather &&
        weatherData.weather.length > 0
    ) {

        const weatherMain =
            weatherData.weather[0].main.toLowerCase();


        let icon = "🌤";


        if (weatherMain.includes("rain")) {

            icon = "🌧";

        }
        else if (weatherMain.includes("thunderstorm")) {

            icon = "⛈";

        }
        else if (weatherMain.includes("cloud")) {

            icon = "☁️";

        }
        else if (weatherMain.includes("clear")) {

            icon = "☀️";

        }
        else if (weatherMain.includes("snow")) {

            icon = "❄️";

        }


        iconElement.textContent = icon;

    }


    /* -----------------------------------------------------
       CURRENT TIME
       ----------------------------------------------------- */

    const timeElement =
        document.getElementById(
            "dashboardWeatherTime"
        );


    if (timeElement) {

        const now = new Date();

        timeElement.textContent =
            now.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }
            );

    }

}


/* =========================================================
   LOAD DASHBOARD WEATHER
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboardWeather();

    }
);