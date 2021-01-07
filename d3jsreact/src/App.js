import React, { useEffect, useState } from 'react';
import './App.css';
import ChoroplethMap from './components/ChoroplethMap/ChoroplethMap';
import {loadAndProcessMapData} from './components/ChoroplethMap/loadAndProcessMapData';

function App () {

  const [countryData, setCountryData] = useState(null);

  useEffect( async () => {
    const mapData = await loadAndProcessMapData();
    setCountryData(mapData);
  },[]);
            
  return (
    <React.Fragment>
      <div className="App">
      {
        countryData ? <ChoroplethMap width={960} height={500} data={countryData}/> 
        : 'Loading...'
      } 
      </div>
    </React.Fragment>
  );

}

export default App;
