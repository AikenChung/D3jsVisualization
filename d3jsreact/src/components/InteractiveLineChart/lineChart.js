import * as d3 from 'd3';

const parseYear = d3.timeParse('%Y');

const yAxisTickFormat = number =>
    d3.format('.2s')(number)
    .replace('G','B')
    .replace('.0','');

// This part can be isolated as an independant .js file
export const lineChart = (selection, props) =>{
    const { colorScale,
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
    const xScale =  d3.scaleTime()
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
        .attr('class', 'linePath')
        .attr('fill', 'none')               
      .merge(linePaths)
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colorScale(d.key))
        .attr('opacity', 0.8)               
        .attr('stroke-width', 5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('mix-blend-mode', 'multiply');  

    //selectedYear
    const selectedYearDate = parseYear(selectedYear);

    gEnter.append('line')
        .attr('class', 'slected-year-line')
        .attr('y1', 0)
      .merge(g.select('.slected-year-line'))
        .attr('x1', xScale(selectedYearDate))
        .attr('x2', xScale(selectedYearDate))       
        .attr('y2', innerHeight-10)
        .attr('stroke','black')
        .attr('stroke-width','3px');
    
    gEnter.append('text')
        .attr('y', -10)
        .attr('x', 400)
        .attr('class','title')
        .attr('text-anchor', 'middle')
        .attr('fill','#635f5d')
        .attr('font-size','2em')
    .merge(g.select('.title'))
        .text(graphTitle);
        
    gEnter.append('text')
        .attr('class', 'slected-year-line-text')
    .merge(g.select('.slected-year-line-text'))
        .attr('x',xScale(selectedYearDate)-20)
        .attr('y',innerHeight+25);

    var mousePerLine = g.merge(gEnter).selectAll('.mouse-per-line')
        .data(nested)
    .enter()      
        .append("g")
        .attr("class", "mouse-per-line");
        
    mousePerLine.append("circle")
        .attr("r", 7)            
        .style("stroke", function(d) {
            return colorScale(d.key);
        })
        .style("fill", "none")
        .style("stroke-width", "3px")
        .style("opacity", "0");

    mousePerLine.append('text')
    .attr('class','circleText')
    .attr("transform", `translate(10,3)`);

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
            d3.select(".slected-year-line-text")
            .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
            d3.selectAll(".circleText")
            .style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".slected-year-line")
                .style("opacity", "1");
            d3.select(".slected-year-line-text")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".circleText")
                .style("opacity", "1");
        })
        .on('mousemove', function(event, d){
            const x = d3.pointer(event, this)[0];
            const hoverDate = xScale.invert(x);
            let hoveYearIndex = hoverDate.getFullYear() - 1950; 
            setSelectedYear(hoverDate.getFullYear());
            d3.selectAll('.slected-year-line-text')
                .text(function(d){
                    //console.log(hoverDate.getFullYear());
                    return hoverDate.getFullYear();
                    });
            d3.selectAll(".mouse-per-line")
            .attr("transform", function(d, i) {
                
                    d3.selectAll('.circleText')                 
                        .text(function(d){
                                //console.log(this);  
                                return (d.values[hoveYearIndex].population);
                            });

                    return "translate(" + x + "," + yScale(d.values[hoveYearIndex].population) +")";
                });
        });

}
