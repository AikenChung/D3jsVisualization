
export const MakeScatterPoints = ({ ScatterPointData,
                            xScale,
                            yScale,
                            xValue,
                            yValue }) => ScatterPointData.map(
    (d, i) => 
        <circle
        key={i}
        className={"datapoint"}
        cx={xScale(xValue(d))} 
        cy={yScale(yValue(d))} 
        r={10}
        fill={ 'grey' } />);