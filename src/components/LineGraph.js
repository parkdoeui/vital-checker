import React from 'react';
import * as d3 from 'd3';

const HR_MIN = 0;
const HR_MAX = 130;

const LineGraph = ({ data, width, height }) => {

  const refinedData = data.filter(({ heartRate }) => heartRate !== 0);
  const xScale = d3.scaleLinear()
    .domain([0, refinedData.length - 1])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([HR_MIN, HR_MAX])
    .range([height, 0]);

  const lineGenerator = d3.line()
    .x((d, i) => {
      console.log(xScale(i), i);
      return xScale(i);
    })
    .y(d => yScale(d.heartRate))
    .curve(d3.curveMonotoneX);

  const pathData = lineGenerator(refinedData);

  return (
    <div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id='heartGradient' gradientTransform="rotate(90)">
            <stop offset='5%' stopColor='rgba(255, 195, 195, 0.7)' />
            <stop offset='50%' stopColor='rgba(255, 195, 195, 0)' />
          </linearGradient>
        </defs>
        <path stroke='rbga(255,255,255,0)' fill='url(#heartGradient)'  d={`M0,${height} `+ pathData + ` v${height} L0,${height}`} />
        <path stroke='#FA0000' fill='none' strokeWidth='5' d={pathData} />

      </svg>
    </div>
  );
};

export default LineGraph;
