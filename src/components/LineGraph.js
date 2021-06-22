import React from 'react';
import * as d3 from 'd3';

const HR_MIN = 30;
const HR_MAX = 130;

const LineGraph = ({ data, width, height, config }) => {

  const { key, xAxisRange, yAxisRange, style } = config;
  const { color, strokeWidth } = style;
  const refinedData = data.filter(({ heartRate }) => heartRate !== 0);

  const xScale = d3.scaleLinear()
    .domain(Array.isArray(xAxisRange) ? xAxisRange : [0, refinedData.length - 1])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(yAxisRange)
    .range([height, 0]);

  const lineGenerator = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d[key]))
    .curve(d3.curveMonotoneX);

  const path = lineGenerator(refinedData);

  const maxThreshold = d3.line()([[0, yScale(HR_MAX)], [width, yScale(HR_MAX )]]);
  const minThreshold = d3.line()([[0, yScale(HR_MIN)], [width, yScale(HR_MIN)]]);

  return (
    <div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id='gradient' gradientTransform="rotate(90)">
            <stop offset='5%' stopColor={`${color}40`} />
            <stop offset='50%' stopColor={`${color}00`} />
          </linearGradient>
        </defs>
        <g>
          <path id='max-path' strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={maxThreshold} />
          <text dy='-10' style={{
            fontSize: '12px',
          }}>
            <textPath xlinkHref='#max-path'>{`maximum ${HR_MAX}bpm`}</textPath>
          </text>
        </g>
        <g>
          <path id='min-path' strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={minThreshold} />
          <text dy='20'style={{
            fontSize: '12px',
          }}>
            <textPath xlinkHref='#min-path'>{`minimum ${HR_MIN}bpm`}</textPath>
          </text>
        </g>
        <path stroke='rbga(255,255,255,0)' fill='url(#gradient)'  d={`M0,${height} `+ path + ` v${height} L0,${height}`} />
        <path stroke='#FA0000' fill='none' strokeWidth={strokeWidth} d={path} />
      </svg>
    </div>
  );
};

export default LineGraph;
