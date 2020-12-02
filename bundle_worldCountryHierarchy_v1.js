

(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');
    
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const margin = { top: 0, right: 50, bottom: 0, left: 25};
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const countryTreeLayout = d3.tree()
                            .size([innerHeight, innerWidth]);
    const zoomG = svg
        .attr('width', width)
        .attr('height', height);

    const g = zoomG.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    //panning and zooming
    svg.call(d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    }));

    d3.json('https://gist.githubusercontent.com/curran/1dd7ab046a4ed32380b21e81a38447aa/raw/e04346c8fa26fb1d0f3a866f6ff30ddee74f9ae6/countryHierarchy.json')
    .then(data => {
        const root = d3.hierarchy(data);
        const links = countryTreeLayout(root).links();
        const linkPathGenerator = d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x);

        g.selectAll('path').data(links)
            .enter().append('path')
              .attr('d', linkPathGenerator);
        g.selectAll('text').data(root.descendants())
            .enter().append('text')
                .attr('x', d=>d.y)
                .attr('y', d=>d.x)
                .attr('dy', '0.32em')
                .attr('text-anchor', d => d.children ? 'middle' : 'start')
                .attr('font-size', d => 3.15-d.depth + 'em')
                .text(d => d.data.data.id);
    });
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));