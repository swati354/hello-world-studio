import { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: number;
  city: string;
}

interface GeoPosition {
  latitude: number;
  longitude: number;
  city: string;
}

function weatherDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 49) return 'Foggy';
  if (code <= 59) return 'Drizzle';
  if (code <= 69) return 'Rain';
  if (code <= 79) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

function weatherEmoji(code: number, isDay: number): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 2) return isDay ? '⛅' : '🌥️';
  if (code === 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}

function bgGradient(code: number, isDay: number): string {
  if (code === 0 && isDay) return 'from-sky-400 to-blue-500';
  if (code === 0 && !isDay) return 'from-indigo-900 to-slate-900';
  if (code <= 2) return 'from-sky-300 to-slate-400';
  if (code <= 49) return 'from-slate-400 to-slate-600';
  if (code <= 69) return 'from-slate-500 to-slate-700';
  if (code <= 86) return 'from-blue-200 to-slate-500';
  return 'from-slate-600 to-slate-800';
}

export function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLocation(): Promise<GeoPosition> {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser.'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await res.json();
              const city =
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                data.address?.county ||
                'Your location';
              resolve({ latitude, longitude, city });
            } catch {
              resolve({ latitude, longitude, city: 'Your location' });
            }
          },
          () => {
            // Fallback to New York City
            resolve({ latitude: 40.7128, longitude: -74.006, city: 'New York City' });
          },
          { timeout: 8000 }
        );
      });
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { latitude, longitude, city } = await fetchLocation();
        if (cancelled) return;

        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,apparent_temperature,relative_humidity_2m,` +
          `wind_speed_10m,weather_code,is_day` +
          `&temperature_unit=celsius&wind_speed_unit=kmh`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch weather data.');
        const json = await res.json();
        if (cancelled) return;

        const c = json.current;
        setWeather({
          temperature: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: c.relative_humidity_2m,
          windSpeed: Math.round(c.wind_speed_10m),
          weatherCode: c.weather_code,
          isDay: c.is_day,
          city,
        });
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Fetching weather…</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-md px-10 py-8 text-center max-w-sm">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-gray-700 font-medium">Could not load weather</p>
          <p className="text-gray-400 text-sm mt-1">{error ?? 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  const gradient = bgGradient(weather.weatherCode, weather.isDay);
  const emoji = weatherEmoji(weather.weatherCode, weather.isDay);
  const description = weatherDescription(weather.weatherCode);
  const textColor = weather.weatherCode === 0 && !weather.isDay ? 'text-white' : 'text-white';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} flex items-center justify-center p-6`}>
      <div className="w-full max-w-sm">
        {/* Main card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl">
          <div className="text-center mb-6">
            <p className={`text-sm font-medium uppercase tracking-widest ${textColor} opacity-80`}>
              {weather.city}
            </p>
            <div className="text-8xl mt-3 mb-2">{emoji}</div>
            <p className="text-7xl font-thin tracking-tight">{weather.temperature}°</p>
            <p className="text-lg font-medium mt-1 opacity-90">{description}</p>
            <p className="text-sm opacity-70 mt-1">Feels like {weather.feelsLike}°C</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-2xl">💧</p>
              <p className="text-lg font-semibold mt-1">{weather.humidity}%</p>
              <p className="text-xs opacity-70">Humidity</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-2xl">💨</p>
              <p className="text-lg font-semibold mt-1">{weather.windSpeed}</p>
              <p className="text-xs opacity-70">km/h wind</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-2xl">{weather.isDay ? '🌅' : '🌃'}</p>
              <p className="text-lg font-semibold mt-1">{weather.isDay ? 'Day' : 'Night'}</p>
              <p className="text-xs opacity-70">Period</p>
            </div>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-4">
          Data from Open-Meteo · Updated just now
        </p>
      </div>
    </div>
  );
}