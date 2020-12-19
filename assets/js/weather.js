// WeatherAPIKey
let apiKey = "a4568525018ee4e5cfdf31e325e54373";
// Search buttons
let btnSearch = $(".btnSearch");
let citySearch = $(".citySearch");

// Creates the Left column locations in the window
let displayCityName = $(".displayCityName");
let displayCurrentDate = $(".currentDate");
let displayWeatherIcon = $(".weatherIcon");
let previousSearch = $(".previousSearch");

// Creates the Right column locations in the window
let temperature = $(".temp");
let humidity = $(".humidity");
let windSpeed = $(".windSpeed");
let uvIndex = $(".uvIndex");
let cardRow = $(".card-row");

// Create and display the current date
const displayDate = moment().format("DD/MM/YYYY");
// Get the localStorage
if (JSON.parse(localStorage.getItem("historySearch")) === null) {
    console.log("historySearch could not be found")
} else {
    console.log("historySearch has been loaded into searchedHistory");
    displaySearchHistory();
}
// Button on Click Event Listener with popup if user don't add Search field into input area
btnSearch.on("click", function (event) {
    event.preventDefault();

    let inputCity = $(".citySearch").val().trim();

    if (inputCity === "") {
      $(".error").css("display", "block" );
      return;
    }

    $(".error").css("display", "none" );
    console.log("clicked button")
    displayWeather(citySearch.val());
    $(".citySearch").val("");
    $(".citySearch").select();

});
// This return the search history 
$(document).on("click", ".historyEntry", function () {
    console.log("clicked history item")
    let thisWindow = $(this);
    displayWeather(thisWindow.text());
})

// This display the Search History
function displaySearchHistory() {
    previousSearch.empty();
    let searchedHistory = JSON.parse(localStorage.getItem("historySearch"));
    for (let i = 0; i < searchedHistory.length; i++) {
        // This adds the listNewItem in a for loop, otherwise the text of element (li) changes instead of making a new element for each index array

        let listNewItem = $("<li>").attr("class", "historyEntry");
        listNewItem.text(searchedHistory[i]);
        previousSearch.prepend(listNewItem);
    }
}

// This displays the weather by the followng City Name, Temperature, Humidity, Wind Speed, UVindex
function displayWeatherApiData(cityName, cityTemp, cityHumidity, cityWindSpeed, cityWeatherIcon, uvVal) {
    displayCityName.text(cityName)
    displayCurrentDate.text(`(${displayDate})`)
    temperature.text(`Temperature: ${cityTemp} °C`);
    humidity.text(`Humidity: ${cityHumidity}%`);
    windSpeed.text(`Wind Speed: ${cityWindSpeed} MPH`);
    uvIndex.text(`UV Index: ${uvVal}`);
    displayWeatherIcon.attr("src", cityWeatherIcon);
}

// This display the wearther result that has been searched
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

    // This section display the 5 day forecast    
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

// This creates the five day forecast
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
