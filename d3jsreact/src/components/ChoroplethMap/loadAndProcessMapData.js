import * as d3 from 'd3';
import * as topojson from 'topojson';

// This function can be isolated as an independent .js file
export const loadAndProcessMapData = async () => {

        const outputData = await Promise.all([
            d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
            d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
        ])
        .then( ([tsvData, topoJsonData]) => {
            const rowById = tsvData.reduce((accumulator, d) => {
                accumulator[d.iso_n3] = d;
                return accumulator;
            }, {});

            const countriesMap = topojson.feature(topoJsonData, topoJsonData.objects.countries);
            
            countriesMap.features.forEach(d => {
                Object.assign(d.properties, rowById[d.id]);
            });
            
            return countriesMap; 
        });

        return outputData;
}
