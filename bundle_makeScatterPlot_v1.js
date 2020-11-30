
(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');
    
    // d.mpg = +d.mpg;
    // d.cylinders = +d.cylinders;
    // d.displacement = +d.displacement;
    // d.horsepower = +d.horsepower;
    // d.weight = +d.weight;
    // d.acceleration = +d.acceleration;
    // d.year = +d.year;
    // d.origin = d.origin;
    // d.name = d.name;
    const render = data =>{
        const graphTitle = 'Car Scatter Plot';
        const xValue = d => d.mpg;
        const yValue = d => d.horsepower;
        const circleRadius = 5; // radius for circle object
        const width = +svg.attr('width');
        const height = +svg.attr('height');
        const margin = { top: 50, right: 40, bottom: 50, left: 90 };
        const innerHeight = height - margin.top - margin.bottom;
        const innerWidth = width - margin.left - margin.right;   
        const xAxisTitle = 'Auto-MPG';
        const yAxisTitle = 'Auto-MPG';

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, xValue))
            .range([0, (innerHeight-10)])
            .nice();
        
        //const yScale = d3.scaleBand()
        //const yScale = d3.scalePoint()
        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue))
            .range([0,innerWidth])
            .nice();

        const g = svg.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`);

        const yAxis = d3.axisLeft(xScale)
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

        const xAxis = d3.axisBottom(yScale)
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

        console.log(xScale.domain());
        g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cx', d => yScale(yValue(d)))
        .attr('cy', d => xScale(xValue(d)))
        .attr('r', circleRadius);

        g.append('text')
            .attr('y', -10)
            .attr('x', 400)
            .attr('text-anchor', 'middle')
            .text(graphTitle);
    };

    d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
        .then(data => {
            data.forEach( d => {
                d.mpg = +d.mpg;
                d.cylinders = +d.cylinders;
                d.displacement = +d.displacement;
                d.horsepower = +d.horsepower;
                d.weight = +d.weight;
                d.acceleration = +d.acceleration;
                d.year = +d.year;
                d.origin = d.origin;
                d.name = d.name;});
            
            console.log(data);
            render(data);
        });
    
    
    

    //        
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));