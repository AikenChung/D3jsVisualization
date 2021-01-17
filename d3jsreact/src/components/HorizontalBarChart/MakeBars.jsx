
export const MakeBars = ({ HBarChartData,
                            xScale,
                            yScale,
                            xValue,
                            yValue }) => HBarChartData.map(d => 
    <rect
     key={d.country} 
     x={0} 
     y={yScale(yValue(d))} 
     width={xScale(xValue(d))-10} 
     height={yScale.bandwidth()} 
     fill={ 'grey' } />)