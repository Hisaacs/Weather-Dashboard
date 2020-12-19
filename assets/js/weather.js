let apiKey = "a4568525018ee4e5cfdf31e325e54373";

let btnSearch = $(".btnSearch");
let citySearch = $(".citySearch");

// Left column locations
let displayCityName = $(".displayCityName");
let displayCurrentDate = $(".currentDate");
let displayWeatherIcon = $(".weatherIcon");
let previousSearch = $(".previousSearch");

// Right column locations
let temperature = $(".temp");
let humidity = $(".humidity");
let windSpeed = $(".windSpeed");
let uvIndex = $(".uvIndex");
let cardRow = $(".card-row");

// Create and display the current date
const displayDate = moment().format("DD/MM/YYYY");

if (JSON.parse(localStorage.getItem("historySearch")) === null) {
    console.log("historySearch not found")
} else {
    console.log("historySearch loaded into searchedHistory");
    displaySearchHistory();
}

btnSearch.on("click", function (event) {
    event.preventDefault();
    if (citySearch.val() === "") {
        alert("You must enter a city");
        return;
    }
    console.log("clicked button")
    displayWeather(citySearch.val());
});

$(document).on("click", ".historyEntry", function () {
    console.log("clicked history item")
    let thisWindow = $(this);
    displayWeather(thisWindow.text());
})

function displaySearchHistory(cityName) {
    previousSearch.empty();
    let searchedHistory = JSON.parse(localStorage.getItem("historySearch"));
    for (let i = 0; i < searchedHistory.length; i++) {
        // We put listNewItem in loop because otherwise the text of the li element changes, rather than making a new element for each array index
        let listNewItem = $("<li>").attr("class", "historyEntry");
        listNewItem.text(searchedHistory[i]);
        previousSearch.prepend(listNewItem);
    }
}

function displayWeatherApiData(cityName, cityTemp, cityHumidity, cityWindSpeed, cityWeatherIcon, uvVal) {
    displayCityName.text(cityName)
    displayCurrentDate.text(`(${displayDate})`)
    temperature.text(`Temperature: ${cityTemp} °C`);
    humidity.text(`Humidity: ${cityHumidity}%`);
    windSpeed.text(`Wind Speed: ${cityWindSpeed} MPH`);
    uvIndex.text(`UV Index: ${uvVal}`);
    displayWeatherIcon.attr("src", cityWeatherIcon);
}

function displayWeather(displayWeatherResult) {
    let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${displayWeatherResult}&APPID=${apiKey}&units=metric`;
    $.ajax({
            url: queryUrl,
            method: "GET"
        })
        .then(function (weatherApiData) {
            let cityObj = {
                cityName: weatherApiData.name,
                cityTemp: weatherApiData.main.temp,
                cityHumidity: weatherApiData.main.humidity,
                cityWindSpeed: weatherApiData.wind.speed,
                cityUVIndex: weatherApiData.coord,
                cityWeatherIconName: weatherApiData.weather[0].icon
            }
            let queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${apiKey}&units=imperial`
            $.ajax({
                    url: queryUrl,
                    method: 'GET'
                })
                .then(function (uvIndexData) {
                    if (JSON.parse(localStorage.getItem("historySearch")) == null) {
                        let searchedHistory = [];
                        // Keeps user from adding the same city to the historySearch array list more than once
                        if (searchedHistory.indexOf(cityObj.cityName) === -1) {
                            searchedHistory.push(cityObj.cityName);
                            // store our array of searches and save 
                            localStorage.setItem("historySearch", JSON.stringify(searchedHistory));
                            let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            displayWeatherApiData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvIndexData.value);
                            displaySearchHistory(cityObj.cityName);
                        } else {
                            console.log("City already in historySearch. Not adding to history list")
                            let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            displayWeatherApiData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvIndexData.value);
                        }
                    } else {
                        let searchedHistory = JSON.parse(localStorage.getItem("historySearch"));
                        // Keeps user from adding the same city to the historySearch array list more than once
                        if (searchedHistory.indexOf(cityObj.cityName) === -1) {
                            searchedHistory.push(cityObj.cityName);
                            // store our array of searches and save 
                            localStorage.setItem("historySearch", JSON.stringify(searchedHistory));
                            let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            displayWeatherApiData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvIndexData.value);
                            displaySearchHistory(cityObj.cityName);
                        } else {
                            console.log("City already in historySearch. Not adding to history list")
                            let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            displayWeatherApiData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvIndexData.value);
                        }
                    }
                })

        });
    displayFiveDayForecast();

    function displayFiveDayForecast() {
        cardRow.empty();
        let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${displayWeatherResult}&APPID=${apiKey}&units=metric`;
        $.ajax({
                url: queryUrl,
                method: "GET"
            })
            .then(function (fiveDayForecast) {
                for (let i = 0; i != fiveDayForecast.list.length; i += 8) {
                    let cityObj = {
                        date: fiveDayForecast.list[i].dt_txt,
                        icon: fiveDayForecast.list[i].weather[0].icon,
                        temp: fiveDayForecast.list[i].main.temp,
                        humidity: fiveDayForecast.list[i].main.humidity
                    }
                    let strDate = cityObj.date;
                    let strTrimDate = strDate.substring(0, 10);
                    let weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
                    createForecastCard(strTrimDate, weatherIco, cityObj.temp, cityObj.humidity);
                }
            })
    }
}

function createForecastCard(date, icon, temp, humidity) {

    // HTML elements we will create to later
    let fiveDayCardEl = $("<div>").attr("class", "five-day-card");
    let cardDate = $("<h3>").attr("class", "card-text");
    let cardIcon = $("<img>").attr("class", "weatherIcon");
    let cardTemp = $("<p>").attr("class", "card-text");
    let cardHumidity = $("<p>").attr("class", "card-text");

    cardRow.append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${temp} °C`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}