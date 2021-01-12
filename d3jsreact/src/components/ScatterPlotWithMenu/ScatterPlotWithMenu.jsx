import React, { useRef, useEffect} from 'react';
import * as d3 from 'd3';
import './ScatterPlotWithMenu.css'
import {scatterPlot} from './ScatterPlot';
import {dropdownMenu} from './dropdownMenu';


function ScatterPlotWithMenu (props) {    

    const {width, height, data} = props;
    let svgRef_scatterPlot = useRef();

    useEffect(() =>{        
        drawScatterSvg();
    });   

    let xColumn = data.columns[4];
    let yColumn = data.columns[0];

    const onXColumnClicked = column => {
        xColumn = column;
        drawScatterSvg();
    };
    const onYColumnClicked = column => {
        yColumn = column;
        drawScatterSvg();
    };

    const svg = d3.select(svgRef_scatterPlot.current);

    const drawScatterSvg = () => { 

            d3.select('#x-menu')
                .call( dropdownMenu, {
                    //options: ['A', 'B', 'C']
                    options: data.columns,
                    onOptionClicked: onXColumnClicked,
                    selectedOption: xColumn
                });

            d3.select('#y-menu')
            .call( dropdownMenu, {
                //options: ['A', 'B', 'C']
                options: data.columns,
                onOptionClicked: onYColumnClicked,
                selectedOption: yColumn
            });

            svg.call(scatterPlot, {
                xValue : d => d[xColumn],
                xAxisTitle : 'Auto-'+xColumn,
                yValue : d => d[yColumn],
                yAxisTitle : 'Auto-'+yColumn,
                circleRadius : 5,// radius for circle object
                width : +width,
                height :+height,
                margin : { top: 40, right: 40, bottom: 50, left: 90 },
                data
            });
    };

    return (
        <div className="scatterPlotWihMenu">
            <div id='menus'>
                <span id='y-menu'></span>
                vs.
                <span id='x-menu'></span>
            </div>
            <svg ref={svgRef_scatterPlot} width={width} height={height}/>
        </div>
    );

}

export default ScatterPlotWithMenu;