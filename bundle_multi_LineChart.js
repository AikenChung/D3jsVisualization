// This part can be isolated as an independant .js file
const colorLegend = (selection, props) =>{
    const { colorScale, 
            radiusScale, 
            spacing, 
            textOffset,
            xPosition} = props;

    const groups = selection.selectAll('g')
        .data(colorScale.domain());
    const groupsEnter = groups.enter().append('g');
    groupsEnter.merge(groups)
                .attr('transform', (d,i) => `translate(0, ${i*spacing})`)
                .transition().duration(1000);
    groups.exit()
            .attr('r', 0)
        .remove();

    groupsEnter.append('circle')
                .attr('cx', xPosition)              
            .merge(groups.select('circle'))                                   
                .attr('fill', colorScale)
            .transition().duration(1000)
                .attr('cx', xPosition)
                .attr('r', radiusScale);

    groupsEnter.append('text')
    .merge(groups.select('text'))
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('x', textOffset)
};

(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');

    const render = data =>{
        const graphTitle = 'A Week Temperature Around the World';
        const xValue = d => d.timestamp;
        const yValue = d => d.temperature;
        const colorValue = d => d.city;
        const circleRadius = 5; // radius for circle object
        const width = +svg.attr('width');
        const height = +svg.attr('height');
        const margin = { top: 50, right: 200, bottom: 50, left: 90 };
        const innerHeight = height - margin.top - margin.bottom;
        const innerWidth = width - margin.left - margin.right;   
        const xAxisTitle = 'Time';
        const yAxisTitle = 'Temperature';

        //const xScale = d3.scaleLinear()
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth])
            .nice();
        
        //const yScale = d3.scaleBand()
        //const yScale = d3.scalePoint()
        //const yScale = d3.scaleTime()
        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue))
            .range([innerHeight-10, 0])
            .nice();

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        
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

        const lineGenerator = d3.line()
            .x(d => xScale(xValue(d)))
            .y(d => yScale(yValue(d)))
            .curve(d3.curveBasis);
        
        const lastYValue = d =>
          yValue(d.values[d.values.length - 1]);
        const nested = d3.nest()
          .key(colorValue)
          .entries(data)
          .sort((a,b) =>
            d3.descending(lastYValue(a), lastYValue(b))
          );
        
        colorScale.domain(nested.map(d => d.key)); 

        g.selectAll('.line-path').data(nested)
          .enter().append('path')
            .attr('class', 'line-path')
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => colorScale(d.key));
        
        g.append('text')
            .attr('y', -10)
            .attr('x', 400)
            .attr('class','title')
            .attr('text-anchor', 'middle')
            .text(graphTitle);

        svg.append('g')
            .attr('transform', `translate(100, ${ height/5})`)
            .call(colorLegend, { 
                colorScale,
                radiusScale:20,
                spacing: 50,
                textOffset: 730,
                xPosition:700          
            });
    };

    //d3.csv('https://vizhub.com/curran/datasets/temperature-in-san-francisco.csv')
    d3.csv('https://vizhub.com/curran/datasets/data-canvas-sense-your-city-one-week.csv')
        .then(data => {
            data.forEach( d => {
                d.temperature = +d.temperature;
                d.timestamp = new Date(d.timestamp);
            });
            
            //console.log(data);
            render(data);
        });

    //        
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));