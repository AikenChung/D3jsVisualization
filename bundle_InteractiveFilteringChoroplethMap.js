(function (topojson) {
    
}(topojson));

// This function can be isolated as an independent .js file
const loadAndProcessData = () =>
    Promise
        .all([
            d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
            d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
        ])
        .then( ([tsvData, topoJsonData]) => {
            const rowById = tsvData.reduce((accumulator, d) => {
                accumulator[d.iso_n3] = d;
                return accumulator;
            }, {});

            const countries = topojson.feature(topoJsonData, topoJsonData.objects.countries);
            
            countries.features.forEach(d => {
                Object.assign(d.properties, rowById[d.id]);
            });

            return countries;
        });


// This part can be isolated as an independant .js file
const colorLegend = (selection, props) =>{
    const { colorScale, 
            radiusScale, 
            spacing, 
            textOffset,
            backgroundWidth,
            setSelectedItem, 
            selectedItem,
            onClick,
            selectedColoverValue} = props;

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

    const groups = selection.selectAll('.tick')
        .data(colorScale.domain());
    const groupsEnter = groups.enter().append('g')
            .attr('class', 'tick');
    groupsEnter.merge(groups)
                .attr('transform', (d,i) => `translate(0, ${i*spacing})`)
                
                .attr('opacity', d => 
                    (!selectedColoverValue || d === selectedColoverValue)
                    ? 1
                    : 0.2
                )
                .on('click', function(events,d){
                    onClick(
                        d === selectedColoverValue
                        ? null
                        : d   );
                });
    groups.exit().remove();

    groupsEnter.append('circle')             
            .merge(groups.select('circle'))                                   
                .attr('fill', colorScale)               
                .attr('r', radiusScale)
                .attr('stroke', d => 
                    (d === selectedItem || d === selectedColoverValue)
                                        ? 'black' 
                                        : 'none' )
                .attr('stroke-width', 2)                         
                .on('mouseover', function(events,d){setSelectedItem(d)})        
                .on('mouseout', function(){setSelectedItem(null)});

    groupsEnter.append('text')
    .merge(groups.select('text'))
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('x', textOffset)
};

//const projection = d3.geoMercator();
//const projection = d3.geoOrthographic();
const projection = d3.geoNaturalEarth1();
const pathgenerator = d3.geoPath().projection(projection);
// This part can be isolated as an independant .js file
const choroplethMap = (selection, props) => {
    const { 
        features,
        colorScale,
        colorValue,
        selectedColoverValue
    } = props;
    // general update pattern special case
    const gUpdate = selection.selectAll('g').data([null]);
    const gEnter = gUpdate.enter().append('g');
    const g = gUpdate.merge(gEnter);

    // Rendering outline of country
    gEnter.append('path')
        .attr('class','sphere')
        .attr('d', pathgenerator({ type: 'Sphere' }))
      .merge(gUpdate.select('.sphere'))
        .attr('opacity', selectedColoverValue ? 0.1 : 1);

    selection.call(d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    }));

    const countryPaths = g.selectAll('.country')
        .data(features);
    const countryPathsEnter = countryPaths
        .enter().append('path')
            .attr('class','country')
            .attr('d', pathgenerator)
            .attr('fill', d => colorScale(colorValue(d)));
    countryPaths
        .merge(countryPathsEnter)
          .attr('opacity', d =>
                ( !selectedColoverValue || d.properties.economy === selectedColoverValue)
                        ? 1
                        : 0.2)
          .classed('highlighted', d =>
            selectedColoverValue && selectedColoverValue === colorValue(d));
    countryPathsEnter.append('title')
            .text(d => d.properties.name + ': ' + colorValue(d));
};

(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');   
    const choroplethMapG = svg.append('g');
    const colorLegendG = svg.append('g')
            .attr('transform', `translate(25, 300)`);
    

    const colorScale = d3.scaleOrdinal();
    const colorValue = d => d.properties.economy;

    loadAndProcessData().then( countries => {
        features = countries.features;
        render();
    });
    let selectedItem;
    const setSelectedItem = d => {
        selectedItem = d;
        //console.log(selectedItem);
        render();
    };
    
    let selectedColoverValue;
    const onClick = d => {
        selectedColoverValue = d;
        //console.log(selectedColoverValue);
        render();
    };
    
    let features;
    const render = () => {
        colorScale.domain(features.map(colorValue))
                    .domain(colorScale.domain().sort())
                    .range(d3.schemeSpectral[colorScale.domain().length]);

        let selectedItem = null;
        
        colorLegendG.call(colorLegend, {
            colorScale,
            radiusScale:8,
            spacing: 20,
            textOffset: 10,
            backgroundWidth: 260,
            setSelectedItem, 
            selectedItem,
            onClick,
            selectedColoverValue
        });

        choroplethMapG.call(choroplethMap, {
            features,
            colorScale,
            colorValue,
            selectedColoverValue
        });
    };
    //https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json
    //'https://unpkg.com/world-atlas@1.1.4/world/110m.json'
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));
