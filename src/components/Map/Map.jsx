import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, useMap} from 'react-leaflet'
import './Map.css';
import { useEffect, useState } from 'react';
import links from "../../resources/links.js"
import colors from "../../resources/colors.js"

export function getGeoJSONFromS3(s3URL) {
    return fetch(s3URL)
        .then(response => response.json())
        .catch(error => {
            console.error("Error while fetching GeoJSON from S3: " + JSON.stringify(error));
        });
}

function Map(props) {
  const initPos = [33, -83];
  const initZoom = 7;
  const [countyData, setCountyData] = useState(null);

  useEffect(() => {
    try{
      getGeoJSONFromS3(links.counties).then(data => {
          setCountyData(data['features']);
      });
      
    }catch(error){
      console.error("Error fetching county boundary data:", error);
    }
  }, []);

  return (
    <div className = "map">

        <MapContainer center={initPos} zoom={initZoom} scrollWheelZoom={true} zoomControl = {false}
                      style={{ height:"100%", width: "100%", backgroundColor:"black",margin:"0px"}} >


          <TileLayer
            url={links.standardMap}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {
            props.showCounties &&
            countyData !== null && <GeoJSON
                style={{
                  opacity: 1,
                  fill : false,
                  color: colors.offWhite,
                  weight:1
                  }}
                key="ksok_geojson"
                data={countyData}
            />
          }

          {
            props.showRotation && 
            <WMSTileLayer
                layers={links.rotationLayer}
                url={`${links.geoserver}`}
                transparent={true}
                format='image/png'
                opacity={1}
            />
          }
                            
        </MapContainer>

    </div>

  )


}

export default Map