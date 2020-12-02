
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

    svg.append('path')
      .attr('class','sphere')
      .attr('d', pathgenerator({ type: 'Sphere' }));
    //https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
        .then(data => {
            const countries = topojson.feature(data, data.objects.countries);
        
        svg.selectAll('path').data(countries.features)
          .enter().append('path')
          .attr('class','country')
          .attr('d', pathgenerator);
    });
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));
