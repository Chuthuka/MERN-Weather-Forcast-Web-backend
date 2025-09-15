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


// Save search history
app.post('/api/history', async (req, res) => {
  try {
    const { city } = req.body;
    const search = new SearchHistory({ city });
    await search.save();
    res.status(201).json(search);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save search' });
  }
});

// Get search history
app.get('/api/history', async (req, res) => {
  try {
    const history = await SearchHistory.find().sort({ timestamp: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// New 7-Day Forecast API endpoint using coordinates
app.get('/api/forecast/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const forecastUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=metric`;
    const forecastResponse = await axios.get(forecastUrl);
    res.json(forecastResponse.data);
  } catch (error) {
    console.error('Forecast API call error:', error.message);
    res.status(500).json({ error: 'Failed to fetch 7-day forecast' });
  }
});