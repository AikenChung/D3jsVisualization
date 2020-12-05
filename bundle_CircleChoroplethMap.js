(function (topojson) {
    
}(topojson));
// This part can be isolated as an independant .js file
const sizeLegend = (selection, props) =>{
    const { sizeScale, 
            spacing, 
            textOffset,
            tickFormat} = props;
    const ticks = sizeScale.ticks(5).filter(d => d !==0);
    const groups = selection.selectAll('g')
        .data(ticks);
    const groupsEnter = groups.enter().append('g');
    groupsEnter.merge(groups)
                .attr('transform', (d,i) => 
                `translate(0, ${i*spacing})`);
    groups.exit().remove();

    groupsEnter.append('circle')             
            .merge(groups.select('circle'))
                .attr('r', sizeScale);

    groupsEnter.append('text')
    .merge(groups.select('text'))
        .text(tickFormat)
        .attr('dy', '0.32em')
        .attr('x', textOffset)
};
// This function can be isolated as an independent .js file
const loadAndProcessData = () =>
    Promise
        .all([
            //d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
            d3.csv('https://vizhub.com/curran/datasets/un-population-estimates-2017-medium-variant.csv'),
            d3.json('https://unpkg.com/visionscarto-world-atlas@0.0.4/world/50m.json')
        ])
        .then( ([unData, topoJsonData]) => {
 
            const rowById = unData.reduce((accumulator, d) => {
                accumulator[d['Country code']] = d;
                return accumulator;
            }, {});

            const countries = topojson.feature(topoJsonData, topoJsonData.objects.countries);
            
            countries.features.forEach(d => {
                Object.assign(d.properties, rowById[+d.id]);
            });

            const featuresWithPopulation = countries.features
                .filter(d => d.properties['2018'])
                .map( d => {
                    d.properties['2018'] = +d.properties['2018'].replace(/ /g, '')*1000;
                    return d;
                });
            return {
                features: countries.features,
                featuresWithPopulation
            };
        });

// This part can be isolated as an independant .js file
const colorLegend = (selection, props) =>{
    const { colorScale, 
            radiusScale, 
            spacing, 
            textOffset,
            backgroundWidth} = props;

    const backgroundRect = selection.selectAll('rect')
            .data([null]);
    const n = colorScale.domain().length;
    backgroundRect.enter().append('rect')
      .merge(backgroundRect)
         .attr('x', -radiusScale * 2)
         .attr('y', -radiusScale * 2)
         .attr('rx', radiusScale * 2)
         .attr('width', backgroundWidth)
         .attr('height', spacing * n + radiusScale * 2)
         .attr('fill', 'white')
         .attr('opacity', 0.8);

    const groups = selection.selectAll('g')
        .data(colorScale.domain());
    const groupsEnter = groups.enter().append('g');
    groupsEnter.merge(groups)
                .attr('transform', (d,i) => `translate(0, ${i*spacing})`);
    groups.exit().remove();

    groupsEnter.append('circle')             
            .merge(groups.select('circle'))                                   
                .attr('fill', colorScale)
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
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');
    //const projection = d3.geoMercator();
    //const projection = d3.geoOrthographic();
    const projection = d3.geoNaturalEarth1();
    const pathgenerator = d3.geoPath().projection(projection);
    
    const radiusValue = d => d.properties['2018'];

    const g = svg.append('g');
    const colorLegendG = svg.append('g')
            .attr('transform', `translate(25, 300)`);

    g.append('path')
      .attr('class','sphere')
      .attr('d', pathgenerator({ type: 'Sphere' }));

    svg.call(d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    }));

    const colorScale = d3.scaleOrdinal();
    const colorValue = d => d.properties.economy;
    const populationFormat = d3.format(',');
    loadAndProcessData().then( countries => {
        
        const sizeScale = d3.scaleSqrt()
            .domain([0, d3.max(countries.features, radiusValue)])
            .range([0, 20]);  

        g.selectAll('path').data(countries.features)
              .enter().append('path')
                .attr('class','country')
                .attr('d', pathgenerator)
                .attr('fill', d => d.properties['2018'] ? '#d8d8d8' : 'gray')
              .append('title')
                .text(d => 
                    isNaN(radiusValue(d))
                    ? 'Missing data'
                    : [
                    d.properties['Region, subregion, country or area *'],
                    populationFormat(radiusValue(d))
                    ].join(': '));

        countries.featuresWithPopulation.forEach(d => {
            d.properties.projected = projection(d3.geoCentroid(d));
        });
        
        g.selectAll('circle').data(countries.featuresWithPopulation)
            .enter().append('circle')
            .attr('class','country-circle')
            .attr('cx', d => d.properties.projected[0])
            .attr('cy', d => d.properties.projected[1])
            .attr('r', d => sizeScale(radiusValue(d)));
            g.append('g') // for size legend
            .attr('transform', `translate(30, 100)`)
                .call(sizeLegend, { 
                    sizeScale,
                    spacing: 60,
                    textOffset: 30,
                    tickFormat: populationFormat
                })
            .append('text')
              .attr('class','legeng-title')
              .text('Population')
              .attr('x', -20)
              .attr('y',-40);
    });
    //https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json
    //'https://unpkg.com/world-atlas@1.1.4/world/110m.json'
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));
