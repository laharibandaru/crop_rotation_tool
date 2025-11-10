import './App.css';
import { useState} from 'react';
import NavBar from './components/NavBar/NavBar'
import Map from './components/Map/Map'
import Tools from './components/Tools/Tools'
import Legend from './components/Legend/Legend';
import Layers from './components/Layers/Layers';

function App() {
  const [showRotation, setShowRotation] = useState(true);
  const [showCounties, setShowCounties] = useState(true);

  return (
    <div className = "mainBox">
      <div className = "interBox">
        <div className = "navBox">
          <NavBar/>
        </div>
        <div className = "toolBox">
          <Tools>
            <Legend id = "legend"/>
            <Layers id = "layers" showCounties = {showCounties} setShowCounties={setShowCounties} showRotation = {showRotation} setShowRotation = {setShowRotation}/>
          </Tools>
        </div>
      </div>
    
    <Map showCounties = {showCounties} showRotation = {showRotation}/>
    </div>
  );
}

export default App;
