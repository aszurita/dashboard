import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ForecastData {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
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
  const dailyForecasts = forecastData.reduce((acc, forecast) => {
    const forecastDate = new Date(forecast.dt * 1000);
    const dateStr = forecastDate.toISOString().split('T')[0];
    
    if (!acc[dateStr]) {
      acc[dateStr] = {
        temps: [],
        icon: forecast.weather[0].icon,
        description: forecast.weather[0].description,
        dt: forecast.dt
      };
    }
    acc[dateStr].temps.push(forecast.main.temp);
    return acc;
  }, {} as Record<string, { temps: number[], icon: string, description: string, dt: number }>);

  // Agregar log para ver las fechas
  console.log('Fechas de los botones:', Object.keys(dailyForecasts));

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
        const displayDate = new Date(date + 'T00:00:00');
        
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
              {displayDate.toLocaleDateString('en-US', { 
                weekday: 'short',
                timeZone: 'UTC'
              }).toUpperCase()}
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