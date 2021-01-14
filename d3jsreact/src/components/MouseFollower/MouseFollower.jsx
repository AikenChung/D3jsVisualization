import React, { useState} from 'react';

const width = 960;
const height = 500;
const circleX = width / 2;
const circleY = width / 2;
const circleRadius = 30;

const initialMousePosition = { x: circleX, y: circleY };

const grey = "darkgrey";

function MouseFollower () {    

    const [mousePosition, setMousePosition] = useState(initialMousePosition);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX-15, y: clientY-50 });
  };

  return (
    <div className="chart-section">
      <h4 className="chart-title">Mouse follower</h4>
      <svg width={width} height={height} onMouseMove={handleMouseMove}>
        <circle
          cx={mousePosition.x}
          cy={mousePosition.y}
          r={circleRadius}
          fill={grey}
        />
      </svg>
    </div>
  );

}

export default MouseFollower;