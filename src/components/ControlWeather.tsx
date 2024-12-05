{/* Componentes MUI */ }
import { useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


export default function ControlWeather() {

  {/* Arreglo de objetos */ }
  let items = [
    { "name": "Precipitación", "description": "Cantidad de agua que cae sobre una superficie en un período específico." },
    { "name": "Humedad", "description": "Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje." },
    { "name": "Nubosidad", "description": "Grado de cobertura del cielo por n   ubes, afectando la visibilidad y la cantidad de luz solar recibida." }
  ]

  {/* Arreglo de elementos JSX */ }
  let options = items.map((item, key) => <MenuItem key={key} value={key}>{item["name"]}</MenuItem>)


  let [selected, setSelected] = useState(-1)
  const descriptionRef = useRef<HTMLDivElement>(null);

  {/* Manejador de eventos */}
  const handleChange = (event: SelectChangeEvent) => {

    let idx = parseInt(event.target.value)
    // alert( idx );
    setSelected( idx );

    {/* Modificación de la referencia descriptionRef */}
    if (descriptionRef.current !== null) {
        descriptionRef.current.innerHTML = (idx >= 0) ? items[idx]["description"] : ""
    }

};



  {/* JSX */ }
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >

      <Typography mb={2} component="h3" variant="h6" color="primary">
        Variables Meteorológicas
      </Typography>

      <Box sx={{ minWidth: 120 }}>
        <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />
        <FormControl fullWidth>
          <InputLabel id="simple-select-label">Variables</InputLabel>
          <Select
            labelId="simple-select-label"
            id="simple-select"
            label="Variables"
            defaultValue='-1'
            onChange={handleChange}
          >

            <MenuItem key="-1" value="-1" disabled>{selected === -1 ? "Seleccione una variable" : selected}</MenuItem>

            {options}

          </Select>
        </FormControl>

      </Box>


    </Paper>


  )
}