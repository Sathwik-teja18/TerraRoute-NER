const axios = require('axios');
const Cache = require('../models/Cache');

exports.getWeather = async (req, res) => {
    const { lat, lon } = req.query;
    const cacheKey = `weather_${lat}_${lon}`;

    try {
        const cached = await Cache.findOne({ cacheKey });
        if (cached) return res.status(200).json(cached.data);

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}&units=metric`);
        
        await Cache.create({ cacheKey, serviceType: 'Weather', data: response.data });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Weather API failure' });
    }
};