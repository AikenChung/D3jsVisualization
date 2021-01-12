import React, { useEffect, useState } from 'react';
import './App.css';
import ChoroplethMap from './components/ChoroplethMap/ChoroplethMap';
import {loadAndProcessMapData} from './components/ChoroplethMap/loadAndProcessMapData';
import InteractiveLineChart from './components/InteractiveLineChart/InteractiveLineChart';
import {loadLineChartData} from './components/InteractiveLineChart/loadLineChartData';
import ScatterPlotWithMenu from './components/ScatterPlotWithMenu/ScatterPlotWithMenu';
import {loadScatterPlotData} from './components/ScatterPlotWithMenu/loadScatterPlotData';
import VerBarChart from './components/VerticleBarChart/VBarChart';
import {loadVerticleBarChartData} from './components/VerticleBarChart/loadVerticleBarChartData';


function App () {

  const [countryData, setCountryData] = useState(null);
  const [dLineChartData, setdLineChartData] = useState(null);
  const [scatterPlotData, setScatterPlotData] = useState(null);
  const [verBarChartData, setVerBarChartData] = useState(null);

  useEffect( () => {
    async function fetchedData(){
      const mapData = await loadAndProcessMapData();
      setCountryData(mapData);
      const dynamicLineChartData = await loadLineChartData();
      setdLineChartData(dynamicLineChartData);
      const scatterPlotWihMenuData = await loadScatterPlotData();
      setScatterPlotData(scatterPlotWihMenuData);
      const verticleBarChartData = loadVerticleBarChartData();
      setVerBarChartData(verticleBarChartData);
    }
    fetchedData();
  },[]);

  return (
    <>
      <React.Fragment>
        <div className="App">         
        {
          dLineChartData ? <InteractiveLineChart width={960} height={500} data={dLineChartData}/> 
          : 'Loading...'
        }
        <br />
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
          countryData ? <ChoroplethMap width={960} height={500} data={countryData}/> 
          : 'Loading...'
        }
        </div>
      </React.Fragment>
    </>
  );

}

export default App;



    