import { useState, Children } from 'react';
import {Stack, ToggleButton, Tooltip} from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import KeyIcon from '@mui/icons-material/Key';
import { styled } from '@mui/material/styles';
import colors from "../../resources/colors.js";

const RoundToggleButton = styled(ToggleButton)(({ theme }) => ({
  color: '#000000',
  backgroundColor: colors.offWhite,
  padding: theme.spacing(2),
  border: '4px solid',
  borderColor: '#000000',
  borderRadius: 50,
  "&.Mui-selected, &.Mui-selected:hover, &:hover": {
    color: '#000000',
    backgroundColor: colors.green,
    borderColor: '#00000000',
  },
  "&:hover":{
    borderColor: '#000000',
  }

}))

const getChildById = (children, id) => {
  const child = Children.map(children, (child => {
    if (child.props.id === id) return child;
    return null;
  }))
  return child;
}    

function Tools(props) {
  const [keySelected, setKeySelected] = useState(false);
  const [layersSelected, setLayersSelected] = useState(false);
  
  return (
    <>

    <Stack direction="column"  
      height= "92vh" justifyContent="space-between">

        <Stack zIndex= {2} direction = "column" spacing= {2}>
          <div/>

          <RoundToggleButton
          value="layers"
          selected={layersSelected}
          onChange={() => {
            setLayersSelected((prevSelected) => !prevSelected)
            !layersSelected && setKeySelected(false)
          }}>
            <Tooltip title = "Show Layers">
              <LayersIcon />
            </Tooltip>
          </RoundToggleButton>

          <RoundToggleButton
            value="key"
            selected={keySelected}
            onChange={() =>{
              setKeySelected((prevSelected) => !prevSelected)
              !keySelected && setLayersSelected(false)
            }}>
            <Tooltip title = "Show Legend">
              <KeyIcon />
            </Tooltip>
          </RoundToggleButton>

        </Stack>
        
    </Stack>
    {layersSelected && getChildById(props.children, "layers")}
    {keySelected && getChildById(props.children, "legend")}
    </>
  )
  
}

export default Tools