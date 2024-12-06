import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface ForecastData {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface ForecastButtonsProps {
  forecastData: ForecastData[];
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

const ForecastButtons: React.FC<ForecastButtonsProps> = ({
  forecastData,
  selectedDay,
  onDaySelect
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      overflowX: 'auto', 
      p: 2,
      mb: 2,
      '&::-webkit-scrollbar': { display: 'none' },
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none'
    }}>
      {forecastData.map((day, index) => {
        const date = new Date(day.dt * 1000);
        return (
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
              whiteSpace: 'nowrap',
              bgcolor: selectedDay === index ? 'primary.main' : 'background.paper',
              '&:hover': {
                bgcolor: selectedDay === index ? 'primary.dark' : 'background.default'
              }
            }}
          >
            <Typography variant="body2">
              {date.toLocaleDateString('es-ES', { weekday: 'short' })}
            </Typography>
            <img 
              src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
              style={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">
              {Math.round(day.main.temp)}°C
            </Typography>
          </Button>
        );
      })}
    </Box>
  );
};

export default ForecastButtons; 