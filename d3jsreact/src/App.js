import React, { useEffect, useState } from 'react';
import './App.css';
import ChoroplethMap from './components/ChoroplethMap/ChoroplethMap';
import {loadAndProcessMapData} from './components/ChoroplethMap/loadAndProcessMapData';
import LineChart from './components/InteractiveLineChart/LineChart';
import {loadLineChartData} from './components/InteractiveLineChart/loadLineChartData';


function App () {

  const [countryData, setCountryData] = useState(null);
  const [dLineChartData, setdLineChartData] = useState(null);

  useEffect( async () => {
    const mapData = await loadAndProcessMapData();
    setCountryData(mapData);
    const dynamicLineChartData = await loadLineChartData();
    setdLineChartData(dynamicLineChartData);
  },[]);
  
  const myScrollbar = {
    width: 550,
    height: 970*2,
  };

  return (
    <>
      <React.Fragment>
        <div className="App">
        
        {
          dLineChartData ? <LineChart width={960} height={500} data={dLineChartData}/> 
          : 'Loading...'
        }
        <br /> 
        {
          countryData ? <ChoroplethMap width={960} height={500} data={countryData}/> 
          : 'Loading...'
        }
        </div>
      </React.Fragment>
    </>
  );

}

export default App;



    