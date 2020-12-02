
(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');

    const width = document.body.clientWidth;;
    const height = document.body.clientHeight;
    svg
        .attr('width', width)
        .attr('height', height)
    .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('rx', 40);

    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));