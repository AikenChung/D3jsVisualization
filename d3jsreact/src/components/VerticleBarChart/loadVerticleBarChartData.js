import * as d3 from 'd3';

// export const outputData = [{country: "China",population: 1415046},
//                 {country: "India",population: 1354052},
//                 {country: "United States",population: 326767},
//                 {country: "Indonesia",population: 266795},
//                 {country: "Brazil",population: 210868},
//                 ];

//This function can be isolated as an independent .js file
export const loadVerticleBarChartData = () => {
//export const loadVerticleBarChartData = async () => { 
    // const outputData = await Promise.all([
    //     d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
    //         ])
    //         .then( loadedData => {
    //             let fetchedData = loadedData[0];               
    //             fetchedData.forEach( d => {
    //                 d.mpg = +d.mpg;
    //                 d.cylinders = +d.cylinders;
    //                 d.displacement = +d.displacement;
    //                 d.horsepower = +d.horsepower;
    //                 d.weight = +d.weight;
    //                 d.acceleration = +d.acceleration;
    //                 d.year = +d.year;
    //                 d.origin = d.origin;
    //                 d.name = d.name;});

    //             return fetchedData;
    //         });

    const outputData = [{country: "China",population: 1415046},
                {country: "India",population: 1354052},
                {country: "United States",population: 326767},
                {country: "Indonesia",population: 266795},
                {country: "Brazil",population: 210868},
                ];

    return outputData;
}
