import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Paper sx={{ 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2,
      width: '100%',
      maxWidth: '100%'
    }}>
      <ToggleButtonGroup
        value={dataType}
        exclusive
        onChange={handleDataTypeChange}
        aria-label="weather data type"
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        <ToggleButton value="temperature">Temperature</ToggleButton>
        <ToggleButton value="humidity">Humidity</ToggleButton>
        <ToggleButton value="precipitation">Precipitation</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="h6" gutterBottom>
        {dataConfig.label}
      </Typography>

      <Box sx={{ 
        width: '100%',
        height: isMobile ? 250 : 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <LineChart
          width={undefined}
          height={undefined}
          series={[
            {
              data: dataConfig.data,
              label: dataConfig.label,
              color: dataConfig.color,
              curve: 'linear',
            },
          ]}
          xAxis={[{
            data: hours,
            label: 'Hour of Day',
            scaleType: 'linear',
          }]}
          margin={{ 
            left: 50,
            right: 20,
            top: 20,
            bottom: 40,
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100% !important',
            height: '100% !important',
            '.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              transform: 'translateY(-5px)',
            },
          }}
        />
      </Box>
    </Paper>
  );
}