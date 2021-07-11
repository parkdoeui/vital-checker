import React, { useState, useRef } from 'react';
import { useResizeObserver } from '../hooks';

const ParentSize = ({ children }) => {
  const divRef = useRef();
  const [parentWidth, setParentWidth] = useState();

  const onResize = () => {
    if (divRef.current) {
      const parentDiv = divRef.current.parentElement;
      const padding = getComputedStyle(parentDiv).padding;
      setParentWidth(parentDiv.clientWidth - parseInt(padding) * 2);
    }
  };
  useResizeObserver(onResize, divRef);
  return (
    <div ref={divRef}>
      {children(parentWidth)}
    </div>
  );
};

export default ParentSize;
