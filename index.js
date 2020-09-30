

const googleApiKey = "AIzaSyDvnQdQeXglXx0QVl62cufbsPBSjrxDaik";
const owApiKey = "a335f835947f32cca750ff4698ea1202";
const googleUrl = 'https://maps.googleapis.com/maps/api/geocode/';
const owUrl = 'https://api.openweathermap.org/data/2.5/onecall'



function getAddress() {
    return $('#city').val() + ',' + $('#state').val();
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function getGeocode(address) {
    const params = {
        key: googleApiKey,
        address
    };
    const queryString = formatQueryParams(params)
    const geocodeUrl = `${googleUrl}json?${queryString}`
    return fetch(geocodeUrl).then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error(response.statusText)
    }).catch(console.error)
}   //convert city name into geo coordinates using Google Api//


function getWeather(location) {
    const { lat, lon } = location
    const params = {
        appid: owApiKey,
        lat, lon, units: "imperial"
    };
    const queryString = formatQueryParams(params)
    const weatherUrl = `${owUrl}?${queryString}`
    return fetch(weatherUrl).then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error(response.statusText)
    }).then(responseJson => displayWeatherResults(responseJson)).catch(console.error)
}   //use generated coordinates to pull historical weather data//


function displayWeatherResults(responseJson) {
    const days = responseJson.daily.map(day => `
    <li> 
    <h3> ${new Date(day.dt * 1000).toString().slice(0, 15)}</h3>
    <div class="temperature">
    <span class="min">Low: ${day.temp.min} F°</span>
    <span class="max">High: ${day.temp.max} F°</span>
    </div>
    <div class="wind_weather">
    <span class="wind">Average wind speed: ${day.wind_speed} mph</span>
    <span class="weather">Forecast: ${day.weather[0].main}</span>
    </div>
    </li>
    `)
    $('#results').empty().html(`
            <h2>Pow Conditions</h2>
            <ul id="results-list">
            ${days.join("")}
            </ul>          
    `)
}

function executeForm() {
    $('form').submit(event => {
        event.preventDefault()
        const address = getAddress()
        getGeocode(address).then(responseJson => {
            const { lat, lng: lon } = responseJson.results[0].geometry.location
            getWeather({ lat, lon })


        })
    })
}
$(executeForm)