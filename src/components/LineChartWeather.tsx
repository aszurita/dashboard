import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

interface WeatherData {
  time: string[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
}

interface Props {
  latitude: number;
  longitude: number;
}

export default function LineChartWeather({ latitude, longitude }: Props) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [dataType, setDataType] = useState<string>('temperature');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relative_humidity_2m,apparent_temperature,precipitation_probability&timezone=auto&forecast_days=1`
        );
        const data = await response.json();
        
        // Crear array de horas (0-23)
        const hours = Array.from({ length: 24 }, (_, i) => i);
        
        setWeatherData({
          time: hours.map(String),
          relative_humidity_2m: data.hourly.relative_humidity_2m.slice(0, 24),
          apparent_temperature: data.hourly.apparent_temperature.slice(0, 24),
          precipitation_probability: data.hourly.precipitation_probability.slice(0, 24),
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  const handleDataTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newDataType: string,
  ) => {
    if (newDataType !== null) {
      setDataType(newDataType);
    }
  };

  if (!weatherData) return null;

  const getDataConfig = () => {
    switch (dataType) {
      case 'temperature':
        return {
          data: weatherData.apparent_temperature,
          label: 'Temperature (°C)',
          color: '#FF4444'
        };
      case 'humidity':
        return {
          data: weatherData.relative_humidity_2m,
          label: 'Humidity (%)',
          color: '#4444FF'
        };
      case 'precipitation':
        return {
          data: weatherData.precipitation_probability,
          label: 'Precipitation Probability (%)',
          color: '#44AA44'
        };
      default:
        return {
          data: weatherData.apparent_temperature,
          label: 'Temperature (°C)',
          color: '#FF4444'
        };
    }
  };

  const dataConfig = getDataConfig();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <ToggleButtonGroup
        value={dataType}
        exclusive
        onChange={handleDataTypeChange}
        aria-label="weather data type"
      >
        <ToggleButton value="temperature">Temperature</ToggleButton>
        <ToggleButton value="humidity">Humidity</ToggleButton>
        <ToggleButton value="precipitation">Precipitation</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="h6" gutterBottom>
        {dataConfig.label}
      </Typography>

      <LineChart
        width={600}
        height={300}
        series={[
          {
            data: dataConfig.data,
            label: dataConfig.label,
            color: dataConfig.color,
          },
        ]}
        xAxis={[{
          data: hours,
          label: 'Hour of Day',
          scaleType: 'linear',
        }]}
      />
    </Paper>
  );
}