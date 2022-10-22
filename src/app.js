// function display current date and time//
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dateNumber = date.getDate();
  if (dateNumber < 10) {
    dateNumber = `0${dateNumber}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let day = days[date.getDay()];
  let month = months[date.getMonth()];
  return `${month} ${dateNumber}, ${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
// function display forecast//
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6)
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "34ae1065362d42545661451bda2b8a1f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
// function display current weather condition//
function cityTemperature(response) {
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  let dayTime = document.querySelector("#time");
  dayTime.innerHTML = formatDate(response.data.dt * 1000);

  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round(response.data.main.temp);

  let city = response.data.name;
  let currentCity = document.querySelector("#current-location");
  currentCity.innerHTML = `${city}`;

  let lowestTemperature = Math.round(response.data.main.temp_min);
  let minTemperature = document.querySelector(".min-temperature");
  minTemperature.innerHTML = `↓${lowestTemperature}`;

  let highestTemperature = Math.round(response.data.main.temp_max);
  let maxTemperature = document.querySelector(".max-temperature");
  maxTemperature.innerHTML = `↑${highestTemperature}`;

  let weatherDescription = document.querySelector(".weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;

  let humidity = document.querySelector(".humidity");
  humidity.innerHTML = `Humidity ${response.data.main.humidity}%`;

  let wind = document.querySelector(".wind");
  wind.innerHTML = `Wind  ${Math.round(response.data.wind.speed)} m/h`;

  getForecast(response.data.coord);
  getUVIndex(response.data.coord);
  getAirPollution(response.data.coord);
}
// search engine //
function searchFunction(city) {
  let apiKey = "34ae1065362d42545661451bda2b8a1f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(cityTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input");
  searchFunction(city.value);
}
//function display UV//
function getUVIndex(coordinates) {
  let apiKey = "34ae1065362d42545661451bda2b8a1f";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
  axios.get(apiURL).then(displayUV);
}
function displayUV(response) {
  let uvi = Math.round(response.data.current.uvi);
  let UvElement = document.querySelector(".uv");
  UvElement.innerHTML = `UV Index ${uvi}/11`;
}
//function air quality//
function getAirPollution(coordinates) {
  let apiKey = "34ae1065362d42545661451bda2b8a1f";
  let apiURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
  axios.get(apiURL).then(displayAirPollution);
}
function displayAirPollution(response) {
  let airElement = document.querySelector(".air");
  let airIndex = Math.round(response.data.list[0].main.aqi);
  airElement.innerHTML = airIndex;
  let airDescription = [
    "Very good",
    "Good",
    "Fair",
    "Moderate",
    "Poor",
    "Very poor",
  ];

  let airDescriptionElement = document.querySelector(".air");
  airDescriptionElement.innerHTML = `${airIndex}-${airDescription[airIndex]}`;
}
// function current location//
function searchLocation(position) {
  let apiKey = "34ae1065362d42545661451bda2b8a1f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(cityTemperature);
}

navigator.geolocation.getCurrentPosition(searchLocation);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

searchFunction("Copenhagen");
