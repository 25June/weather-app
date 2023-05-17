const express = require('express');
const axios = require('axios');
const readlineSync = require('readline-sync');
const cors = require('cors')

const app = express();
const port = 3000;
app.use(cors())

app.get('/weather', cors(), (req, res) => {
  const zipCode = readlineSync.question('Enter the zip code: ');
  console.log(`zipCode is ${zipCode}`)
  axios
    .get(`http://api.weatherstack.com/current?access_key=610acf4c1d203448cd6f671955c5e8aa&query=${zipCode}`)
    .then(response => {
      const weatherData = response.data.current;
      const isRaining = weatherData.weather_descriptions.includes('rain');
      const uvIndex = weatherData.uv_index;
      const windSpeed = weatherData.wind_speed;

      const shouldGoOutside = isRaining ? 'No' : 'Yes';
      const shouldWearSunscreen = uvIndex > 3 ? 'Yes' : 'No';
      const canFlyKite = !isRaining && windSpeed > 15 ? 'Yes' : 'No';

      const answers = {
        shouldGoOutside,
        shouldWearSunscreen,
        canFlyKite,
        weatherData,
      };

      res.json(answers);
    })
    .catch(error => {
      console.error('Error retrieving weather data:', error);
      res.status(500).json({ error: 'Error retrieving weather data' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
