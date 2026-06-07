import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, useMap, Marker} from 'react-leaflet'
import './Map.css';
import { useEffect, useRef, useState } from 'react';
import links from "../../resources/links.js"
import colors from "../../resources/colors.js"
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

function LeafletGeoSearch() {
    const map = useMap();
    useEffect(() => {
        const georgia = '-85.60674924999249,30.35909162440624,-80.84375612136121,35.000591132701324'
        const provider = new OpenStreetMapProvider({
          params: {
            viewbox: georgia, 
            bounded: 1
          },
        });
        const searchControl = new GeoSearchControl({
            provider,
            showMarker: false,
            animateZoom: true,
            searchLabel: 'search'
        });
        map.addControl(searchControl);
        document.getElementById('search-container').appendChild(
            document.querySelector(".geosearch")
        );
        return () => map.removeControl(searchControl);
    }, [map]);
    return null;
}

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


  // Popup settings
  // const [popupData, setPopupData] = useState({});
  // const markerRef = useRef(null);
  // const [showFeedback, setShowFeedback] = useState(false);
  // const [correctRot, setCorrectRot] = useState('');

  // Function to handle showing/hiding the feedback form
  // const handleFeedbackShow = (isFeedbackNeeded) => {
  //     setShowFeedback(isFeedbackNeeded);
  //     // If feedback is being hidden (user clicked 'Yes'), clear the input field
  //     if (!isFeedbackNeeded) {
  //         setCorrectRot('');
  //     }
  // };

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

        <MapContainer center={initPos} zoom={initZoom} scrollWheelZoom={true} zoomControl = {true}
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
                            
          <LeafletGeoSearch />
        </MapContainer>

    </div>

  )


}

export default Map