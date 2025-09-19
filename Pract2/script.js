
const weatherData = {
  "Mumbai": "32°C, Humid",
  "Delhi": "35°C, Sunny",
  "London": "18°C, Cloudy",
  "New York": "22°C, Rainy",
  "Tokyo": "27°C, Clear Skies"
};

document.getElementById('get-weather').addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim();
  const resultDiv = document.getElementById('weather-result');

  if (weatherData[city]) {
    resultDiv.textContent = `Weather in ${city}: ${weatherData[city]}`;
  } else {
    resultDiv.textContent = `Sorry, weather for "${city}" not found.`;
  }
});
