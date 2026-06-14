import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, useMap, useMapEvents, Marker} from 'react-leaflet'
import './Map.css';
import { useEffect, useRef, useState } from 'react';
import links from "../../resources/links.js"
import colors from "../../resources/colors.js"
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import axios from 'axios';

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

  const [position, setPosition] = useState(initPos);
  const [popupData, setPopupData] = useState({}); // Stores data for the popup
  const [showPopup, setShowPopup] = useState(false); // Controls visibility of the popup content
  const markerRef = useRef(null); // Ref for the Leaflet marker

  useEffect(() => {
    try{
      getGeoJSONFromS3(links.counties).then(data => {
          setCountyData(data['features']);
      });
      
    }catch(error){
      console.error("Error fetching county boundary data:", error);
    }
  }, []);

  // Function to fetch field data based on clicked latitude and longitude
    const getFieldData = (latlng) => {
        console.log('Clicked LatLng:', latlng);
        let config = {};
        // Determine which Geoserver layer to query based on latitude
        config = {
            method: 'get',
            url: `${links.geoserver}/geoserver/wfs?service=wfs&request=GetFeature&version=2.0.0&typeName=${links.rotationLayer}&outputformat=application/json&CQL_FILTER=CONTAINS(the_geom, Point(${latlng.lat} ${latlng.lng}))`,
        };

        axios.request(config)
          .then((response) => {
            let data = response.data;
            console.log('Popup Data response: ', data);
            let problty = null, rotat = null;

            if (data.numberMatched === 1) { // If exactly one feature is matched
                problty =+ data.features[0].properties.problty; // Convert to number
                problty = Math.round(problty * 100) / 100; // Round to two decimal places
                rotat = data.features[0].properties.rotat;
                if (rotat === '0') { // Special handling for '0' rotation
                    rotat = 'Other';
                }
                setPopupData({
                    problty: problty,
                    rotat: rotat,
                    objectId: data.features[0].properties.OBJECTID
                });
                setShowPopup(true); // Show the popup
            } else {
                // If no field found, ensure popup is hidden and data is cleared
                setShowPopup(false);
                setPopupData({}); // Clear popup data
            }
          })
          .catch((error) => {
              console.log('Error fetching field data: ', error);
              // In case of error, also ensure popup is hidden and data cleared
              setShowPopup(false);
              setPopupData({});
          });
    };


    // Component to handle map interactions (clicks, location found)
    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                
                // setShowFeedback(false); // Hide the feedback form
                // setCorrectRot('');      // Clear the feedback input field

                setShowPopup(false); // Temporarily hide the popup while fetching new data
                setPosition(e.latlng); // Update marker position
                getFieldData(e.latlng); // Fetch data for the new clicked location

                // If a marker exists, try to open its popup.
                // The popup content will be updated once getFieldData resolves.
                let marker = markerRef.current;
                if (marker) {
                    marker.openPopup();
                }
            },
            locationfound(e) {
                map.flyTo(e.latlng, map.getZoom());
            },
        });
        return null; // This component doesn't render any visible UI
    }

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
                url={`${links.geoserver}/geoserver/wms`}
                transparent={true}
                format='image/png'
                opacity={1}
            />
          }

          <LocationMarker/>        
          <LeafletGeoSearch />
        </MapContainer>

    </div>

  )


}

export default Map