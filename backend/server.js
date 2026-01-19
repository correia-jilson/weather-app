import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;
const API_KEY = process.env.WEATHER_API_KEY;

// Debug logging
console.log('=== Server Starting ===');
console.log('API Key loaded:', API_KEY ? '✅ YES' : '❌ NO');
if (API_KEY) {
  console.log('Key starts with:', API_KEY.substring(0, 8) + '...');
  console.log('Key length:', API_KEY.length, 'chars');
}
console.log('======================');

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '🌤️ Weather API Server is running!',
    api: 'WeatherAPI.com',
    endpoints: {
      weather: '/api/weather/:city',
      example: '/api/weather/London'
    }
  });
});

// Weather endpoint using WeatherAPI.com
app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params;

  console.log(`\n📍 Request received for city: ${city}`);

  if (!API_KEY) {
    console.log('❌ Error: API key missing');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // WeatherAPI.com endpoint
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;
    console.log('🌐 Calling WeatherAPI.com...');

    const response = await fetch(url);
    
    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ API Error:', errorData.error?.message);
      return res.status(404).json({ error: errorData.error?.message || 'City not found' });
    }

    const data = await response.json();
    console.log('✅ Success! Weather data retrieved for:', data.location.name);
    
    // Transform to match our frontend format
    const transformed = {
      name: data.location.name,
      sys: { country: data.location.country },
      main: {
        temp: data.current.temp_c,
        feels_like: data.current.feelslike_c,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb
      },
      weather: [{
        description: data.current.condition.text,
        main: data.current.condition.text
      }],
      wind: {
        speed: data.current.wind_kph / 3.6 // Convert to m/s
      },
      visibility: data.current.vis_km * 1000 // Convert to meters
    };
    
    res.json(transformed);
    
  } catch (error) {
    console.log('❌ Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Using WeatherAPI.com`);
  console.log(`📡 Test with: curl http://localhost:${PORT}/api/weather/London\n`);
});