
(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');
    const height = svg.attr('height'); 
    const xPosition = (d,i) => i;
    const colorScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon', 'lime', 'orange'])
        .range(['#c11d1d','yellow', 'lightgreen', 'orange']);

    const radiusScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([30]);

    // This part can be isolated as an independant .js file
    const colorLegend = (selection, props) =>{
        const { colorScale, 
                radiusScale, 
                spacing, 
                textOffset} = props;

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
                    .attr('r', d => radiusScale(d));

        groupsEnter.append('text')
        .merge(groups.select('text'))
            .text(d => d)
            .attr('dy', '0.32em')
            .attr('x', textOffset)
    };
    
    // This part can be isolated as an independant .js file
    const sizeLegend = (selection, props) =>{
        const { sizeScale, 
                spacing, 
                textOffset} = props;
        const ticks = sizeScale.ticks(5).filter(d => d !==0);
        const groups = selection.selectAll('g')
            .data(ticks);
        const groupsEnter = groups.enter().append('g');
        groupsEnter.merge(groups)
                    .attr('transform', (d,i) => 
                    `translate(0, ${i*spacing})`);
        groups.exit().remove();

        groupsEnter.append('circle')             
                .merge(groups.select('circle'))                                   
                    .attr('fill', d => colorScale)
                    .attr('r', sizeScale);

        groupsEnter.append('text')
        .merge(groups.select('text'))
            .text(d => d)
            .attr('dy', '0.32em')
            .attr('x', textOffset)
    };

    svg.append('g')
        .attr('transform', `translate(100, ${ height/5})`)
        .call(colorLegend, { 
            colorScale,
            radiusScale,
            spacing: 100,
            textOffset: 100          
        });
   
    const sizeScale =d3.scaleSqrt()
            .domain([0,10])
            .range([0, 50]);

    svg.append('g')
        .attr('transform', `translate(400, ${ height/10})`)
            .call(sizeLegend, { 
                sizeScale,
                spacing: 100,
                textOffset: 50          
            });
}(d3));