import React from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data, width, height, config }) => {

  const { key, xAxisRange, yAxisRange, style, threshold } = config;
  const { color, strokeWidth } = style;
  const { max, min, unit } = threshold;
  const refinedData = data.filter(({ heartRate }) => heartRate !== 0);

  const xScale = d3.scaleLinear()
    .domain(Array.isArray(xAxisRange) ? xAxisRange : [0, refinedData.length - 1])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(yAxisRange)
    .range([height, 0]);

  const maxThreshold = max ? d3.line()([[0, yScale(max)], [width, yScale(max)]]) : null;
  const minThreshold = min ? d3.line()([[0, yScale(min)], [width, yScale(min)]]) : null;

  const lineGenerator = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d[key]))
    .curve(d3.curveMonotoneX);

  const path = lineGenerator(refinedData);

  return (
    <div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={`gradient-${key}`} gradientTransform="rotate(90)">
            <stop offset='5%' stopColor={`${color}40`} />
            <stop offset='50%' stopColor={`${color}00`} />
          </linearGradient>
        </defs>
        {maxThreshold && <g>
          <path id={`max-${key}`} strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={maxThreshold} />
          <text dy='-10' style={{
            fontSize: '12px',
          }}>
            <textPath xlinkHref={`#max-${key}`}>{`maximum ${max}${unit}`}</textPath>
          </text>
        </g>}
        {minThreshold && <g>
          <path id={`min-${key}`} strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={minThreshold} />
          <text dy='20' style={{
            fontSize: '12px',
          }}>
            <textPath xlinkHref={`#min-${key}`}>{`minimum ${min}${unit}`}</textPath>
          </text>
        </g>}
        <path stroke='rbga(255,255,255,0)' fill={`url(#gradient-${key})`}  d={`M0,${height} `+ path + ` v${height} L0,${height}`} />
        <path stroke={color} fill='none' strokeWidth={strokeWidth} d={path} />
      </svg>
    </div>
  );
};

export default LineGraph;
