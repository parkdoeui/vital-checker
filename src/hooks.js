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

// export const useDevice = (config) => {

//   const [device, setDevice] = useState(null);

//   const getDevice = async () => {
//     device = await navigator.bluetooth.requestDevice(CONFIG);
//     setDevice(device);
//   };

//   useEffect(async () => {
//     if (navigator.bluetooth) {
//       getDevice();
//     }
//   }, []);
//   return device;
// };
