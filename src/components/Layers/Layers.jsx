import React from 'react'
import {Box, Card, CardContent, Checkbox, Stack} from '@mui/material';
import './Layers.css';
import { styled } from '@mui/material/styles';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import colors from "../../resources/colors.js";

const StarCheck = styled(Checkbox)(({ theme }) => ({
  "&.Mui-checked":{
    color: colors.green,
  }

}))

function Layers(props) {
     
  return (
    <div className = "layers">
   
        <Box sx = {{"height":"16px"}} />
        <Card elevation = {0} 
            sx = {{backgroundColor:colors.green, borderRadius: 8, padding:"0px"}}>
            <CardContent sx = {{height:"7px", padding:"0px"}}/>

            <CardContent sx= {{height:"57px"}}>
                <h1 className = "header">layers</h1>
            </CardContent>

            <CardContent sx = {{backgroundColor:colors.offWhite, height:"fit-content", maxHeight:"314px", padding:"5px"}}>
                <Box sx = {{"height":"3px"}} />

                <Stack direction = "row" alignItems="center">
                    <StarCheck icon={<StarBorderIcon />} checkedIcon={<StarIcon />}
                    checked={props.showRotation}
                    onChange={e => {
                        props.setShowRotation(e.target.checked);
                    }}/>
                    <h1 className = "layersTitle">Crop Rotation</h1>
                </Stack>

                <Stack direction = "row" alignItems="center">
                    <StarCheck icon={<StarBorderIcon />} checkedIcon={<StarIcon />} 
                    checked={props.showCounties}
                    onChange={e => {
                        props.setShowCounties(e.target.checked);
                    }}/>
                    <h1 className = "layersTitle">County Boundaries</h1>
                </Stack>

            </CardContent>

        </Card>


    </div>
  )
}

export default Layers