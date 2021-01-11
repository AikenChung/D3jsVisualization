import React, { useEffect, useState } from 'react';
import './App.css';
import ChoroplethMap from './components/ChoroplethMap/ChoroplethMap';
import {loadAndProcessMapData} from './components/ChoroplethMap/loadAndProcessMapData';
import LineChart from './components/InteractiveLineChart/LineChart';
import {loadLineChartData} from './components/InteractiveLineChart/loadLineChartData';
import ScatterPlotWithMenu from './components/ScatterPlotWithMenu/ScatterPlotWithMenu';
import {loadScatterPlotData} from './components/ScatterPlotWithMenu/loadScatterPlotData';
import VerBarChart from './components/VerticleBarChart/vBarChart';
import {loadVerticleBarChartData} from './components/VerticleBarChart/loadVerticleBarChartData';


function App () {

  const [countryData, setCountryData] = useState(null);
  const [dLineChartData, setdLineChartData] = useState(null);
  const [scatterPlotData, setScatterPlotData] = useState(null);
  const [verBarChartData, setVerBarChartData] = useState(null);

  useEffect( async () => {
    const mapData = await loadAndProcessMapData();
    setCountryData(mapData);
    const dynamicLineChartData = await loadLineChartData();
    setdLineChartData(dynamicLineChartData);
    const scatterPlotWihMenuData = await loadScatterPlotData();
    setScatterPlotData(scatterPlotWihMenuData);
    const verticleBarChartData = loadVerticleBarChartData();
    setVerBarChartData(verticleBarChartData);
  },[]);

  return (
    <>
      <React.Fragment>
        <div className="App">
        {
          scatterPlotData ? <ScatterPlotWithMenu width={960} height={500} data={scatterPlotData}/> 
          : 'Loading...'
        }
        <br />
        {
          verBarChartData ? <VerBarChart width={960} height={500} data={verBarChartData}/> 
          : 'Loading...'
        }
        <br />      
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



    