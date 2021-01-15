import React, { useRef, useEffect} from 'react';
import * as d3 from 'd3';

function VerBarChart (props) {    

    const {width, height, data} = props;
    let svgRef_vBarChart = useRef();

    const margin = { top: 50, right: 40, bottom: 50, left: 90 };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xValue = d => d.population;
    const yValue = d => d.country;
    
    const xScale = d3.scaleLinear()
        .domain([d3.max(data, xValue), 0])
        .range([0, (innerHeight-10)]);
    
    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0,innerWidth])
        .padding(0.1);

    const yAxisTickFormat = number =>
        d3.format(".3s")(number)
            .replace('G','B');

    const yAxis = d3.axisLeft(xScale)
        .tickFormat(yAxisTickFormat)
        .tickSize(-innerWidth);

    useEffect(() =>{        
        drawSvg();
    });   

    const drawSvg = () => {            
        const svg = d3.select(svgRef_vBarChart.current);
            
        const g = svg.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`);
        
        g.append('g').call(yAxis);
        
        const xAxisWithLegend = g.append('g').call(d3.axisBottom(yScale))
            .attr('transform',`translate(0,${innerHeight-10})`);
        xAxisWithLegend.selectAll('.tick line') // '.domain'
            .remove();
        xAxisWithLegend.append('text')
            .attr('class', 'xAxis-label')
            .attr('y', 55)
            .attr('x', innerWidth/2)
            .attr('fill', 'Black')
            .text('Population Per Country');

        //console.log(xScale.domain());
        g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('x', d => yScale(yValue(d)))
        .attr('y', d => xScale(xValue(d)))
        .attr('height', d => innerHeight - xScale(xValue(d))-10)
        .attr('width', yScale.bandwidth())
        .attr('fill', 'Grey');

        g.append('text')
            .attr('y', -10)
            .attr('x', 100)
            .text('Top 5 Most Population Countries');    
    };

    return (
        <div className="vBarChart">
            <svg ref={svgRef_vBarChart} width={width} height={height}/>
        </div>
    );

}

export default VerBarChart;
