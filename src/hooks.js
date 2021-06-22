import { useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export const useResizeObserver = (callback, element) => {

  const observer = useRef(null);

  useEffect(() => {
    const resizeObserverOrPolyfill = ResizeObserver;
    observer.current = new resizeObserverOrPolyfill(callback);
    observer.current.observe(element.current);
    return () => {
      observer.current.unobserve(element.current);
    };
  }, [element.current]);
};
