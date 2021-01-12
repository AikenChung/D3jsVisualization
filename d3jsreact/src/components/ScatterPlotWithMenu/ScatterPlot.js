import * as d3 from 'd3';

// This function can be isolated as an independent component
export const scatterPlot = (selection, props) => {
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

        xAxisGEnter.append('text')
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

            
        yAxisGEnter.append('text')
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