import * as d3 from 'd3';

const xAxisTickFormat = number =>
        d3.format(".2s")(number)
            .replace('G','B');

export const XAxis = ({ xScale, innerHeight}) => xScale.ticks().map(tickValue => (
    <g key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
        <line y2={innerHeight-10} stroke="lightgrey" />
        <text style={{ textAnchor: 'middle'}} dy=".71em" y={ innerHeight + 3 }>
            {xAxisTickFormat(tickValue)}
        </text>
    </g>
))