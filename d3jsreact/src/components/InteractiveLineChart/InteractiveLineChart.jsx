import React, { useRef, useEffect} from 'react';
import * as d3 from 'd3';
import * as d3c from 'd3-collection';
import './InteractiveLineChart.css';

import {lineChart} from './lineChart';
import {ColorLegend} from './ColorLegend';

function InteractiveLineChart (props) {    

    const {width, height, data} = props;
    let svgRef_lineChar = useRef();
    
    
    const drawLineChart = () => { 

        // You can import API functions like this from D3.js.
        const svg = d3.select(svgRef_lineChar.current);
        const lineChartG = svg.append('g'); // for invoking the line chart
        const colorLegendG = svg.append('g');

        const graphTitle = 'World Population Over Time';
        const xValue = d => d.year;
        const yValue = d => d.population;
        const colorValue = d => d.name;
        const margin = { top: 50, right: 230, bottom: 50, left: 90 };
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10); 
        const xAxisTitle = 'Year';
        const yAxisTitle = 'Population';
        
        const lastYValue = d =>
                yValue(d.values[d.values.length - 1]);

        const nested = d3c.nest()
            .key(colorValue)
            .entries(data)
            .sort((a,b) =>
            d3.descending(lastYValue(a), lastYValue(b))
        );
           
        colorScale.domain(nested.map(d => d.key));

        // state
        let selectedYear = 2020;
        const setSelectedYear = year => {
            selectedYear = year;
            svgRender();
        }  

        const svgRender= () => {
            lineChartG.call(lineChart, {
                colorScale,
                colorValue,
                xValue,           
                yValue,
                margin,
                graphTitle,
                xAxisTitle,
                yAxisTitle,
                width,
                height,
                data,
                nested,
                selectedYear,
                setSelectedYear
            });

            colorLegendG
                .attr('transform', `translate(100, ${ height/5})`)
                .call(ColorLegend, { 
                    colorScale,
                    radiusScale:15,
                    spacing: 50,
                    textOffset: 680,
                    xPosition:650          
                });
        }
        svgRender();    
    };

    useEffect(() =>{        
        drawLineChart();
    });

    return (
        <div className="InteractiveLinChart">
            <svg ref={svgRef_lineChar} width={width} height={height}>
                {/* <ColorLegend
                    selection={svgRef_lineChar} 
                    colorScale={colorScale}
                    radiusScale={15}
                    spacing={50}
                    textOffset={680}
                    xPosition={650}
                /> */}
            </svg>
        </div>
    );

}

export default InteractiveLineChart;