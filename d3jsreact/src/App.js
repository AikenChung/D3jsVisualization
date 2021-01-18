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
import MouseFollower from './components/MouseFollower/MouseFollower';
import HBarChart from './components/HorizontalBarChart/HBarChart';
import {loadScatterData} from './components/ScatterPlot/loadScatterData';
import ScatterPlot from './components/ScatterPlot/ScatterPlot';

function App () {

  const [countryData, setCountryData] = useState(null);
  const [dLineChartData, setdLineChartData] = useState(null);
  const [scatterPlotWithMenuData, setScatterPlotWithMenuData] = useState(null);
  const [verBarChartData, setVerBarChartData] = useState(null);
  const [scatterPlotData, setScatterPlotData] = useState(null);

  useEffect( () => {
    async function fetchedData(){
      const mapData = await loadAndProcessMapData();
      setCountryData(mapData);
      const dynamicLineChartData = await loadLineChartData();
      setdLineChartData(dynamicLineChartData);
      const scatterPlotMenuData = await loadScatterPlotData();
      setScatterPlotWithMenuData(scatterPlotMenuData);
      const verticleBarChartData = loadVerticleBarChartData();
      setVerBarChartData(verticleBarChartData);
      const scatterPlotData = await loadScatterData();
      setScatterPlotWithMenuData(scatterPlotData);
    }
    fetchedData();
  },[]);
//<ScatterPlot width={960} height={500}/>
  return (
    <>
      <React.Fragment>
        <div className="App">
        {
          scatterPlotData ? <ScatterPlot width={960} height={500} data={scatterPlotData}/> 
          : 'Loading...'
        }
        <br />  
          <MouseFollower width={960} height={500}/>         
        {
          dLineChartData ? <InteractiveLineChart width={960} height={500} data={dLineChartData}/> 
          : 'Loading...'
        }
        <br />
        {
          scatterPlotWithMenuData ? <ScatterPlotWithMenu width={960} height={500} data={scatterPlotWithMenuData}/> 
          : 'Loading...'
        }
        <br />
        {
          verBarChartData ? <VerBarChart width={960} height={500} data={verBarChartData}/> 
          : 'Loading...'
        }
        <br />
        <HBarChart width={960} height={500} />       
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



    