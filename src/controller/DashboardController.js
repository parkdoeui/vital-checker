import React, { useEffect, useContext } from 'react';
import Dashboard from '../view/Dashboard';
import { checkVitalAnomalies, getTime } from '../utils';
import { DashboardContext } from '../context/DashboardContext';

const timeInterval = 1000;
const flags = {
  breakPoint: 170,
  graph: 7,
  vital: 8,
};
const DashboardController = () => {

  const { dispatch, state } = useContext(DashboardContext);
  const { oximetry, userStatus, userVital, vitalSnapshot, rollbackCount, device } = state;
  const signal = [];

  useEffect(() => {
    if (device) {
      device.addEventListener('gattserverdisconnected', onDisconnect);
    }
    return () => {
      if (device) {
        device.removeEventListener('gattserverdisconnected', onDisconnect);
      }
    };
  }, [device]);

  useEffect(() => {
    if (oximetry) {
      oximetry.addEventListener('characteristicvaluechanged', handleNotifications);
    }
    return () => {
      if (oximetry) {
        oximetry.removeEventListener('characteristicvaluechanged', handleNotifications);
      }
    };
  }, [oximetry]);

  useEffect(() => {
    if (userStatus.isConnected && userStatus.startTime) {
      const currentTime = setInterval(() => {
        const elapsedTime = getTime(userStatus.startTime);
        dispatch({ type: 'RECORD_ELAPSED_TIME', payload: { elapsedTime } });
      }, timeInterval);

      return () => {
        clearInterval(currentTime);
      };
    }

  }, [userStatus.isConnected, userStatus.startTime]);

  useEffect(() => {
    dispatch({ type: 'RECORD_SNAPSHOT' });
  }, [userVital.vitalLog.length]);


  useEffect(() => {
    if (vitalSnapshot.length >= rollbackCount) {
      const isEmergency = checkVitalAnomalies(vitalSnapshot);
      dispatch({ type: 'ALERT', payload: { isEmergency } });
    }
  }, [JSON.stringify(vitalSnapshot)]);

  const onConnected = (device, oximetry) => {
    dispatch({ type: 'CONNECT', payload: { device, oximetry } });
  };

  const onDisconnect = () => {
    dispatch({ type: 'DISCONNECT' });
    console.table(state.userVital.history);
  };

  //This belongs to Model
  const handleNotifications = (e) => {
    const value = e.target.value;
    const { graph, vital, breakPoint } = flags;

    for (let i = 0; i < value.byteLength; i++) {
      const count = value.getUint8(i);
      if (count === breakPoint && signal.length > 0) {
        const identifier = signal[3];
        if (identifier === graph) {
          const heartGraph = signal.slice(5, 10);
          dispatch({ type: 'RECORD_GRAPH_DATA', payload: { heartGraph } });

        }
        if (identifier === vital) {
          const spo2 = null || signal[5];
          const heartRate = null || signal[6];
          dispatch({ type: 'RECORD_VITAL_DATA', payload: { spo2, heartRate } });
        }
        signal.length = 0;
      }
      signal.push(count);
    }
  };



  const onSubscribe = async () => {
    const serviceUUID = userVital.serviceUUID;
    const chtUUID = userVital.chtUUID;
    const bluetoothConfig = {
      filters: [{
        services: [serviceUUID],
      }],
    };
    try {
      const device = await navigator.bluetooth.requestDevice(bluetoothConfig);
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceUUID);
      const characteristic = await service.getCharacteristic(chtUUID);
      const oximetry = await characteristic.startNotifications();
      // oximetry.addEventListener('characteristicvaluechanged', handleNotifications);
      onConnected(device, oximetry);
    } catch (error) {
      alert(error);
    }
  };

  return <Dashboard onDisconnect={onDisconnect} onSubscribe={onSubscribe} />;
};

export default DashboardController;
