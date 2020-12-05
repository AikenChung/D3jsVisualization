
(function (topojson) { }(topojson));
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

// This function can be isolated as an independent .js file
const allCaps = str => str === str.toUpperCase();
const isRegion = name => allCaps(name) && name !== 'WORLD';
const parseYear = d3.timeParse('%Y');

const melt = (unData, minYear, maxYear) => {
    const years = d3.range(minYear, maxYear + 1);
    const data = [];

    unData.forEach( d => {
        const name = d['Region, subregion, country or area *']
                .replace('AND THE', '&');
        years.forEach( year => {
            const population = +d[year].replace(/ /g, '')*1000;
            const row = {
                //year: new Date(year + ''),
                year: parseYear(year),
                name,
                population
            };
            data.push(row);
        });
    });

    return data.filter(d => isRegion(d.name));
};
const loadAndProcessData = () =>
    Promise
        .all([
            //d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
            d3.csv('https://vizhub.com/curran/datasets/un-population-estimates-2017-medium-variant.csv'),
            d3.csv('https://vizhub.com/curran/datasets/un-population-estimates-2017.csv')
        ])
        .then( ([unDataMediumVariant, unDataEstimates]) => {
            
            return melt(unDataEstimates, 1950, 2014)
                    .concat(melt(unDataMediumVariant, 2015, 2100));
        });


(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');

    const render = data =>{
        const graphTitle = 'World Population Over Time';
        const xValue = d => d.year;
        const yValue = d => d.population;
        const colorValue = d => d.name;
        const circleRadius = 5; // radius for circle object
        const width = +svg.attr('width');
        const height = +svg.attr('height');
        const margin = { top: 50, right: 230, bottom: 50, left: 90 };
        const innerHeight = height - margin.top - margin.bottom;
        const innerWidth = width - margin.left - margin.right;   
        const xAxisTitle = 'Year';
        const yAxisTitle = 'Population';

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

        const yAxisTickFormat = number =>
          d3.format('.2s')(number)
            .replace('G','B')
            .replace('.0','');

        const yAxis = d3.axisLeft(yScale)
                        .tickSize(-innerWidth)
                        .tickFormat(yAxisTickFormat)
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
                radiusScale:15,
                spacing: 50,
                textOffset: 680,
                xPosition:650          
            });
    };

    loadAndProcessData()
      .then(render);

    //        
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));