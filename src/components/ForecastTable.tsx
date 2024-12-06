import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';

interface WeatherData {
  dt: number;
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
  dt_txt: string;
}

interface ForecastTableProps {
  forecastData: WeatherData[];
  selectedDay: number;
}

const ForecastTable: React.FC<ForecastTableProps> = ({ forecastData, selectedDay }) => {
  if (!forecastData || forecastData.length === 0) {
    return <Box sx={{ p: 2 }}>No hay datos disponibles</Box>;
  }

  // Filtrar las entradas del día seleccionado
  const selectedDate = new Date(forecastData[selectedDay].dt * 1000).toISOString().split('T')[0];
  const dayForecasts = forecastData.filter(item => 
    new Date(item.dt * 1000).toISOString().split('T')[0] === selectedDate
  );

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hora</TableCell>
            <TableCell>Condición</TableCell>
            <TableCell align="right">Temperatura</TableCell>
            <TableCell align="right">Humedad</TableCell>
            <TableCell align="right">Nubosidad</TableCell>
            <TableCell align="right">Viento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dayForecasts.map((forecast) => (
            <TableRow key={forecast.dt}>
              <TableCell>
                {new Date(forecast.dt * 1000).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img 
                    src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                    alt={forecast.weather[0].description}
                    style={{ width: 30, height: 30 }}
                  />
                  {forecast.weather[0].description}
                </Box>
              </TableCell>
              <TableCell align="right">{Math.round(forecast.main.temp)}°C</TableCell>
              <TableCell align="right">{forecast.main.humidity}%</TableCell>
              <TableCell align="right">{forecast.clouds.all}%</TableCell>
              <TableCell align="right">
                {Math.round(forecast.wind.speed * 3.6)} km/h {forecast.wind.deg}°
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ForecastTable;