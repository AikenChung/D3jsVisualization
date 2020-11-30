
(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');

    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const margin = { top: 50, right: 40, bottom: 50, left: 90 };
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
            .domain([d3.max(data, xValue), 0])
            .range([0, (innerHeight-10)]);
        
        const yScale = d3.scaleBand()
            .domain(data.map(yValue))
            .range([0,innerWidth])
            .padding(0.1);

        const g = svg.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`);
            
        const yAxisTickFormat = number =>
            d3.format(".3s")(number)
                .replace('G','B');

        const yAxis = d3.axisLeft(xScale)
                        .tickFormat(yAxisTickFormat)
                        .tickSize(-innerWidth);
                        
        g.append('g').call(yAxis);
        
        const xAxisWithLegend = g.append('g').call(d3.axisBottom(yScale))
            .attr('transform',`translate(0,${innerHeight-10})`);
        xAxisWithLegend.selectAll('.tick line') // '.domain'
            .remove();
        xAxisWithLegend.append('text')
            .attr('class', 'xAxis-label')
            .attr('y', 55)
            .attr('x', innerWidth/2)
            .attr('fill', 'black')
            .text('Population Per Country');

        console.log(xScale.domain());
        g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('x', d => yScale(yValue(d)))
        .attr('y', d => xScale(xValue(d)))
        .attr('height', d => innerHeight - xScale(xValue(d))-10)
        .attr('width', yScale.bandwidth());

        g.append('text')
            .attr('y', -10)
            .attr('x', 100)
            .text('Top 5 Most Population Countries');
    };
    console.log(data);
    data.forEach( d => {d.population = +d.population*1000;});
    render(data);

    //        
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));