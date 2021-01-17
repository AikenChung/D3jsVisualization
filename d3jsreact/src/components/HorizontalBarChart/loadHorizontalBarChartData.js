// import React, { useState, useEffect } from 'react';
// import * as d3 from 'd3';
//const csvUrl = 'https://';

//This function can be isolated as an independent .js file
export const loadHorizontalBarChartData = () => {
    
    // const [data, setData] = useState(null);

    // useEffect(() => {
    //     const row = d => {
    //         d.population = +d['2020'];
    //         return d;
    //     };

    //     d3.csv(csvUrl, row).then(data => {
    //         setData(data.slice(0, 10));
    //     });

    // }, []);

    const outputData = [{country: "China",population: 1415046000},
                {country: "India",population: 1354052000},
                {country: "United States",population: 326767000},
                {country: "Indonesia",population: 266795000},
                {country: "Brazil",population: 210868000},
                ];
    
    return outputData;
}
