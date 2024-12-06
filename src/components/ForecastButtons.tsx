import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ForecastData {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  dt_txt: string;
}

interface ForecastButtonsProps {
  forecastData: ForecastData[];
  selectedDay: number;
  onDaySelect: (index: number) => void;
}

const ForecastButtons: React.FC<ForecastButtonsProps> = ({
  forecastData,
  selectedDay,
  onDaySelect
}) => {
  // Agrupar pronósticos por día y calcular promedios
  const dailyForecasts = forecastData.reduce((acc, forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        temps: [],
        icon: forecast.weather[0].icon,
        description: forecast.weather[0].description,
        dt: forecast.dt
      };
    }
    acc[date].temps.push(forecast.main.temp);
    return acc;
  }, {} as Record<string, { temps: number[], icon: string, description: string, dt: number }>);

  // Convertir el objeto en array y calcular promedios
  const uniqueDays = Object.entries(dailyForecasts).map(([date, data]) => ({
    date,
    avgTemp: data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length,
    icon: data.icon,
    description: data.description,
    dt: data.dt
  }));

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      overflowX: 'auto', 
      p: 2,
      '&::-webkit-scrollbar': { display: 'none' },
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none'
    }}>
      {uniqueDays.map((day, index) => (
        <Button
          key={day.dt}
          variant={selectedDay === index ? "contained" : "outlined"}
          onClick={() => onDaySelect(index)}
          sx={{
            minWidth: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 2,
            whiteSpace: 'nowrap'
          }}
        >
          <Typography variant="body2">
            {new Date(day.dt * 1000).toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}
          </Typography>
          <img 
            src={`http://openweathermap.org/img/w/${day.icon}.png`}
            alt={day.description}
            style={{ width: 40, height: 40 }}
          />
          <Typography variant="body2">
            {Math.round(day.avgTemp)}°C
          </Typography>
        </Button>
      ))}
    </Box>
  );
};

export default ForecastButtons; 