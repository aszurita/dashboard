import { Box, Card, Typography, Grid } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import CloudIcon from '@mui/icons-material/Cloud';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    cloudCover: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    tempMax?: number;
    tempMin?: number;
    weatherMain: string;
    weatherDescription: string;
    weatherIcon: string;
  };
  city: string;
}

const getWindDirection = (degrees: number): string => {
  const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

interface InfoCityProps {
  data: WeatherData | null;
}

function InfoCity({ data }: InfoCityProps): JSX.Element | null {
  if (!data) return null;

  return (
    <Card sx={{ 
      p: { xs: 2, sm: 4 },
      background: 'linear-gradient(135deg, #64B5F6 0%, #2196F3 100%)',
      color: 'white',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      height: '100%',
      gap: 2
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          mb: 2 
        }}>
          📍 {data.city}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <img 
            src={`http://openweathermap.org/img/wn/${data.current.weatherIcon}@2x.png`}
            alt={data.current.weatherDescription}
            style={{ width: 50, height: 50 }}
          />
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
            {data.current.temperature.toFixed(2)}°C
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ 
          textTransform: 'capitalize',
          mb: 2
        }}>
          {data.current.weatherDescription}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 3 
        }}>
          <DeviceThermostatIcon />
          <Typography>
            Max: {data.current.tempMax?.toFixed(1)}°C / Min: {data.current.tempMin?.toFixed(1)}°C
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1
          }}>
            <WaterDropIcon />
            <Typography variant="body2">Humidity</Typography>
            <Typography variant="h6">{data.current.humidity}%</Typography>
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
              {data.current.windSpeed.toFixed(2)} km/h
            </Typography>
            <Typography variant="body2">
              {getWindDirection(data.current.windDirection)}
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
            <Typography variant="h6">{data.current.pressure} hPa</Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default InfoCity;
