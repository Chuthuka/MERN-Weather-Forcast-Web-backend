const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const SearchHistory = require('./models/SearchHistory');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


// Weather API endpoint for current weather
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
});