
(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');
    const xPosition = (d,i) => i +10;
    const colorScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range(['#c11d1d','yellow']);

    const radiusScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([50,30]);

    const fruitBowl = (selection, props) =>{
        const { fruits, height} = props;
        
        const bowl = selection.selectAll('rect')
        .data([null])
        .enter().append('rect')
            .attr('y',110)
            .attr('width',920)
            .attr('height',300)
            .attr('rx',300/2);

        const groups = selection.selectAll('g')
            .data(fruits);
        const groupsEnter = groups.enter().append('g');
        groupsEnter.merge(groups)
                    .attr('transform', (d, i) =>
                    `translate(${i * 180 + 100}, ${ height/2 })`
                    )
                    .transition().duration(1000);
        groups.exit()
                .attr('r', 0)
            .remove();

        groupsEnter.append('circle')
                    .attr('cx', xPosition)              
                .merge(groups.select('circle'))                                   
                    .attr('fill', d => colorScale(d.type))
                .transition().duration(1000)
                    .attr('cx', xPosition)
                    .attr('r', d => radiusScale(d.type));

        groupsEnter.append('text')
        .merge(groups.select('text'))
            .text(d => d.type)
            .attr('x', -50)
            .attr('y', 100)
    };

    const makeFruit = type => ({ 
                                type,
                                id: Math.random() });
    let fruits = d3.range(5)
        .map( () => makeFruit('apple'));
    
    const render = () => {
        fruitBowl(svg, { 
                        fruits,
                        height: +svg.attr('height') 
                    });
    };
    render();
    // Eat an apple
    setTimeout(() => {
        fruits.pop();
        render();
    }, 1000);

    // Replacing an apple with a lemon
    setTimeout(() => {
        fruits[2].type = 'lemon';
        render();
    }, 2000);

    // Eat another apple
    setTimeout(() => {
        fruits = fruits.filter((d, i) => i !== 1);
        render();
    }, 3000);
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));