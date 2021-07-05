import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import Typography from './Typography';
import { getAverage } from '../utils';
import '../styles.css';
//ix = initial X, iy = initial Y
const mouseConfig = {
  position: { ix: 0, iy: 0, x: 0, y: 0, w: 0, h: 0 },
  isDragged: false,
};

const StreamlineGraph = ({ data, width, height, config }) => {

  const { key, xAxisRange, yAxisRange, style, threshold, screeningMode } = config;
  const { color, strokeWidth } = style;
  const { max, min, unit } = threshold;
  const [mousePos, setMousePos] = useState(mouseConfig);
  const [inspector, setInspector] = useState(false);
  const [tooltip, setTooltip] = useState({ isOpen: false, values: null });
  const svgRef = useRef();

  const handleMouseDown = (e) => {
    setMousePos({ isDragged: true, position: { ix: e.offsetX, iy: e.offsetY, x: 0, y: 0, w: 0, h: 0 } });
  };
  const handleMouseUp = (e) => {
    setMousePos(prev => {
      if (!tooltip.isOpen) {
        const inspectedData = getInspectedData(prev.position).map(d => d[key]);
        const tooltipValues = inspectedData.length > 0
          ? {
            min: Math.min(...inspectedData) ?? 0,
            max: Math.max(...inspectedData) ?? 0,
            avg: getAverage(inspectedData) ?? 0,
            volume: (inspectedData.length / refinedData.length * 100).toFixed(2) ?? 0,
          } : null;
        setTooltip({ values: tooltipValues, position: prev.position, isOpen: true });
      }
      return { isDragged: false, position: { ix: 0, iy: 0, x: 0, y: 0, w: 0, h: 0 } };
    });
  };

  const tooltipOnClose = () => {
    setTooltip({ values: null, isOpen: false });
  };

  const handleMouseMove = (e) => {
    if (mousePos.isDragged) {
      setMousePos(prev => {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        const finalMousePos = { x: 0, y: 0, w: 0, h: 0 };
        if (currentX < prev.position.ix) {
          const fx = prev.position.ix - currentX;
          finalMousePos.w = fx;
          finalMousePos.x = currentX;
        }
        if (currentX > prev.position.ix) {
          finalMousePos.x = prev.position.ix;
          finalMousePos.w = currentX - prev.position.x;
        }
        if (currentY < prev.position.iy) {
          const fy = prev.position.iy - currentY;
          finalMousePos.y = currentY;
          finalMousePos.h = fy;
        }
        if (currentY > prev.position.iy) {
          finalMousePos.y = prev.position.iy;
          finalMousePos.h = currentY - prev.position.y;
        }

        return { ...prev, position: { ...prev.position, ...finalMousePos } };
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
  }, [svgRef.current, mousePos.isDragged]);

  const refinedData = data.filter(d => d[key] !== 0);

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
    return refinedData.filter((d, i) => d[key] < startY && d[key] > endY && i > startX && i < endX);

  };

  return (
    <div style={{ position: 'relative' }}>
      {tooltip.isOpen && <div className='streamline__tooltip' style={{ position: 'absolute', left: tooltip.position.x, top: tooltip.position.y }}>
        {tooltip.values !== null ? <>
          <Typography variant='body-bold'>Inspected data</Typography>
          <Typography variant='body'>{`Max: ${tooltip.values.max} ${unit}`}</Typography>
          <Typography variant='body'>{`Min: ${tooltip.values.min} ${unit}`}</Typography>
          <Typography variant='body'>{`Average: ${tooltip.values.avg} ${unit}`}</Typography>
          <Typography variant='body'>{`Volume: ${tooltip.values.volume} %`}</Typography>
        </>
          : <Typography>Data not available</Typography>}
        <button className='btn__tooltip--close' onClick={tooltipOnClose}>Close</button>
      </div>}
      <button onClick={() => setInspector(!inspector)}>{inspector ? 'Uninspect' : 'Inspect'}</button>
      <svg ref={svgRef} width={width} height={height}>
        <defs>
          <linearGradient id={`gradient-${key}`} gradientTransform="rotate(90)">
            <stop offset='5%' stopColor={`${color}40`} />
            <stop offset='50%' stopColor={`${color}00`} />
          </linearGradient>
        </defs>
        <rect x={mousePos.position.x} stroke={color} fill='rgba(0,0,0,0)' strokeDasharray='5 1' y={mousePos.position.y} width={mousePos.position.w} height={mousePos.position.h} />
        <rect x={mousePos.position.x} fill={color} opacity='0.1' y={mousePos.position.y} width={mousePos.position.w} height={mousePos.position.h} />
        {!inspector && thresholdLines.max && <g>
          <path id={`max-${key}`} strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={thresholdLines.max} />
          <text dy='-10' style={{
            fontSize: '12px',
            fill: '#ccc',
          }}>
            <textPath xlinkHref={`#max-${key}`}>{`maximum ${max}${unit}`}</textPath>
          </text>
        </g>}
        {!inspector && thresholdLines.min && <g>
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
        {inspector && refinedData.map((d, i) => <circle key={i} cx={xScale(i)} cy={yScale(d[key])} r={strokeWidth} fill='white' />)}
      </svg>
    </div>
  );
};

export default StreamlineGraph;
