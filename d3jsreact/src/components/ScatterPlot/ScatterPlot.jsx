import React from 'react';
import * as d3 from 'd3';
import {XAxis} from './XAxis';
import {YAxis} from './YAxis';
import {MakeScatterPoints} from './MakeScatterPoints';


function ScatterPlot (props) {    

    const {data, width, height} = props;

    const margin = { top: 50, right: 40, bottom: 50, left: 120 };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xValue = d => d.weight;
    const yValue = d => d.mpg;
    const xAxisTitle = 'Interactive Scatter Plot'

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([0,(innerHeight-10)])
        .padding(0.1);

    if(!data){
        return (<pre>Loading...</pre>);
    }

    return (
        <div className="scatterPlot"> 
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <XAxis xScale={xScale} innerHeight={innerHeight}/>
                    <YAxis yScale={yScale} innerWidth={innerWidth}/>
                    <text className="xaxis-label"
                          x={innerWidth / 2}
                          y={innerHeight + 40}
                          textAnchor="middle">{xAxisTitle}</text>
                    <MakeScatterPoints ScatterPointData={data}
                              xScale={xScale}
                              yScale={yScale}
                              xValue={xValue}
                              yValue={yValue} />
                </g>
            </svg>
        </div>
    );

}

export default ScatterPlot;
