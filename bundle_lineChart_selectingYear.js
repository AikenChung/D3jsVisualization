(function (d3) { }(d3));
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

// This part can be isolated as an independant .js file
const lineChart = (selection, props) =>{
    const { colorValue,
            colorScale,
            yValue,
            graphTitle,
            xValue,
            xAxisTitle,
            yAxisTitle,
            margin,
            width,
            height,
            data,
            nested,
            selectedYear,
            setSelectedYear
            } = props;   
    
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;   
    

    //const xScale = d3.scaleLinear()
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth]);
        //.nice();
    
    //const yScale = d3.scaleBand()
    //const yScale = d3.scalePoint()
    //const yScale = d3.scaleTime()
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight-10, 0])
        .nice();
   
    const g = selection.selectAll('.container').data([null]);
    const gEnter = g.enter().append('g')
                              .attr('class', 'container');
    gEnter
      .merge(g)
        .attr('transform',`translate(${margin.left},${margin.top})`);

    const yAxisTickFormat = number =>
        d3.format('.2s')(number)
        .replace('G','B')
        .replace('.0','');

    const yAxis = d3.axisLeft(yScale)
                    .tickSize(-innerWidth)
                    .tickFormat(yAxisTickFormat)
                    .tickPadding(10);
                    
    const yAxisGEnter = gEnter.append('g')
                      .attr('class', 'y-Axis');
    
    const yAxisG = g.select('.y-Axis');
    
    yAxisGEnter
        .merge(yAxisG)
            .call(yAxis)
            .selectAll('.domain').remove();

    yAxisGEnter.append('text')
        .attr('class', 'axis-label')
        .attr('y', -60)       
        .attr('fill', 'black')
        .attr('transform',`rotate(-90)`)
        .attr('text-anchor', 'middle')
      .merge(yAxisG.select('.axis-label'))
        .attr('x', -innerHeight/2)
        .text(yAxisTitle);

    const xAxis = d3.axisBottom(xScale)
                    .tickSize(-innerHeight)
                    .tickPadding(10);
    const xAxisGEnter = gEnter
                          .append('g')
                          .attr('class', 'x-axis');
    const xAxisG = g.select('.x-axis');
    xAxisGEnter
      .merge(xAxisG)                      
        .call(xAxis)
        .attr('transform',`translate(0,${innerHeight-10})`)
        .select('.domain').remove();

    xAxisGEnter.append('text')
        .attr('class', 'axis-label')
        .attr('y', 55)
        .attr('fill', 'black')
      .merge(xAxisG.select('.axis-label'))       
        .attr('x', innerWidth/2)       
        .text(xAxisTitle);

    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis);

    const linePaths = g.merge(gEnter)
        .selectAll('.line-path').data(nested);
    linePaths
        .enter().append('path')
          .attr('class', 'line-path')
        .merge(linePaths)
          .attr('d', d => lineGenerator(d.values))
          .attr('stroke', d => colorScale(d.key));  

    //selectedYear
    const selectedYearDate = parseYear(selectedYear);

    const mouseHoverLine = gEnter.append('line')
        .attr('class', 'slected-year-line')
        .attr('y1', 0)
      .merge(g.select('.slected-year-line'))
        .attr('x1', xScale(selectedYearDate))
        .attr('x2', xScale(selectedYearDate))       
        .attr('y2', innerHeight-10);

    gEnter.append('text')
        .attr('y', -10)
        .attr('x', 400)
        .attr('class','title')
        .attr('text-anchor', 'middle')
    .merge(g.select('.title'))
        .text(graphTitle);

    var mousePerLine = g.merge(gEnter).selectAll('.mouse-per-line')
        .data(nested)
      .enter()
        .append("g")
        .attr("class", "mouse-per-line")
      .append("circle")
        .attr("r", 7)            
        .style("stroke", function(d) {
            return colorScale(d.key);
        })
        .style("fill", "none")
        .style("stroke-width", "3px")
        .style("opacity", "0");

    mousePerLine.append('text')
       .attr("transform", "translate(10,3)");

    gEnter.append('rect')
        .attr('class', 'mouse-interceptor')       
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
      .merge(g.select('.mouse-interceptor'))
        .attr('width', innerWidth)
        .attr('height', innerHeight-10 )
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".slected-year-line")
              .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
              .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
              .style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".slected-year-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
        })
        .on('mousemove', function(event, d){
            const x = d3.pointer(event, this)[0];
            const y = d3.pointer(event, this)[1];
            const hoverDate = xScale.invert(x);
            let hoveYearIndex = hoverDate.getFullYear() - 1950; 
            setSelectedYear(hoverDate.getFullYear());
            /*d3.select(this).select('text')
                .attr('x', x)
                .attr('y', y)
              .text('testText');*/
              d3.selectAll(".mouse-per-line")
              .attr("transform", function(d, i) {
                
                //console.log(d.values[hoveYearIndex].population);
                //console.log(d);
                d3.select(this).select('text')
                  .text(function(d){
                      return(d.values[hoveYearIndex].population);
                  });    
                  //.text(d.values[hoveYearIndex].population);
                  //.text(y.toFixed(2));
                return "translate(" + x + "," + yScale(d.values[hoveYearIndex].population) +")";
              });
        });

}

(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');
    const lineChartG = svg.append('g'); // for invoking the line chart
    const colorLegendG = svg.append('g');
     
    // state
    let data;
    let selectedYear = 2020;
    const setSelectedYear = year => {
        selectedYear = year;
        render();
    }
    const render = () =>{
        const graphTitle = 'World Population Over Time';
        const xValue = d => d.year;
        const yValue = d => d.population;
        const colorValue = d => d.name;
        const margin = { top: 50, right: 230, bottom: 50, left: 90 };
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        const xAxisTitle = 'Year';
        const yAxisTitle = 'Population';
        const width = +svg.attr('width');
        const height = +svg.attr('height');
        
        const lastYValue = d =>
                yValue(d.values[d.values.length - 1]);
        

        
        const nested = d3.nest()
        .key(colorValue)
        .entries(data)
        .sort((a,b) =>
        d3.descending(lastYValue(a), lastYValue(b))
        );
           
        colorScale.domain(nested.map(d => d.key)); 

        lineChartG.call(lineChart, {
            colorScale,
            colorValue,
            xValue,           
            yValue,
            margin,
            graphTitle,
            xAxisTitle,
            yAxisTitle,
            width,
            height,
            data,
            nested,
            selectedYear,
            setSelectedYear
        });

        colorLegendG
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
      .then((loadedData) => {
          data = loadedData;
          render();
      });

    //        
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));