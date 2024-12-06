import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

interface WeatherItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface ForecastTableProps {
  forecastData: WeatherItem[];
  selectedDay: string;
}

const ForecastTable: React.FC<ForecastTableProps> = ({ forecastData, selectedDay }) => {
  // Filtrar los datos para el día seleccionado
  const filteredData = forecastData.filter(item => {
    const itemDate = item.dt_txt.split(' ')[0];
    return itemDate === selectedDay;
  });

  if (!filteredData || filteredData.length === 0) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        No hay datos disponibles para este día
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Hora</TableCell>
            <TableCell>Condición</TableCell>
            <TableCell align="right">Temperatura</TableCell>
            <TableCell align="right">Sensación</TableCell>
            <TableCell align="right">Humedad</TableCell>
            <TableCell align="right">Viento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.dt}>
              <TableCell>
                {item.dt_txt.split(' ')[1].slice(0, 5)}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img 
                    src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                    style={{ width: 30, height: 30 }}
                  />
                  {item.weather[0].description}
                </Box>
              </TableCell>
              <TableCell align="right">{Math.round(item.main.temp)}°C</TableCell>
              <TableCell align="right">{Math.round(item.main.feels_like)}°C</TableCell>
              <TableCell align="right">{item.main.humidity}%</TableCell>
              <TableCell align="right">
                {Math.round(item.wind.speed * 3.6)} km/h
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ForecastTable; 