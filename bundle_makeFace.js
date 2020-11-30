
(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const g = svg.append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);

const circle = g.append('circle');
//Objects for Face 
circle.attr('r', height / 2);
circle.attr('fill', 'yellow');
circle.attr('stroke', 'black');

const eyeSpacing = 101;
const eyeYOffset = -89;
const eyeRadius = 40;
const eyebrowWidth = 70;
const eyebrowHeight = 20;
const eyebrowYOffset = -70;

const eyesG = g
  .append('g')
    .attr('transform', `translate(0, ${eyeYOffset})`);

const leftEye = eyesG
  .append('circle')
    .attr('r', eyeRadius)
    .attr('cx', -eyeSpacing);

const rightEye = eyesG
  .append('circle')
    .attr('r', eyeRadius)
    .attr('cx', eyeSpacing);

const eyebrowsG = eyesG
  .append('g')
    .attr('transform', `translate(0, ${eyebrowYOffset})`);

eyebrowsG
  .transition().duration(2000)
    .attr('transform', `translate(0, ${eyebrowYOffset - 50})`)
  .transition().duration(2000)
    .attr('transform', `translate(0, ${eyebrowYOffset})`);

const leftEyebrow = eyebrowsG
  .append('rect')
    .attr('x', -eyeSpacing - eyebrowWidth / 2)
    .attr('width', eyebrowWidth)
    .attr('height', eyebrowHeight);

const rightEyebrow = eyebrowsG
  .append('rect')
    .attr('x', eyeSpacing - eyebrowWidth / 2)
    .attr('width', eyebrowWidth)
    .attr('height', eyebrowHeight); 

const mouth = g
  .append('path')
    .attr('d', d3.arc()({
      innerRadius: 150,
      outerRadius: 170,
      startAngle: Math.PI*1.3 / 2,
      endAngle: Math.PI * 2 / 2
    }));

    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));