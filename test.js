
// GLobal varaibles
const recentSearch = JSON.parse(localStorage.getItem("cityName"));
let storearr = [];

// here you can Search a current City's weather
function searchForCity(SearchByCityName) {

  const queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    SearchByCityName + "&units=metric&appid=ecc0be5fd92206da3aa90cc41c13ca56";

  const queryForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" +
    SearchByCityName + "&units=metric&appid=ecc0be5fd92206da3aa90cc41c13ca56";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    console.log(queryURL);
    // this clears the div and the id content
    $("#current").empty();

    // this displays the current date
    const displayDate = moment().format("DD/MM/YYYY");

    // this creates and displays the city information i.e city name, date, temperature, humidity and wind speed
    const displayCity = $("<h2>").text(response.name);
    const displayCurrentDate = displayCity.append(" " + displayDate);
    const displayTemperature = $("<p>").text(
      "Temperature: " + response.main.temp
    );
    const displayHumidity = $("<p>").text(
      "Humidity: " + response.main.humidity
    );
    const displayWind = $("<p>").text("Wind Speed: " + response.wind.speed);
    const displayCurrentWeather = response.weather[0].main;

    // this will display the icons in relation to the weather i.e. Rain, Clouds, Clear, Drizzle and Snow
    if (displayCurrentWeather === "Rain") {
      let imageIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/09d.png");
      imageIcon.attr("style", "height: 60px; width: 60px");
    } else if (displayCurrentWeather === "Clouds") {
      let imageIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/03d.png");
      imageIcon.attr("style", "height: 60px; width: 60px");
    } else if (displayCurrentWeather === "Clear") {
      let imageIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/01d.png");
      imageIcon.attr("style", "height: 60px; width: 60px");
    } else if (displayCurrentWeather === "Drizzle") {
      let imageIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/10d.png");
      imageIcon.attr("style", "height: 60px; width: 60px");
    } else if (displayCurrentWeather === "Snow") {
      let imageIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/13d.png");
      imageIcon.attr("style", "height: 60px; width: 60px");
    }
    // this creates the div and appends the elements to be displayed onto the page
    let createDiv = $("<div>");

    createDiv.append(
      displayCurrentDate,
      displayTemperature,
      displayHumidity,
      displayWind
    );

    $("#current").html(createDiv);

    // this section call the UV index
    const lat = response.coord.lat;
    const lon = response.coord.lon;
    const queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=ecc0be5fd92206da3aa90cc41c13ca56&lat=" +
      lat + "&lon=" + lon;

    // a request made to the server to get back a response
    $.ajax({
      url: queryURLUV,
      method: "GET",
    }).then(function (response) {
      $("#uvl-display").empty();
      //create HTML for new div
      const createUV = $("<button class='btn bg-success'>").text(
        "UV Index: " + response.value
      );

      $("#uvl-display").html(createUV);
    });
  });

  // a request made to the server to get back a response 
  $.ajax({
    url: queryForecastUrl,
    method: "GET",
  }).then(function (response) {
    // variable to store results
    let results = response.list;
    //empty div for the 5 day forecast
    $("#5day").empty();
    // this creates the HTML for the 5day forecast
    for (let i = 0; i < results.length; i += 8) {
      // Creating a div
      let forecastDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");

      // this stores the date tempurature and humidity responses
      const forecastDate = results[i].dt_txt;
      const displayDate = forecastDate.substr(0, 10);
      const displayTemp = results[i].main.temp;
      const displayHum = results[i].main.humidity;

      // this creates tags with the resulting item information
      let dateTag = $("<h5 class='card-title'>").text(displayDate);
      let tempTag = $("<p class='card-text'>").text("Temp: " + displayTemp);
      let humTag = $("<p class='card-text'>").text("Humidity " + displayHum);

      let weather = results[i].weather[0].main;

      if (weather === "Rain") {
        var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/09d.png");
        weatherIcon.attr("style", "height: 40px; width: 40px");
      } else if (weather === "Clouds") {
        var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/03d.png");
        weatherIcon.attr("style", "height: 40px; width: 40px");
      } else if (weather === "Clear") {
        var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/01d.png");
        weatherIcon.attr("style", "height: 40px; width: 40px");
      } else if (weather === "Drizzle") {
        var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/10d.png");
        weatherIcon.attr("style", "height: 40px; width: 40px");
      } else if (weather === "Snow") {
        var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/13d.png");
        weatherIcon.attr("style", "height: 40px; width: 40px");
      }

      //this append items to
      forecastDiv.append(dateTag);
      forecastDiv.append(weatherIcon);
      forecastDiv.append(tempTag);
      forecastDiv.append(humTag);
      $("#5day").append(forecastDiv);
    }
  });
}

// this is an Event handler for city search
$("#select-city").on("click", function (event) {
  // Preventing the button from trying to submit the form
  event.preventDefault();


  // Storing the city name
  const inputCity = $("#city-input").val().trim();

  if (inputCity === "") {
    $(".error").css("display", "block" );
    return;
  }
  $(".error").css("display", "none" );


  //---------------above code to be fixed---------------------------

  // this save's the search field i.e. City name to local storage
  // const textContent = $(this).siblings("input").val();

  storearr.push(inputCity);
  localStorage.setItem("cityName", JSON.stringify(storearr));
  
  searchForCity(inputCity);

  const btnSearchDiv = $(
    "<button class='btn border text-muted mt-2 shadow-sm bg-white rounded' style='width: 12rem;'>"
  ).text(inputCity);
  const prevsearch = $("<div>");
  prevsearch.append(btnSearchDiv);
  $("#SearchHistory").prepend(prevsearch);
  
  // if (hasError == true)
  //   return false;

});

// this display search history
$("#SearchHistory").on("click", ".btn", function (event) {
  event.preventDefault();
  console.log($(this).text());

  searchForCity($(this).text());
});

// ONLOAD HERE -----------------------------------------------------------------------------------
// this retrieves the stored items when the page loads


if (recentSearch != undefined) {
  storearr = recentSearch;

  recentSearch.forEach(function (city) {
    const btnSearchDiv = $(
      "<button class='btn border text-muted mt-2 shadow-sm bg-white rounded' style='width: 12rem;'>"
    ).text(city);
    const prevsearch = $("<div>");
    prevsearch.append(btnSearchDiv);
    $("#SearchHistory").prepend(prevsearch);
  });

  searchForCity(recentSearch[recentSearch.length - 1]);
}