
export const YAxis = ({ yScale, innerWidth }) => yScale.tcks().map(tickValue => (
    <g className="tick" transform={`translate(0, ${yScale(tickValue)})`}>
        <line x2={innerWidth} stroke="lightgrey" />
        <text 
        key={tickValue}
        style={{ textAnchor: 'end'}} 
        x={-5}
        dy=".32em"
        >
            {tickValue}
        </text>
    </g>
))