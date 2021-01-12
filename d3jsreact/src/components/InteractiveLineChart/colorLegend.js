
export const colorLegend = (selection, props) =>{
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