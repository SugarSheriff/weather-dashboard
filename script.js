$(function () {
    const apiKey = '0347caa981b5dadc4df9069c75b7847c';
    const searchButton = $('#search-button');
    const clearButton = $('#clear-button');
    let city = '';
    const savedCityBlock = $('#saved-cities');
    const todayJS = dayjs().format('M/D/YYYY');
  
    // Function for when a saved city button is clicked
    function handleSavedCity(event) {
      const btnClicked = $(event.target);
      city = btnClicked.attr('id');
      const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
      let icon = '';
  
      fetch(queryURL)
        .then(function (response) {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then(function (data) {
          $('#city-name').text(`${city}   ${todayJS}`);
          $('#today-temp').text(data.main.temp);
          $('#today-wind').text(data.wind.speed);
          $('#today-humidity').text(data.main.humidity);
          icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
          $('#today-icon').attr('src', icon);
        });
  
      fetch(forecastURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          const forecast = document.getElementById('five-day-forecast');
          forecast.innerHTML = '';
  
          for (let i = 1; i < 35; i++) {
            const day = data.list[i];
            if (i === 2 || i === 10 || i === 18 || i === 26 || i === 34) {
              icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
              const formatDate = dayjs(day.dt_txt).format('M/D/YYYY');
              const newDay = `<div class="day-of-week col-2 me-4">
                                <p class="future-day">${formatDate}</p>
                                <img src="${icon}" alt="" class="future-icon">
                                <p>Temp: <span class="future-temp">${day.main.temp}</span><span>F</span></p>
                                <p>Wind: <span class="future-wind">${day.wind.speed}</span><span>MPH</span></p>
                                <p>Humidity: <span class="future-humidity">${day.main.humidity}</span><span>%</span></p>
                              </div>`;
              forecast.innerHTML += newDay;
            }
          }
        });
    }
  
    // Function to create a new button for a saved city
    function createNewButton(cityName) {
      return `<button class="btn btn-secondary mt-1 savedCity" id="${cityName}">${cityName}</button>`;
    }
  
    // Function to load saved cities from local storage
    function loadSavedCities() {
      const savedCities = JSON.parse(localStorage.getItem('SavedCities'));
      const savedCitiesHTML = document.getElementById('saved-cities');
  
      if (localStorage.getItem('SavedCities') === null) {
        return;
      }
  
      for (let i = 0; i < savedCities.length; i++) {
        savedCitiesHTML.innerHTML += savedCities[i];
      }
    }
  
    // Function to find a city using the search bar
    function findCity() {
      city = $('#search-bar').val();
      const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
      let icon = '';
      const savedCitiesHTML = document.getElementById('saved-cities');
  
      $('#search-bar').val('');
  
      fetch(queryURL)
        .then(function (response) {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then(function (data) {
          $('#city-name').text(`${city}   ${todayJS}`);
          $('#today-temp').text(data.main.temp);
          $('#today-wind').text(data.wind.speed);
          $('#today-humidity').text(data.main.humidity);
          icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
          $('#today-icon').attr('src', icon);
        });
  
      fetch(forecastURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          const forecast = document.getElementById('five-day-forecast');
          forecast.innerHTML = '';
  
          for (let i = 1; i < 35; i++) {
            const day = data.list[i];
            if (i === 2 || i === 10 || i === 18 || i === 26 || i === 34) {
              icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
              const formatDate = dayjs(day.dt_txt).format('M/D/YYYY');
              const newDay = `<div class="day-of-week col-2 me-4">
                                <p class="future-day">${formatDate}</p>
                                <img src="${icon}" alt="" class="future-icon">
                                <p>Temp: <span class="future-temp">${day.main.temp}</span><span>F</span></p>
                                <p>Wind: <span class="future-wind">${day.wind.speed}</span><span>MPH</span></p>
                                <p>Humidity: <span class="future-humidity">${day.main.humidity}</span><span>%</span></p>
                              </div>`;
              forecast.innerHTML += newDay;
            }
          }
        });
  
      savedCitiesHTML.innerHTML += createNewButton(city);
  
      if (localStorage.getItem('SavedCities') === null) {
        const cities = [];
        cities.push(createNewButton(city));
        const citiesTemp = JSON.stringify(cities);
        localStorage.setItem('SavedCities', citiesTemp);
      } else {
        const cities = JSON.parse(localStorage.getItem('SavedCities'));
        cities.push(createNewButton(city));
        const citiesTemp = JSON.stringify(cities);
        localStorage.setItem('SavedCities', citiesTemp);
      }
    }
  
    // function to clear
    function clearLocalStorage() {
      localStorage.clear();
      savedCityBlock.html('');
    }
  
    // Event listeners for button clicks
    searchButton.on('click', findCity);
    clearButton.on('click', clearLocalStorage);
    loadSavedCities();
    savedCityBlock.on('click', '.savedCity', handleSavedCity);
  });