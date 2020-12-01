
(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');

    const render = data =>{
        const graphTitle = 'A Week in San Francisco';
        const xValue = d => d.timestamp;
        const yValue = d => d.temperature;
        const circleRadius = 5; // radius for circle object
        const width = +svg.attr('width');
        const height = +svg.attr('height');
        const margin = { top: 50, right: 40, bottom: 50, left: 90 };
        const innerHeight = height - margin.top - margin.bottom;
        const innerWidth = width - margin.left - margin.right;   
        const xAxisTitle = 'Time';
        const yAxisTitle = 'Temperature';

        //const xScale = d3.scaleLinear()
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth]);
        
        //const yScale = d3.scaleBand()
        //const yScale = d3.scalePoint()
        //const yScale = d3.scaleTime()
        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue))
            .range([innerHeight-10, 0])
            .nice();

        const g = svg.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`);

        const yAxis = d3.axisLeft(yScale)
                        .tickSize(-innerWidth)
                        .tickPadding(10);
                        
        const yAxisWithLegend = g.append('g').call(yAxis);
        yAxisWithLegend.append('text')
        .attr('class', 'xAxis-label')
        .attr('y', -60)
        .attr('x', -innerHeight/2)
        .attr('fill', 'black')
        .attr('transform',`rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisTitle);

        const xAxis = d3.axisBottom(xScale)
                        .ticks(6)
                        .tickSize(-innerHeight)
                        .tickPadding(10);
        const xAxisWithLegend = g.append('g').call(xAxis)
            .attr('transform',`translate(0,${innerHeight-10})`);

        xAxisWithLegend.append('text')
            .attr('class', 'xAxis-label')
            .attr('y', 55)
            .attr('x', innerWidth/2)
            .attr('fill', 'black')
            .text(xAxisTitle);

        const areaGenerator = d3.area()
            .x(d => xScale(xValue(d)))
            .y0(innerHeight-10)
            .y1(d => yScale(yValue(d)));

        g.append('path')
            .attr('class', 'line-path')
            .attr('d', areaGenerator(data));
        
        g.append('text')
            .attr('y', -10)
            .attr('x', 400)
            .attr('text-anchor', 'middle')
            .text(graphTitle);
    };

    d3.csv('https://vizhub.com/curran/datasets/temperature-in-san-francisco.csv')
        .then(data => {
            data.forEach( d => {
                d.temperature = +d.temperature;
                d.timestamp = new Date(d.timestamp);
            });
            
            console.log(data);
            render(data);
        });

    //        
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));