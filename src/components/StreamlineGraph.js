import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';




const StreamlineGraph = ({ data, width, height, config }) => {

  const { key, xAxisRange, yAxisRange, style, threshold, screeningMode } = config;
  const { color, strokeWidth } = style;
  const { max, min, unit } = threshold;
  const [draggedElement, setDraggedElement] = useState({ isDragged: false, target: null })
  useEffect(() => {


  }, [width])
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

  const getLine = (val) => d3.line()([[0, yScale(val)], [width, yScale(val)]])
  const getInvertedLine = (val) => d3.line()([[0, yScale.invert(val)], [width, yScale.invert(val)]])
  const [thresholdLines, setThresholdLines] = useState(
    {
      min: !isNaN(min) ? getLine(min) : null,
      max: !isNaN(max) ? getLine(max) : null,
    })




  const onDrag = (e, type) => {
    // console.log(e.nativeEvent.offsetY)
    if (type === 'max' || type === 'min') {
      setThresholdLines(prev => ({ ...prev, [type]: getInvertedLine(e.nativeEvent.offsetY) }))
    }
  }

  // console.log(threshold, thresholdLines)
  return (
    <div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={`gradient-${key}`} gradientTransform="rotate(90)">
            <stop offset='5%' stopColor={`${color}40`} />
            <stop offset='50%' stopColor={`${color}00`} />
          </linearGradient>
        </defs>
        {thresholdLines.max && <g onDragEnter={(e) => screeningMode && onDrag(e, 'max')}>
          <path id={`max-${key}`} strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={thresholdLines.max} />
          <text dy='-10' style={{
            fontSize: '12px',
          }}>
            <textPath xlinkHref={`#max-${key}`}>{`maximum ${max}${unit}`}</textPath>
          </text>
        </g>}
        {thresholdLines.min && <g onMouseDown={(e) => screeningMode && onDrag(e, 'min')}>
          <path id={`min-${key}`} strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={thresholdLines.min} />
          <text dy='20' style={{
            fontSize: '12px',
          }}>
            <textPath xlinkHref={`#min-${key}`}>{`minimum ${min}${unit}`}</textPath>
          </text>
        </g>}
        <path stroke='rbga(255,255,255,0)' fill={`url(#gradient-${key})`} d={`M0,${height} ` + path + ` v${height} L0,${height}`} />
        <path stroke={color} fill='none' strokeWidth={strokeWidth} d={path} />
      </svg>
    </div>
  );
};

export default StreamlineGraph;
