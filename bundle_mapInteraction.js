
(function (topojson) {
    
}(topojson));

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
    const g = svg.append('g');

    g.append('path')
      .attr('class','sphere')
      .attr('d', pathgenerator({ type: 'Sphere' }));

    svg.call(d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    }));

    Promise.all([
        d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
        d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
    ]).then( ([tsvData, topoJsonData]) => {
        const countryName = tsvData.reduce((accumulator, d) => {
            accumulator[d.iso_n3] = d.name;
            return accumulator;
        }, {});
        /*
        const countryName = {};
        tsvData.forEach( d => {
            countryName[d.iso_n3] = d.name;
        });
        */
        const countries = topojson.feature(topoJsonData, topoJsonData.objects.countries);
        
        g.selectAll('path').data(countries.features)
            .enter().append('path')
              .attr('class','country')
              .attr('d', pathgenerator)
            .append('title')
              .text(d => countryName[d.id]); 
    });
    //https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json
    //'https://unpkg.com/world-atlas@1.1.4/world/110m.json'
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));
