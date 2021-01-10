import * as d3 from 'd3';

// This function can be isolated as an independent .js file
export const loadScatterPlotData = async () => {

    const outputData = await Promise.all([
        d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
            ])
            .then( loadedData => {
                let fetchedData = loadedData[0];               
                fetchedData.forEach( d => {
                    d.mpg = +d.mpg;
                    d.cylinders = +d.cylinders;
                    d.displacement = +d.displacement;
                    d.horsepower = +d.horsepower;
                    d.weight = +d.weight;
                    d.acceleration = +d.acceleration;
                    d.year = +d.year;
                    d.origin = d.origin;
                    d.name = d.name;});

                return fetchedData;
            });

    return outputData;
}
