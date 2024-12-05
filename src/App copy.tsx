import Grid from '@mui/material/Grid2'
import './App.css'
import IndicatorWeather from './components/IndicatorWeather'
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import { useEffect, useState } from 'react';

interface Item {
  dateStart: String;
  dateEnd: String;
  precipitation: String;
  humidity: String;
  clouds: String;
}

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  let [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    let request = async () => {
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      let nowTime = (new Date()).getTime();
      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        let API_KEY = "1603fe1c633d50ecd91d877dc4105993"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        let savedTextXML = await response.text();

        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay

        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        setOWM(savedTextXML)
      }

      if (savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        let dataToIndicators: Indicator[] = new Array<Indicator>();
        let dataToItems: Item[] = new Array<Item>();

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]
        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

        const times = xml.getElementsByTagName("time");
        for (let i = 0; i < Math.min(6, times.length); i++) {
          const time = times[i];
          const from = time.getAttribute("from") || "";
          const to = time.getAttribute("to") || "";
          const precipitation = time.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "";
          const humidity = time.getElementsByTagName("humidity")[0]?.getAttribute("value") || "";
          const clouds = time.getElementsByTagName("clouds")[0]?.getAttribute("all") || "";

          dataToItems.push({ dateStart: from, dateEnd: to, precipitation, humidity, clouds });
        }

        setIndicators(dataToIndicators)
        setItems(dataToItems)
      }
    }

    request();
  }, [owm])

  let renderIndicators = () => {
    return indicators
      .map(
        (indicator, idx) => (
          <Grid key={idx} size={{ xs: 12, xl: 3 }}>
            <IndicatorWeather
              title={indicator["title"]}
              subtitle={indicator["subtitle"]}
              value={indicator["value"]} />
          </Grid>
        )
      )
  }

  return (
    <Grid container spacing={5}>
      {/* Indicadores */}
      {renderIndicators()}

      {/* Tabla */}
      <Grid size={{ xs: 12, xl: 8 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, xl: 3 }}>
            <ControlWeather />
          </Grid>
          <Grid size={{ xs: 12, xl: 9 }}>
            <TableWeather itemsIn={items} />
          </Grid>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, xl: 4 }}>
        <LineChartWeather />
      </Grid>
    </Grid>
  )
}

export default App
