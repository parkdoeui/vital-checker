import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

const StreamlineGraph = ({ data, width, height, config }) => {

  const { key, xAxisRange, yAxisRange, style, threshold, screeningMode } = config;
  const { color, strokeWidth } = style;
  const { max, min, unit } = threshold;
  const [isDragged, setIsDragged] = useState(false);
  //ix = initial X, iy = initial Y
  const [mousePos, setMousePos] = useState({ ix: 0, iy: 0, x: 0, y: 0, w: 0, h: 0 });
  const [inspect, setInspect] = useState(false);

  const svgRef = useRef();

  const handleMouseDown = (e) => {
    setIsDragged(true);
    setMousePos({ ix: e.offsetX, iy: e.offsetY, x: 0, y: 0, w: 0, h: 0 });

  };
  const handleMouseUp = (e) => {
    setIsDragged(false);
    setMousePos(prev => {
      getInspectedData(prev);
      return { ix: 0, iy: 0, x: 0, y: 0, w: 0, h: 0 };
    });


  };
  const handleMouseMove = (e) => {
    if (isDragged) {
      setMousePos(prev => {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        const finalMousePos = { x: 0, y: 0, w: 0, h: 0 };
        if (currentX < prev.ix) {
          const fx = prev.ix - currentX;
          finalMousePos.w = fx;
          finalMousePos.x = currentX;
        }
        if (currentX > prev.ix) {
          finalMousePos.x = prev.ix;
          finalMousePos.w = currentX - prev.x;
        }
        if (currentY < prev.iy) {
          const fy = prev.iy - currentY;
          finalMousePos.y = currentY;
          finalMousePos.h = fy;
        }
        if (currentY > prev.iy) {
          finalMousePos.y = prev.iy;
          finalMousePos.h = currentY - prev.y;
        }
        return { ...prev, ...finalMousePos };
      });
    }
  };
  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.addEventListener('mousedown', handleMouseDown);
      svgRef.current.addEventListener('mouseup', handleMouseUp);
      svgRef.current.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('mousedown', handleMouseDown);
        svgRef.current.removeEventListener('mouseup', handleMouseUp);
        svgRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [svgRef.current, isDragged]);

  const refinedData = data.filter(d => d[key] !== 0);

  const xScale = d3.scaleLinear()
    .domain(Array.isArray(xAxisRange) ? xAxisRange : [0, refinedData.length - 1])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(yAxisRange)
    .range([height, 0]);

  const invertedYScale = d3.scaleLinear()
    .domain([0, height])
    .range([0, height]);

  const lineGenerator = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d[key]))
    .curve(d3.curveMonotoneX);

  const path = lineGenerator(refinedData);

  const getLine = (val) => d3.line()([[0, yScale(val)], [width, yScale(val)]]);

  const thresholdLines = {
    min: !isNaN(min) ? getLine(min) : null,
    max: !isNaN(max) ? getLine(max) : null,
  };

  const getInspectedData = (pos) => {
    const startX = xScale.invert(pos.x);
    const startY = yScale.invert(pos.y);
    const endX = xScale.invert(pos.x + pos.w);
    const endY = yScale.invert(pos.y + pos.h);
    console.log(refinedData.filter((d, i) => d[key] < startY && d[key] > endY && i > startX && i < endX));
  };


  return (
    <div>
      <button onClick={() => setInspect(!inspect)}>{inspect ? 'uninspect' : 'inspect'}</button>
      <svg ref={svgRef} width={width} height={height}>
        <defs>
          <linearGradient id={`gradient-${key}`} gradientTransform="rotate(90)">
            <stop offset='5%' stopColor={`${color}40`} />
            <stop offset='50%' stopColor={`${color}00`} />
          </linearGradient>
        </defs>
        <rect x={mousePos.x} stroke={color} fill='rgba(0,0,0,0)' strokeDasharray='5 1' y={mousePos.y} width={mousePos.w} height={mousePos.h} />
        <rect x={mousePos.x} fill={color} opacity='0.1' y={mousePos.y} width={mousePos.w} height={mousePos.h} />
        {!inspect && thresholdLines.max && <g>
          <path id={`max-${key}`} strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={thresholdLines.max} />
          <text dy='-10' style={{
            fontSize: '12px',
            fill: '#ccc',
          }}>
            <textPath xlinkHref={`#max-${key}`}>{`maximum ${max}${unit}`}</textPath>
          </text>
        </g>}
        {!inspect && thresholdLines.min && <g onMouseDown={(e) => screeningMode && onDrag(e, 'min')}>
          <path id={`min-${key}`} strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={thresholdLines.min} />
          <text dy='20' style={{
            fontSize: '12px',
            fill: '#ccc',
          }}>
            <textPath xlinkHref={`#min-${key}`}>{`minimum ${min}${unit}`}</textPath>
          </text>
        </g>}
        <path stroke='rbga(255,255,255,0)' fill={`url(#gradient-${key})`} d={`M0,${height} ` + path + ` v${height} L0,${height}`} />
        <path stroke={color} fill='none' strokeWidth={strokeWidth} d={path} />
        {inspect && refinedData.map((d, i) => <circle cx={xScale(i)} cy={yScale(d[key])} r={strokeWidth} fill='white' />)}
      </svg>
    </div>
  );
};

export default StreamlineGraph;
