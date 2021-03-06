//const { csv } = require("d3");

(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');

    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const margin = { top: 20, right: 40, bottom: 20, left: 80 };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    let data = [{country: "China",population: 1415046},
                {country: "India",population: 1354052},
                {country: "United States",population: 326767},
                {country: "Indonesia",population: 266795},
                {country: "Brazil",population: 210868},
                ];
    
    const render = data =>{
        const xValue = d => d.population;
        const yValue = d => d.country;
        
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, xValue)])
            .range([0, innerWidth]);
        
        const yScale = d3.scaleBand()
            .domain(data.map(yValue))
            .range([0, innerHeight])
            .padding(0.1);

        const g = svg.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`);

        g.append('g').call(d3.axisLeft(yScale));
        g.append('g').call(d3.axisBottom(xScale))
            .attr('transform',`translate(0,${innerHeight})`);

        console.log(xScale.domain());
        g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth());
    };
    console.log(data);
    data.forEach( d => {d.population = +d.population*1000;});
    render(data);

    
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));