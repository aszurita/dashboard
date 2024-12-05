import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './index.css';
import InfoCity from './components/Infocity';
import { fetchWeatherApi } from 'openmeteo';


// Images
import logo from '/assets/images/logo.png';
import ubication from '/assets/images/ubication.png';

interface Props {

  window?: () => Window;
}

const drawerWidth = 280;

const ecuadorProvinces: Record<string, string[]> = {
  'Azuay': ['Cuenca', 'Gualaceo', 'Paute', 'Sigsig', 'Girón', 'San Fernando', 'Santa Isabel', 'Pucar', 'Nabón'],
  'Bolívar': ['Guaranda', 'San Miguel', 'Caluma', 'Chillanes', 'Echeandía', 'Chimbo'],
  'Cañar': ['Azogues', 'Cañar', 'Biblián', 'La Troncal'],
  'Chimborazo': ['Riobamba', 'Guano', 'Alausí', 'Chambo', 'Colta', 'Penipe', 'Pallatanga', 'Guamote', 'Chunchi', 'Cumandá'],
  'Cotopaxi': ['Latacunga', 'Saquisilí', 'Pujilí', 'Salcedo', 'Sigchos', 'La Maná'],
  'El Oro': ['Machala', 'Santa Rosa', 'Pasaje', 'Huaquillas', 'Zaruma', 'Portovelo', 'El Guabo', 'Arenillas', 'Atahualpa', 'Balsas', 'Chilla', 'Marcabelí'],
  'Esmeraldas': ['Esmeraldas', 'Atacames', 'Quinindé', 'San Lorenzo', 'Muisne', 'La Concordia', 'Rioverde'],
  'Galápagos': ['Puerto Baquerizo Moreno', 'Puerto Ayora', 'Puerto Villamil'],
  'Guayas': ['Guayaquil', 'Durán', 'Samborondón', 'Milagro', 'Daule', 'Playas', 'El Triunfo', 'Naranjal', 'Balao', 'Balzar', 'Colimes', 'Palestina', 'Pedro Carbo', 'Salitre', 'Santa Lucía', 'Yaguachi Nuevo'],
  'Imbabura': ['Ibarra', 'Otavalo', 'Cotacachi', 'Atuntaqui', 'Pimampiro', 'Urcuquí'],
  'Loja': ['Loja', 'Catamayo', 'Macará', 'Cariamanga', 'Celica', 'Saraguro', 'Sozoranga', 'Gonzanamá', 'Quilanga', 'Espíndola'],
  'Los Ríos': ['Babahoyo', 'Quevedo', 'Ventanas', 'Vinces', 'Buena Fe', 'Puebloviejo', 'Montalvo', 'Mocache', 'Palenque', 'Quinsaloma'],
  'Manabí': ['Portoviejo', 'Manta', 'Chone', 'Bahía de Caráquez', 'Jipijapa', 'Montecristi', 'El Carmen', 'Sucre', 'Tosagua', 'Santa Ana', 'Paján', 'Pedernales', 'San Vicente', 'Bolívar', 'Jama', 'Jaramijó', 'Junín', 'Olmedo', 'Flavio Alfaro'],
  'Morona Santiago': ['Macas', 'Gualaquiza', 'Sucúa', 'Limón Indanza', 'Santiago', 'Palora', 'Huamboya', 'San Juan Bosco', 'Taisha', 'Logroño'],
  'Napo': ['Tena', 'Archidona', 'El Chaco', 'Carlos Julio Arosemena Tola', 'Baeza'],
  'Orellana': ['Puerto Francisco de Orellana', 'La Joya de los Sachas', 'Loreto', 'Nuevo Rocafuerte'],
  'Pastaza': ['Puyo', 'Mera', 'Santa Clara', 'Arajuno'],
  'Pichincha': ['Quito', 'Cayambe', 'Rumiñahui', 'Mejía', 'Pedro Moncayo', 'Pedro Vicente Maldonado', 'San Miguel de los Bancos', 'Puerto Quito'],
  'Santa Elena': ['Santa Elena', 'La Libertad', 'Salinas'],
  'Santo Domingo de los Tsáchilas': ['Santo Domingo', 'La Concordia'],
  'Sucumbíos': ['Nueva Loja', 'Shushufindi', 'Lago Agrio', 'Cuyabeno', 'Putumayo', 'Sucumbíos'],
  'Tungurahua': ['Ambato', 'Baños de Agua Santa', 'Cevallos', 'Mocha', 'Patate', 'Pelileo', 'Quero', 'Tisaleo'],
  'Zamora Chinchipe': ['Zamora', 'Yantzaza', 'Nangaritza', 'Centinela del Cóndor', 'Palanda', 'Chinchipe', 'El Pangui', 'Paquisha'],
};

// Actualizar la interfaz WeatherData
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
  city: string; // Añadida la propiedad city
}

