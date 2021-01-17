
export const YAxis = ({ yScale }) => yScale.domain().map(tickValue => (
    <text 
     key={tickValue}
     style={{ textAnchor: 'end'}} 
     x={-5}
     dy=".32em"
     y={yScale(tickValue)+yScale.bandwidth() / 2}>
        {tickValue}
    </text>
))