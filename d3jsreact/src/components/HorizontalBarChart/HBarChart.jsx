import React from 'react';
import * as d3 from 'd3';
import {XAxis} from './XAxis';
import {YAxis} from './YAxis';
import {MakeBars} from './MakeBars';
import {loadHorizontalBarChartData} from './loadHorizontalBarChartData';

function HBarChart (props) {    

    const HBarChartData = loadHorizontalBarChartData();
    const {width, height} = props;

    const margin = { top: 50, right: 40, bottom: 50, left: 120 };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xValue = d => d.population;
    const yValue = d => d.country;
    const xAxisTitle = 'Population'

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(HBarChartData, xValue)])
        .range([0, innerWidth]);
    
    const yScale = d3.scaleBand()
        .domain(HBarChartData.map(yValue))
        .range([0,(innerHeight-10)])
        .padding(0.1);

    if(!HBarChartData){
        return (<pre>Loading...</pre>);
    }

    return (
        <div className="vBarChart"> 
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <XAxis xScale={xScale} innerHeight={innerHeight}/>
                    <YAxis yScale={yScale}/>
                    <text className="xaxis-label"
                          x={innerWidth / 2}
                          y={innerHeight + 40}
                          textAnchor="middle">{xAxisTitle}</text>
                    <MakeBars HBarChartData={HBarChartData}
                              xScale={xScale}
                              yScale={yScale}
                              xValue={xValue}
                              yValue={yValue} />
                </g>
            </svg>
        </div>
    );

}

export default HBarChart;
