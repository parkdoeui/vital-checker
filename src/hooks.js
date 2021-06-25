import { useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export const useResizeObserver = (callback, element) => {

  const observer = useRef(null);

  useEffect(() => {
    if (element.current) {
      const resizeObserverOrPolyfill = ResizeObserver;
      observer.current = new resizeObserverOrPolyfill(callback);
      observer.current.observe(element.current);
    }

  }, [element.current]);
};
