import React, { useRef, useEffect} from 'react';
import * as d3 from 'd3';


function ChoroplethMap (props) {    

    const {width, height, data} = props;
    let svgRef = useRef();

    useEffect(() =>{
        drawMap();
    },[data]);
    
    const drawMap = () => { 
        
        const colorLegend = (selection, props) =>{
            const { colorScale, 
                    radiusScale, 
                    spacing, 
                    textOffset,
                    backgroundWidth} = props;
                
            const backgroundRect = selection.selectAll('rect')
                    .data([null]);
            const n = colorScale.domain().length;
            backgroundRect.enter().append('rect')
              .merge(backgroundRect)
                 .attr('x', -radiusScale * 2)
                 .attr('y', -radiusScale * 2)
                 .attr('rx', radiusScale * 2)
                 .attr('width', backgroundWidth)
                 .attr('height', spacing * n + radiusScale * 2)
                 .attr('fill', 'white')
                 .attr('opacity', 0.8);
        
            const groups = selection.selectAll('g')
                .data(colorScale.domain());
            const groupsEnter = groups.enter().append('g');
            groupsEnter.merge(groups)
                        .attr('transform', (d,i) => `translate(0, ${i*spacing})`);
            groups.exit().remove();
        
            groupsEnter.append('circle')             
                    .merge(groups.select('circle'))                                   
                        .attr('fill', colorScale)
                        .attr('r', radiusScale);
        
            groupsEnter.append('text')
            .merge(groups.select('text'))
                .text(d => d)
                .attr('dy', '0.32em')
                .attr('x', textOffset)
        };
        const svg = d3.select(svgRef.current);
        //const projection = d3.geoMercator();
        //const projection = d3.geoOrthographic();
        const projection = d3.geoNaturalEarth1();
        const pathgenerator = d3.geoPath().projection(projection);
        
        const g = svg.append('g');
        const colorLegendG = svg.append('g')
                .attr('transform', `translate(25, 300)`);

        g.append('path')
        .attr('class','sphere')
        .attr('d', pathgenerator({ type: 'Sphere' }));

        svg.call(d3.zoom().on('zoom', (event) => {
            g.attr('transform', event.transform);
        }));

        const colorScale = d3.scaleOrdinal();
        const colorValue = d => d.properties.economy;

        colorScale.domain(data.features.map(colorValue))
                  .domain(colorScale.domain().sort())
                  .range(d3.schemeSpectral[colorScale.domain().length]);

        colorScale.domain(data.features.map(colorValue))
                  .domain(colorScale.domain().sort())
                  .range(d3.schemeSpectral[colorScale.domain().length]);

        colorLegendG.call(colorLegend, {
            colorScale,
            radiusScale:8,
            spacing: 20,
            textOffset: 10,
            backgroundWidth: 260
        });
        g.selectAll('path').data(data.features)
              .enter().append('path')
                .attr('class','country')
                .attr('d', pathgenerator)
                .attr('fill', d => colorScale(colorValue(d)))
              .append('title')
                .text(d => d.properties.name + ': ' + colorValue(d));
        
        
    };

    return (
        <div className="choroplethMAp">
            <svg ref={svgRef} width={width} height={height}/>
        </div>
    );

}

export default ChoroplethMap;