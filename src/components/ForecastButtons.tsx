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
  selectedDay: string;
  onDaySelect: (date: string) => void;
}

const ForecastButtons: React.FC<ForecastButtonsProps> = ({
  forecastData,
  selectedDay,
  onDaySelect
}) => {
  // Agrupar pronósticos por día y calcular promedios
  const dailyForecasts = forecastData.reduce((acc, forecast) => {
    const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
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

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      overflowX: 'auto', 
      p: 2,
      '&::-webkit-scrollbar': { display: 'none' }
    }}>
      {Object.entries(dailyForecasts).map(([date, data]) => {
        const avgTemp = data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length;
        const displayDate = new Date(date);
        
        return (
          <Button
            key={date}
            variant={selectedDay === date ? "contained" : "outlined"}
            onClick={() => onDaySelect(date)}
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
              {displayDate.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}
            </Typography>
            <img 
              src={`http://openweathermap.org/img/w/${data.icon}.png`}
              alt={data.description}
              style={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">
              {Math.round(avgTemp)}°C
            </Typography>
          </Button>
        );
      })}
    </Box>
  );
};

export default ForecastButtons; 