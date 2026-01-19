import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(`http://localhost:3001/api/weather/${city}`);
      
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🌤️ Weather App</h1>

        <div className="search-box">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name..."
          />
          <button onClick={fetchWeather} disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="error">
            ❌ {error}
          </div>
        )}

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <div className="temp">{Math.round(weather.main.temp)}°C</div>
            <p className="description">{weather.weather[0].description}</p>
            
            <div className="details">
              <div className="detail">
                <span className="label">💧 Humidity</span>
                <span className="value">{weather.main.humidity}%</span>
              </div>
              <div className="detail">
                <span className="label">💨 Wind</span>
                <span className="value">{weather.wind.speed} m/s</span>
              </div>
              <div className="detail">
                <span className="label">🌡️ Feels Like</span>
                <span className="value">{Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="detail">
                <span className="label">👁️ Visibility</span>
                <span className="value">{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;