import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, useMap, useMapEvents, Marker, Popup} from 'react-leaflet'
import './Map.css';
import { useEffect, useRef, useState } from 'react';
import links from "../../resources/links.js"
import colors from "../../resources/colors.js"
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import axios from 'axios';
import {Stack, Button, TextField, Alert, Snackbar, Autocomplete} from '@mui/material';
import {divIcon} from 'leaflet'


function LeafletGeoSearch() {
    const map = useMap();
    useEffect(() => {
        const usa = '-124.77, 24.52, -66.95, 49.38'
        const provider = new OpenStreetMapProvider({
          params: {
            viewbox: usa, 
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

export async function getGeoJSONFromS3(s3URL) {
    try {
    const response = await fetch(s3URL);
    return await response.json();
  } catch (error) {
    console.error("Error while fetching GeoJSON from S3: " + JSON.stringify(error));
  }
}

function Map(props) {
  const initPos = [40, -95.86];

  const initZoom = 5;

  const [position, setPosition] = useState(initPos);
  const [popupData, setPopupData] = useState({}); // Stores data for the popup
  const [showPopup, setShowPopup] = useState(false); // Controls visibility of the popup content
  const markerRef = useRef(null); // Ref for the Leaflet marker

  const [proposedRot, setProposedRot] = useState(''); // Stores the value of the feedback input field

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false); // Controls Snackbar visibility for feedback success
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [selectedHistoricYear, setSelectedHistoricYear] = useState(null);
  const stringOptions = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

  var invisibleIcon = divIcon({
    className: 'hidden-marker', // Leave empty or style with CSS
    html: '', 
    iconSize: [0, 0]
  });


  // Function to fetch field data based on clicked latitude and longitude
  const getFieldData = (latlng) => {
      let state_config = {};
      state_config = {
          method: 'get',
          url: `${links.geoserver}/geoserver/wfs?service=wfs&request=GetFeature&version=2.0.0&typeName=${links.states}&outputformat=application/json&CQL_FILTER=CONTAINS(the_geom, Point(${latlng.lat} ${latlng.lng}))`,
      };


      axios.request(state_config)
        .then((response) => {
          let data = response.data;
          let curr_state = null;

          if (data.numberMatched === 1) { // If exactly one feature is matched
            curr_state = data.features[0].properties.STATE_ABBR

            let config = {};
            config = {
                method: 'get',
                url: `${links.geoserver}/geoserver/wfs?service=wfs&request=GetFeature&version=2.0.0&typeName=${links.rotationLayer+curr_state}&outputformat=application/json&CQL_FILTER=CONTAINS(the_geom, Point(${latlng.lat} ${latlng.lng}))`,
            };

            axios.request(config)
              .then((response) => {
                let data2 = response.data;
                let problty = null, rotat = null;
                let historic ={2017:null, 2018:null, 2019:null, 2020: null, 2021:null, 2022:null, 2023:null, 2024:null};

                if (data2.numberMatched === 1) { // If exactly one feature is matched
                    problty =+ data2.features[0].properties.problty; // Convert to number
                    problty = Math.round(problty * 100) / 100; // Round to two decimal places
                    rotat = data2.features[0].properties.rotat;
                    if (rotat === '0') { // Special handling for '0' rotation
                        rotat = 'Other';
                    }
                    historic = {2017:data2.features[0].properties.CDL2017, 2018: data2.features[0].properties.CDL2018, 
                      2019: data2.features[0].properties.CDL2019, 2020:data2.features[0].properties.CDL2020, 2021:data2.features[0].properties.CDL2021,
                      2022:data2.features[0].properties.CDL2022, 2023:data2.features[0].properties.CDL2023, 2024:data2.features[0].properties.CDL2024
                    }
                    setPopupData({
                        problty: problty,
                        rotat: rotat,
                        historic: historic,
                        objectId: data2.features[0].properties.OBJECTID
                    });
                    setShowPopup(true); // Show the popup
                } else {
                    // If no field found, ensure popup is hidden and data is cleared
                    setShowPopup(false);
                    setPopupData({}); // Clear popup data
                }
              })
              .catch((error1) => {
                  console.log('Error fetching field data: ', error1);
                  // In case of error, also ensure popup is hidden and data cleared
                  setShowPopup(false);
                  setPopupData({});
              });






              
          } else {
              // If no field found, ensure popup is hidden and data is cleared
              setShowPopup(false);
              setPopupData({}); // Clear popup data
          }
        })
        .catch((error2) => {
            console.log('Error fetching field data: ', error2);
            setShowPopup(false);
            setPopupData({});
        });

      
  };

  function LocationMarker() {
      const map = useMapEvents({
          click(e) {
              setProposedRot('');

              setShowPopup(false);
              setPosition(e.latlng);
              getFieldData(e.latlng);

              // If a marker exists, try to open its popup.
              // The popup content will be updated once getFieldData resolves.
              let marker = markerRef.current;
              if (marker) {
                  marker.openPopup();
              }
          },
          locationfound(e) {
          },
      });
      return null; 
  }

  // Function to handle submitting feedback to the Render server
  const handleSubmitFeedback = async() => {
    axios.post(`${links.renderServer}/add`, {
        lat: position.lat,
        long: position.lng,
        proposed_rotation: proposedRot}, 
        {timeout:5000})
        .then(response => {
            setSnackbarMessage('Feedback has been successfully stored.');
            setSnackbarSeverity('success');
            setIsSnackbarOpen(true);
        })
        .catch(error => {
            if (axios.isCancel(error) || error.code === 'ECONNABORTED'){
                setSnackbarMessage('Feedback submission timed out. Please check your network or try again. ');
            } else{
                setSnackbarMessage('Failed to submit feedback. Please try again later.');
            }

            setSnackbarSeverity('error');
            setIsSnackbarOpen(true);
        });

    setProposedRot('');

  };

  // Handler for closing the Snackbar
  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setIsSnackbarOpen(false);
  };

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
            <WMSTileLayer
                layers={links.counties}
                url={`${links.geoserver}/geoserver/wms`}
                transparent={true}
                format='image/png'
                opacity={1}
            />
          }

          {
            props.showStates &&
            <WMSTileLayer
                layers={links.states}
                url={`${links.geoserver}/geoserver/wms`}
                transparent={true}
                format='image/png'
                opacity={1}
            />
          }
          {
            props.showRotation && links.stateList.map((state) => {
              return (<WMSTileLayer
                key = {state}
                layers={links.rotationLayer+state}
                url={`${links.geoserver}/geoserver/wms`}
                transparent={true}
                format='image/png'
                opacity={1}
              />)
            })
              
          }


          {/* Marker with Popup */}


          <Marker ref={markerRef} position={position} icon={invisibleIcon}>
            <Popup maxWidth="400" maxHeight="600">
                {/* Conditional rendering for popup content */}
                {
                  // If showPopup is true AND popupData has content, show detailed info
                  showPopup && Object.keys(popupData).length > 0 ? (
                    <Stack direction="column">
                      <Stack direction="row">
                        <p>Crop Rotation : </p>
                        <p>{popupData.rotat} </p>
                      </Stack>

                      <Stack direction="row">
                        <p> Probability of Occurrence : </p>
                        <p>{popupData.problty}% </p>
                      </Stack>

                      <Stack direction="row">
                        <p> Historic Data : </p>
                        <Autocomplete
                          options={stringOptions}
                          onChange={(event, newValue) => {
                            setSelectedHistoricYear(newValue);
                          }}
                          width = "100%"
                          value={selectedHistoricYear}
                          renderInput={(params) => <TextField {...params} label="Select Year" />}
                        />
                      </Stack>

                      <Stack direction="row">
                        <p>{links.rotationMapping[popupData.historic[parseInt(selectedHistoricYear,10)]]}</p>
                      </Stack>

                      {
                        <>
                            <Stack direction="row">
                                <TextField
                                    label="Enter proposed rotation"
                                    value={proposedRot}
                                    onChange={(event) => (setProposedRot(event.target.value))}
                                    sx={{ width: '250px', height: '30px' }}
                                />
                                <Button onClick={() => { handleSubmitFeedback() }}>Submit</Button>
                            </Stack>
                            <br />
                        </>
                      }
                    </Stack>
                  ) : (
                    // If no popup data or showPopup is false, display "no field" message
                    <p fontSize={15}>There is no field at this location.</p>
                  )
                }
            </Popup>
          </Marker>

          <LocationMarker/>        
          <LeafletGeoSearch />
        </MapContainer>

        {/* Snackbar for feedback success notification */}
        <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>

    </div>

  )


}

export default Map