
(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');
    const xPosition = (d,i) => i * 180 + 50;
    const colorScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range(['#c11d1d','yellow']);

    const radiusScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([50,30]);

    const fruitBowl = (selection, props) =>{
        const { fruits, height} = props;
        
        const circles = selection.selectAll('circle')
            .data(fruits, d => d.id);
            circles.enter().append('circle')
                    .attr('cx', xPosition)              
                    .attr('cy', height/2)
                .merge(circles)
                    .attr('fill', d => colorScale(d.type))
                .transition().duration(1000)
                    .attr('cx', xPosition)    
                    .attr('r', d => radiusScale(d.type));
            circles.exit()
                .transition().duration(1000) 
                    .attr('r', 0)
                .remove();
        const circlesText = selection.selectAll('text')
        .data(fruits);
        circlesText.enter().append('text')
                .attr('x', xPosition)              
                .attr('y', height/2 + 100)
            .merge(circlesText)           
                .text(d => d.type);

        circlesText.exit()
                .remove();
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