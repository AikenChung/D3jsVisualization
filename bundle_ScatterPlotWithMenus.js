// This function can be isolated as an independent component
const dropdownMenu = (selection, props) => {
    const {
        options,
        onOptionClicked,
        selectedOption
    } = props;

    let select = selection.selectAll('select').data([null]);
    select = select.enter().append('select')
      .merge(select)
        .on('change', function(){
            onOptionClicked(this.value);
        });

    const option =  select.selectAll('option').data(options);
    option.enter().append('option')
      .merge(option)
        .attr('value', d => d)
        .property('selected', d => d === selectedOption)
        .text(d => d);
};

// This function can be isolated as an independent component
const scatterPlot = (selection, props) => {
    const {
        xValue,
        xAxisTitle,
        yValue,
        yAxisTitle,
        circleRadius,
        width,
        height,
        margin,
        data
    } = props;
        const innerHeight = height - margin.top - margin.bottom;
        const innerWidth = width - margin.left - margin.right;   

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth])
            .nice();
        
        //const yScale = d3.scaleBand()
        //const yScale = d3.scalePoint()
        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue))
            .range([innerHeight-10, 0])
            .nice();

        const g = selection.selectAll('.container').data([null]);
        const gEnter = g.enter().append('g')
                          .attr('class', 'container');
        gEnter.merge(g)
                .attr('transform',
                    `translate(${margin.left},${margin.top})`);

        const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(10);

        const yAxis = d3.axisLeft(yScale)
                        .tickSize(-innerWidth)
                        .tickPadding(10);
        
        const xAxisG = g.select('.x-axis');
        const xAxisGEnter = gEnter
          .append('g')
            .attr('class', 'x-axis')
        xAxisG    
          .merge(xAxisGEnter)
            .attr('transform',`translate(0, ${innerHeight-10})`)
            .call(xAxis)
            .selectAll('.domain').remove();

        const xAxisLAbelText = xAxisGEnter.append('text')
            .attr('class', 'xAxis-label')
            .attr('y', 55)
            .attr('fill', 'black')
          .merge(xAxisG.select('.xAxis-label'))
            .attr('x', innerWidth/2)           
            .text(xAxisTitle);

        const yAxisG = g.select('.y-axis');
        const yAxisGEnter = gEnter
          .append('g')
            .attr('class', 'y-axis')
        yAxisG    
          .merge(yAxisGEnter)
            .call(yAxis)
            .selectAll('.domain').remove();

            
        const yAxisLAbelText = yAxisGEnter.append('text')
            .attr('class', 'xAxis-label')
            .attr('y', -60)          
            .attr('fill', 'black')
            .attr('transform',`rotate(-90)`)
            .attr('text-anchor', 'middle')
          .merge(yAxisG.select('.xAxis-label'))
            .attr('x', -innerHeight/2)
            .text(yAxisTitle);

        const circles = g.merge(gEnter).selectAll('circle').data(data);
        circles.enter().append('circle')
            .attr('cx', innerWidth/2)
            .attr('cy', innerHeight/2)
            .attr('r',0)
          .merge(circles)
          .transition().duration(1000) // datapoint animation
          .delay((d, i) => i* 10) // movement animation
            .attr('cx', d => xScale(xValue(d)))
            .attr('cy', d => yScale(yValue(d)))
            .attr('r', circleRadius);

        
        /*g.append('text')
            .attr('class', 'title')
            .attr('y', -10)
            .attr('x', 400)
            .attr('text-anchor', 'middle')
            .text(graphTitle);*/
}

(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    // You can import API functions like this from D3.js.
    
    const svg = d3.select('svg');
    /*dropdownMenu(d3.select('#menus'), {
        options: ['A', 'B', 'C']
    });*/
    // d.mpg = +d.mpg;
    // d.cylinders = +d.cylinders;
    // d.displacement = +d.displacement;
    // d.horsepower = +d.horsepower;
    // d.weight = +d.weight;
    // d.acceleration = +d.acceleration;
    // d.year = +d.year;
    // d.origin = d.origin;
    // d.name = d.name;
    let data; // make "data" variable as state
    let xColumn;
    let yColumn;
    const onXColumnClicked = column => {
        xColumn = column;
        render();
    };
    const onYColumnClicked = column => {
        yColumn = column;
        render();
    };

    const render = () =>{
        
        d3.select('#x-menu')
            .call( dropdownMenu, {
                //options: ['A', 'B', 'C']
                options: data.columns,
                onOptionClicked: onXColumnClicked,
                selectedOption: xColumn
            });

        d3.select('#y-menu')
        .call( dropdownMenu, {
            //options: ['A', 'B', 'C']
            options: data.columns,
            onOptionClicked: onYColumnClicked,
            selectedOption: yColumn
        });

        svg.call(scatterPlot, {
            xValue : d => d[xColumn],
            xAxisTitle : 'Auto-'+xColumn,
            yValue : d => d[yColumn],
            yAxisTitle : 'Auto-'+yColumn,
            circleRadius : 5,// radius for circle object
            width : +svg.attr('width'),
            height :+svg.attr('height'),
            margin : { top: 40, right: 40, bottom: 50, left: 90 },
            data
        });
    };

    d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
        .then(loadedData => {
            data = loadedData;
            data.forEach( d => {
                d.mpg = +d.mpg;
                d.cylinders = +d.cylinders;
                d.displacement = +d.displacement;
                d.horsepower = +d.horsepower;
                d.weight = +d.weight;
                d.acceleration = +d.acceleration;
                d.year = +d.year;
                d.origin = d.origin;
                d.name = d.name;});
            xColumn = data.columns[4];
            yColumn = data.columns[0];
            render();
        });
    
    
    

    //        
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));