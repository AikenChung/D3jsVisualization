

(function (d3) {
    'use strict';
    // This is an example of an ES6 module.
    //const message = "Hello World";
    
    // You can import API functions like this from D3.js.
    const svg = d3.select('svg');
    
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    const countryTreeLayout = d3.tree()
                            .size([height, width]);
    svg
        .attr('width', width)
        .attr('height', height);

    d3.json('https://gist.githubusercontent.com/curran/1dd7ab046a4ed32380b21e81a38447aa/raw/e04346c8fa26fb1d0f3a866f6ff30ddee74f9ae6/countryHierarchy.json')
    .then(data => {
        const root = d3.hierarchy(data);
        const links = countryTreeLayout(root).links();
        const linkPathGenerator = d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x);

        svg.selectAll('path').data(links)
            .enter().append('path')
              .attr('d', linkPathGenerator);
    });
    //This line uses D3 to set the text  of the message div.
    //d3.select('#message').text(message);
}(d3));