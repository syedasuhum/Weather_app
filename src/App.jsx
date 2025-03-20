import React, { useState, useEffect } from 'react';
import { Search, Wind, Droplets, Loader2, Sun, CloudRain, CloudSnow, CloudLightning, Cloudy, CloudDrizzle, Thermometer } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const API_KEY = '6845718ac82f71d85338ce864850ef71';
const STORAGE_KEY = 'lastSearchedCity';

const getWeatherIcon = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return <CloudLightning size={48} className="text-yellow-400" />;
  if (weatherId >= 300 && weatherId < 400) return <CloudDrizzle size={48} className="text-blue-400" />;
  if (weatherId >= 500 && weatherId < 600) return <CloudRain size={48} className="text-blue-500" />;
  if (weatherId >= 600 && weatherId < 700) return <CloudSnow size={48} className="text-blue-200" />;
  if (weatherId >= 801 && weatherId < 900) return <Cloudy size={48} className="text-gray-400" />;
  return <Sun size={48} className="text-yellow-500" />;
};


function App() {
  const [city, setCity] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (searchCity) => {
    if (!searchCity.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeather(data);
      localStorage.setItem(STORAGE_KEY, searchCity);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const savedCity = localStorage.getItem(STORAGE_KEY);

  return (
    <div 
      className="h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://wallpapercat.com/w/full/f/2/a/21238-1920x1080-desktop-1080p-clouds-background-photo.jpg')`
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-t-2xl shadow-lg p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Weather App</h1>
            {savedCity && (
              <div className="text-sm text-gray-600">
                Last searched city: {savedCity}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={loading}
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="bg-white/80 backdrop-blur-md p-8 flex justify-center rounded-b-2xl shadow-lg">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        )}

        {error && (
          <div className="bg-white/80 backdrop-blur-md text-red-500 p-4 rounded-b-2xl shadow-lg text-center">
            {error}
          </div>
        )}

        {weather && !loading && (
          <div className="bg-white/80 backdrop-blur-md rounded-b-2xl shadow-lg p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {weather.name}
              </h2>
              <div className="flex items-center justify-center space-x-4">
                {getWeatherIcon(weather.weather[0].id)}
                <div>

                  <div className="flex items-center">
                   
                    <span className="text-5xl font-bold text-gray-900">
                      {Math.round(weather.main.temp)}°C
                    </span>
                  </div>
                  <p className="text-gray-600 capitalize">
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                Feels like {Math.round(weather.main.feels_like)}°C
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/90 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Wind className="text-blue-500" size={24} />
                 
                </div>
                <div className="w-24 h-24 mx-auto">
                  <CircularProgressbar
                    value={weather.wind.speed}
                    maxValue={20}
                    text={`${weather.wind.speed}m/s`}
                    styles={buildStyles({
                      textSize: '14px',
                      pathColor: '#3b82f6',
                      textColor: '#1e40af',
                      trailColor: '#dbeafe',
                    })}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">Wind Speed</p>
              </div>

              <div className="bg-white/90 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Droplets className="text-blue-500" size={24} />
                 
                </div>
                <div className="w-24 h-24 mx-auto">
                  <CircularProgressbar
                    value={weather.main.humidity}
                    text={`${weather.main.humidity}%`}
                    styles={buildStyles({
                      textSize: '14px',
                      pathColor: '#3b82f6',
                      textColor: '#1e40af',
                      trailColor: '#dbeafe',
                    })}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">Humidity</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;