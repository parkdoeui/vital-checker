import React, { useEffect, useContext } from 'react';
import Dashboard from '../view/Dashboard';
import { checkVitalAnomalies, getTime } from '../utils';
// import vitalHistory from '../model/vitalHistory';
import { DashboardContext } from '../context/DashboardContext';
const TIME_INTERVAL = 1000;
const signal = [];
const rollbackCount = 30;

const DashboardController = () => {

  const { dispatch, state } = useContext(DashboardContext);
  const { userStatus, userVital, vitalSnapshot } = state;

  useEffect(() => {
    if (userStatus.isConnected && userStatus.startTime) {
      const currentTime = setInterval(() => {
        const elapsedTime = getTime(userStatus.startTime);
        dispatch({ type: 'RECORD_ELAPSED_TIME', payload: { elapsedTime } });
      }, TIME_INTERVAL);

      return () => {
        clearInterval(currentTime);
      };
    }

  }, [userStatus.isConnected, userStatus.startTime]);

  useEffect(() => {
    dispatch({ type: 'RECORD_SNAPSHOT' });
  },[JSON.stringify(userVital.storage)]);


  useEffect(() => {
    if (vitalSnapshot.length >= rollbackCount) {
      const isEmergency = checkVitalAnomalies(vitalSnapshot);
      dispatch({ type: 'ALERT', payload: { isEmergency } });
    }
  }, [JSON.stringify(vitalSnapshot)]);

  const onConnected = async (device) => {
    dispatch({ type: 'CONNECT', payload: { device } });
  };

  //This belongs to Model
  const handleNotifications = (e) => {
    const value = e.target.value;
    const BREAK_POINT = 170;
    const GRAPH = 7;
    const VITAL = 8;
    for (let i = 0; i < value.byteLength; i++) {
      const count = value.getUint8(i);
      if (count === BREAK_POINT && signal.length > 0) {
        const identifier = signal[3];
        if (identifier === GRAPH) {
          const heartGraph = signal.slice(5, 10);
          dispatch({ type: 'RECORD_GRAPH_DATA', payload: { heartGraph } });

        }
        if (identifier === VITAL) {
          const spo2 = signal[5];
          const heartRate = signal[6];
          dispatch({ type: 'RECORD_VITAL_DATA', payload: { spo2, heartRate } });
        }
        signal.length = 0;
      }
      signal.push(count);
    }
  };

  const onSubscribe = async () => {
    const SERVICE_UUID = userVital.serviceUUID;
    const CHT_UUID = userVital.chtUUID;
    const CONFIG = {
      filters: [{
        services: [SERVICE_UUID],
      }],
    };
    try {
      const device = await navigator.bluetooth.requestDevice(CONFIG);
      onConnected(device);
      device.addEventListener('gattserverdisconnected', () => dispatch({ type:'DISCONNECT' }));
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHT_UUID);
      const oximetry = await characteristic.startNotifications();
      oximetry.addEventListener('characteristicvaluechanged', handleNotifications);
    } catch (error) {
      alert(error);
    }
  };

  return <Dashboard onSubscribe={onSubscribe}/>;
};

export default DashboardController;
