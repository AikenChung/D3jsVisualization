
(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');
    
    const colorScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range(['#c11d1d','yellow']);

    const radiusScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([50,30]);

    const fruitBowl = (selection, props) =>{
        const { fruits, height} = props;
        const circles = selection.selectAll('circle')
            .data(fruits);
        circles.enter().append('circle')
                .attr('cx', (d,i) => i * 120 + 60)
                .attr('cy', height/2)
                .merge(circles)
                .attr('fill', d => colorScale(d.type))
                .attr('r', d => radiusScale(d.type));
        circles.exit().remove();
    };

    const makeFruit = type => ({ type });
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