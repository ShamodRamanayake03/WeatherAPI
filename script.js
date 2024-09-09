const apiKey = '3a2908451cd34ea4a7d120942240209'; 

document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  if (city) {
    fetchWeatherData(city);
  } else {
    displayError("Please enter a city or country name");
  }
});

function fetchWeatherData(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(url)
    .then(response => response.json())
    .then(data => displayCurrentWeather(data))
    .catch(error => console.error('Error fetching weather data:', error));
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
          <p class="card-text">Condition: ${data.current.condition.text}</p> <!-- Added description -->
        </div>
      </div>
    `;
  }
  
