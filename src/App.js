import './App.css';
import { useState} from 'react';
import NavBar from './components/NavBar/NavBar'
import Map from './components/Map/Map'
import Tools from './components/Tools/Tools'
import {Stack, Typography} from '@mui/material';
import Legend from './components/Legend/Legend';
import Layers from './components/Layers/Layers';

function App() {
  const [showRotation, setShowRotation] = useState(true);
  const [showCounties, setShowCounties] = useState(false);
  const [showStates, setShowStates] = useState(true);

  return (
    <Stack>
    <Stack>
      <div className = "mainBox">
        <div className = "interBox">
          <div className = "navBox">
            <NavBar/>
          </div>
          <div className = "toolBox">
            <Tools>
              <Legend id = "legend"/>
              <Layers id = "layers" showCounties = {showCounties} setShowCounties={setShowCounties} showRotation = {showRotation} setShowRotation = {setShowRotation} showStates = {showStates} setShowStates = {setShowStates}/>
            </Tools>
          </div>
        </div>
      <Map showCounties = {showCounties} showStates = {showStates} showRotation = {showRotation}/>
      </div>
    </Stack>
      <Stack style={{zIndex: 2, position: 'relative'}} >
        <a style={{color: '#f6ecda', paddingLeft:10}} href="https://www.linkedin.com/in/lahari-bandaru-852b33297"> Developed by Lahari Bandaru</a>
      </Stack>
    </Stack>
    
  );
}
export default App;