function App(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedProvince, setSelectedProvince] = React.useState<string | null>('Guayas');
  const [selectedCity, setSelectedCity] = React.useState<string | null>('Guayaquil');

  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleProvinceChange = (event: React.SyntheticEvent, newValue: string | null) => {
    if (newValue) {
      setSelectedProvince(newValue);
      setSelectedCity(ecuadorProvinces[newValue][0]);
    } else {
      setSelectedProvince('Guayas');
      setSelectedCity('Guayaquil');
    }
  };

  const handleCityChange = (event: React.SyntheticEvent, newValue: string | null) => {
    if (newValue) {
      setSelectedCity(newValue);
    } else if (selectedProvince) {
      setSelectedCity(ecuadorProvinces[selectedProvince][0]);
    }
  };

  // Actualizar el fetchWeatherData para incluir la ciudad
  const fetchWeatherData = React.useCallback(async (city: string) => {
    try {
      const API_KEY = "1603fe1c633d50ecd91d877dc4105993";
      const geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city},EC&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();
      
      if (geoData && geoData.length > 0) {
        const { lat: latitude, lon: longitude } = geoData[0];
        
        const params = {
          latitude,
          longitude,
          current: ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "cloud_cover", "pressure_msl", "surface_pressure", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"]
        };
        
        const responses = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", params);
        const response = responses[0];
        
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const current = response.current()!;

        const weatherData: WeatherData = {
          current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0)!.value(),
            relativeHumidity2m: current.variables(1)!.value(),
            apparentTemperature: current.variables(2)!.value(),
            isDay: current.variables(3)!.value(),
            cloudCover: current.variables(4)!.value(),
            pressureMsl: current.variables(5)!.value(),
            surfacePressure: current.variables(6)!.value(),
            windSpeed10m: current.variables(7)!.value(),
            windDirection10m: current.variables(8)!.value(),
            windGusts10m: current.variables(9)!.value(),
          },
          coordinates: { latitude, longitude },
          city: city
        };

        setWeatherData(weatherData);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, []);

  React.useEffect(() => {
    if (selectedCity) {
      fetchWeatherData(selectedCity);
    }
  }, [selectedCity, fetchWeatherData]);

  const drawer = (
    <Box sx={{ textAlign: 'center', height: '100%', bgcolor: '#2196f3', color: 'white' }}>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '150px'
      }}>
        <img 
          src={logo} 
          alt="Logo"
          style={{
            maxHeight: '100%',
            width: 'auto'
          }}
        />
      </Box>
      <Divider />
      <List>
        <ListItem>
          <Typography variant="h6" sx={{ textAlign: 'left', color: 'white', fontWeight: 'bold' }}>
            Selection
          </Typography>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ 
            flexDirection: 'column', 
            alignItems: 'flex-start',
            width: '100%',
            px: 2
          }}>
            <Autocomplete
              className='mb-2'
              disablePortal
              options={Object.keys(ecuadorProvinces)}
              value={selectedProvince}
              onChange={handleProvinceChange}
              sx={{ 
                width: '100%',
                borderRadius: '4px',
                color: 'white',
                mb: 2
              }}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  label="Province" 
                  variant="outlined"
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: 'white',
                      fontWeight: 'bold'
                    },
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      fontWeight: 'bold',
                      '& fieldset': {
                        borderColor: 'white'
                      },
                      '&:hover fieldset': {
                        borderColor: 'white'
                      }
                    }
                  }}
                />
              }
            />
            <Autocomplete
              disablePortal
              options={selectedProvince ? ecuadorProvinces[selectedProvince] : []}
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedProvince}
              sx={{ 
                width: '100%',
                borderRadius: '4px',
                color: 'white',
              }}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  label="City" 
                  variant="outlined"
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: 'white',
                      fontWeight: 'bold'
                    },
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      fontWeight: 'bold',
                      '& fieldset': {
                        borderColor: 'white'
                      },
                      '&:hover fieldset': {
                        borderColor: 'white'
                      }
                    }
                  }}
                />
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          display: { sm: 'none' },
          width: '100%'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            Weather App
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ 
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: { xs: '64px', sm: 0 },
          overflow: 'auto'
        }}
      >
        <Box sx={{ width: '100%', bgcolor: 'white', p: { xs: 0, sm: 2 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
            , px: { xs: 2, sm: 5 }, py: { xs: 2, sm: 3 },
            gap: 2
          }}>
            <Box>
              <Typography variant="h4" sx={{ 
                m: 0, 
                fontWeight: 600,
                fontSize: { xs: '1.8rem', sm: '2.125rem' }
              }}>
                Welcome to Weathero
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                m: 0,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Where the weather comes to life with accurate, up-to-the-minute data.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={ubication} alt="Logo" style={{ width: '30px', height: '30px' }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                {selectedProvince 
                  ? selectedCity 
                    ? `${selectedProvince}, ${selectedCity}`
                    : `${selectedProvince} (Select a city)`
                  : 'Select a province'}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Aquí va el contenido de tu aplicación */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, p: { xs: 2, sm: 5 } }}>
          <Box sx={{ flex: 1 }}>
            <InfoCity data={weatherData} />
          </Box>
          <Box sx={{ flex: 1 }}>
            {/* Aquí va el otro contenido */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


export default App
