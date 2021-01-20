
export const MakeScatterPoints = ({ ScatterPointData,
                            xScale,
                            yScale,
                            xValue,
                            yValue,
                            colorScale,
                            colorValue,
                            circleRadius,
                            opacity }) => ScatterPointData.map(
    (d, i) => 
        <circle
        key={i}
        className={"datapoint"}
        cx={xScale(xValue(d))} 
        cy={yScale(yValue(d))} 
        r={circleRadius}
        fill={ colorScale(colorValue(d))} 
        opacity={opacity} />);