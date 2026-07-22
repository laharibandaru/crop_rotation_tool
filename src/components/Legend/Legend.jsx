import React from 'react'
import {Box, Card, CardContent} from '@mui/material';
import './Legend.css';
import { useEffect, useState } from 'react';
import links from "../../resources/links.js"
import colors from "../../resources/colors.js"

function Legend() {
    const [legendInfo, setLegendData] = useState(null);

    useEffect(() => {
    const fetchLegend = async () => {
        try {
            const url = `${links.geoserver}/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=application/json&LAYER=${links.refLayer}&STYLE=${links.refStyle}`;
            const res = await fetch(url);
            const data = await res.json();
            setLegendData(data.Legend[0].rules);
        } catch (error) {
            console.error("Error fetching legend data:", error);
        }
    };
    fetchLegend();
}, []);
    
  return (
    <div className = "legend">
        {legendInfo != null && <>
            <Box sx = {{"height":"96px"}} />
            <Card elevation = {0} 
                sx = {{backgroundColor:colors.green, borderRadius: 8, padding:"0px"}}>
                <CardContent sx = {{height:"7px", padding:"0px"}}/>

                <CardContent sx= {{height:"57px"}}>
                    <h1 className = "header">legend</h1>
                </CardContent>

                <CardContent sx = {{backgroundColor:colors.offWhite, height:"calc(90vh - 350px)", minHeight:"100px", maxHeight:"314px", padding:"0px", "overflowY":"scroll"}}>
                    {Object.entries(legendInfo).map(([index, rotation]) => {
                        const color = rotation.symbolizers[0].Polygon.fill;

                        const red = parseInt(color.slice(1,3),16);
                        const green = parseInt(color.slice(3,5),16);
                        const blue = parseInt(color.slice(5),16);
                        const brightness = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
                        const textColor = (brightness>=128) ? "#000000" : "#ffffff";

                        return(
                            <div key = {index}>
                            <Box sx={{backgroundColor: color , padding:"10px", height: "70px"}} >
                                <h1 className = "keyTitle" style={{color:textColor}}>{rotation.name}</h1>
                                <h1 className = "keyHTML" style={{color:textColor}}>{color}</h1>
                            </Box>

                            <p className = "spacer">o</p>
                            </div>
                        )
                    })
                    }
                </CardContent>

                <CardContent sx = {{"backgroundColor":colors.offWhite, "padding":"0px"}}/>
            </Card>
        </>}

    </div>
  )
}

export default Legend