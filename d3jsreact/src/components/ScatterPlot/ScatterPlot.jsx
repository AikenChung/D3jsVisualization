import React, {useState} from 'react';
import * as d3 from 'd3';
import {XAxis} from './XAxis';
import {YAxis} from './YAxis';
import {MakeScatterPoints} from './MakeScatterPoints';
//import ReactDropdown from 'react-dropdown'; // npm install react-dropdown --save
 import { Dropdown } from './Dropdown';
import { ColorLegend } from './ColorLegend';


function ScatterPlot (props) {    

    const {data, width, height} = props;

    const margin = { top: 50, right: 40, bottom: 50, left: 120 };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const attributes = data.columns;

    const getLabel = (attribute) => {
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i] === attribute) {
                return attributes[i];
            }
        }
    };
    
    const initialXAttribute = data.columns[4];
    const [xAttribute, setXAttribute] = useState( initialXAttribute );
    const xValue = (d) => d[xAttribute];
    const xAxisLabel = getLabel(xAttribute);

    const initialYAttribute = data.columns[0];
    const [yAttribute, setYAttribute] = useState( initialYAttribute );
    const yValue = (d) => d[yAttribute];
    const yAxisLabel = getLabel(yAttribute);

    const [hoveredValue, setHoveredValue] = useState(null);
    const colorValue = (d) => d.cylinders;
    const colorLegendLabel = 'cylinders';
    const fadeOpacity = 0.2;
    const circleRadius = 7;
    
    if(!data){
        return (<pre>Loading...</pre>);
    }

    const filteredData = data.filter(
        (d) => colorValue(d) === hoveredValue
    );

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();
    
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([(innerHeight-10), 0])
        .nice();

    const colorScale = d3.scaleOrdinal()
        .domain(data.map(colorValue))
        .range(['#e6842a', '#f5190a', '#137b80', '#0a7cf5', '#8e6c8a']);

    return (
        <div className="scatterPlot">
            <div className="menus-container">
                <span className="dropdown-label">X: </span>
                    <Dropdown
                        options={attributes}
                        selectedValue={xAttribute}
                        onSelectedValueChange={({ value }) => setXAttribute(value)}
                    /> 
                    {/* <ReactDropdown
                    options={attributes}
                    value={xAttribute}
                    onChange={({ value }) => setXAttribute(value)}
                    />          */}
                <span className="dropdown-label">Y: </span>
                    <Dropdown
                        options={attributes}
                        selectedValue={yAttribute}
                        onSelectedValueChange={({ value }) => setYAttribute(value)}
                    />
                    {/* <ReactDropdown
                    options={attributes}
                    value={yAttribute}
                    onChange={({ value }) => setYAttribute(value)}
                    /> */}
            </div> 
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <XAxis xScale={xScale} innerHeight={innerHeight}/>
                    <text className="xaxis-label"
                          x={innerWidth / 2}
                          y={innerHeight + 40}
                          textAnchor="middle">{xAxisLabel}</text>
                    <YAxis yScale={yScale} innerWidth={innerWidth}/>                   
                    <text className="yaxis-label"
                          textAnchor="middle"
                          transform={`translate(-60, ${innerHeight / 2}) rotate(-90)`}>
                        {yAxisLabel}</text>
                    <g transform={`translate(${innerWidth + 50},60)`}>
                        <text
                            x={50}
                            y={-30}
                            className="axis-label"
                            textAnchor="middle"
                        >
                            {colorLegendLabel}
                        </text>
                        <ColorLegend
                            colorScale={colorScale}
                            tickSpacing={30}
                            tickSize={circleRadius}
                            tickTextOffset={20}
                            onHover={setHoveredValue}
                            hoveredValue={hoveredValue}
                            fadeOpacity={fadeOpacity}
                        />
                    </g>
                    <g opacity={hoveredValue ? fadeOpacity : 1.0}>
                        <MakeScatterPoints
                        ScatterPointData={data}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        xValue={xValue}
                        yValue={yValue}
                        colorValue={colorValue}
                        circleRadius={circleRadius}
                        opacity={0.5}
                        />
                    </g>
                    <MakeScatterPoints
                        ScatterPointData={filteredData}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        xValue={xValue}
                        yValue={yValue}
                        colorValue={colorValue}
                        circleRadius={circleRadius}
                        opacity={1}
                    />                   
                </g>
            </svg>
        </div>
    );

}

export default ScatterPlot;