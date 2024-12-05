import { Box, Card, Typography, Grid } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import CloudIcon from '@mui/icons-material/Cloud';

interface WeatherData {
  current: {
    time: Date;
    temperature2m: number;
    relativeHumidity2m: number;
    apparentTemperature: number;
    isDay: number;
    cloudCover: number;
    pressureMsl: number;
    surfacePressure: number;
    windSpeed10m: number;
    windDirection10m: number;
    windGusts10m: number;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  city: string;
}

const getWindDirection = (degrees: number): string => {
  const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

const InfoCity = ({ data }: { data: WeatherData | null }) => {
  if (!data) return null;

  return (
    <Card sx={{ 
      p: { xs: 2, sm: 4 },
      background: 'linear-gradient(135deg, #64B5F6 0%, #2196F3 100%)',
      color: 'white',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 2 
        }}>
          📍 {data.city}
        </Typography>

        <Typography variant="h2" sx={{ 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <ThermostatIcon sx={{ fontSize: 40 }} />
          {parseFloat(data.current.temperature2m.toString()).toFixed(2)}°C
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1
          }}>
            <WaterDropIcon />
            <Typography variant="body2">Humidity</Typography>
            <Typography variant="h6">{data.current.relativeHumidity2m}%</Typography>
          </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1
          }}>
            <AirIcon />
            <Typography variant="body2">Wind</Typography>
            <Typography variant="h6">
              {parseFloat(data.current.windSpeed10m.toString()).toFixed(2)} km/h
            </Typography>
            <Typography variant="body2">
              {getWindDirection(data.current.windDirection10m)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1
          }}>
            <CloudIcon />
            <Typography variant="body2">Cloud Cover</Typography>
            <Typography variant="h6">{data.current.cloudCover}%</Typography>
          </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1
          }}>
            <CompressIcon />
            <Typography variant="body2">Pressure</Typography>
            <Typography variant="h6">{parseFloat(data.current.pressureMsl.toString()).toFixed(2)} hPa</Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default InfoCity;
