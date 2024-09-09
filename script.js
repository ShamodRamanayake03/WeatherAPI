const apiKey = '3a2908451cd34ea4a7d120942240209'; 

document.addEventListener('DOMContentLoaded', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherDataByCoordinates(lat, lon);
    }, (error) => {
      console.error('Error getting location:', error);
      displayError('Unable to retrieve your location.');
    });
  } else {
    displayError('Geolocation is not supported by this browser.');
  }

  document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
      fetchWeatherDataByCity(city);
    } else {
      displayError('Please enter a city or country name.');
    }
  });
});

function fetchWeatherDataByCoordinates(lat, lon) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      displayHourlyWeather(data);
      displayForecastWeather(data);
      fetchHistoricalData(data.location.lat, data.location.lon);
      displayMap(data.location.lat, data.location.lon);
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

function fetchWeatherDataByCity(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      displayHourlyWeather(data);
      displayForecastWeather(data);
      fetchHistoricalData(data.location.lat, data.location.lon);
      displayMap(data.location.lat, data.location.lon);
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

function fetchHistoricalData(lat, lon) {
  const currentTime = new Date();

  const historyWeatherEl = document.getElementById('historyWeather');
  historyWeatherEl.innerHTML = ''; // Clear previous data

  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(currentTime.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    const historyUrl = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${lat},${lon}&dt=${formattedDate}`;

    fetch(historyUrl)
      .then(response => response.json())
      .then(data => displayHistoricalWeather(data))
      .catch(error => console.error('Error fetching historical data:', error));
  }
}

function displayCurrentWeather(data) {
  const currentWeatherEl = document.getElementById('currentWeather');
  currentWeatherEl.innerHTML = `
    <div class="card text-center">
      <div class="card-body">
        <h2 class="card-title">Current Weather in ${data.location.name}</h2>
        <p class="card-text">Temperature: ${data.current.temp_c}°C</p>
        <p class="card-text">Humidity: ${data.current.humidity}%</p>
        <p class="card-text">Wind Speed: ${data.current.wind_kph} km/h</p>
      </div>
    </div>
  `;
}

function displayHourlyWeather(data) {
  const hourlyForecastEl = document.getElementById('hourlyForecast');
  hourlyForecastEl.innerHTML = '';
  data.forecast.forecastday[0].hour.forEach(hour => {
    hourlyForecastEl.innerHTML += `
      <div class="card">
        <div class="card-body text-center">
          <p>${hour.time.split(' ')[1]}</p>
          <p>${hour.temp_c}°C</p>
          <p>${hour.condition.text}</p>
        </div>
      </div>
    `;
  });
}

function displayForecastWeather(data) {
  const forecastWeatherEl = document.getElementById('forecastWeather');
  forecastWeatherEl.innerHTML = '';
  data.forecast.forecastday.forEach(day => {
    forecastWeatherEl.innerHTML += `
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <p class="card-title">${day.date}</p>
            <p class="card-text">Avg Temp: ${day.day.avgtemp_c}°C</p>
            <p class="card-text">Condition: ${day.day.condition.text}</p>
          </div>
        </div>
      </div>
    `;
  });
}

function displayHistoricalWeather(data) {
  const historyWeatherEl = document.getElementById('historyWeather');
  const day = data.forecast.forecastday[0];
  historyWeatherEl.innerHTML += `
    <div class="card text-center history-card">
      <div class="card-body">
        <h4 class="card-title">${day.date}</h4>
        <p class="card-text">Avg Temp: ${day.day.avgtemp_c}°C</p>
        <p class="card-text">Condition: ${day.day.condition.text}</p>
      </div>
    </div>
  `;
}

function displayMap(lat, lon) {
  const map = L.map('map').setView([lat, lon], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup('Location: ' + lat + ', ' + lon)
    .openPopup();
}

function displayError(message) {
  const errorEl = document.getElementById('error');
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}
