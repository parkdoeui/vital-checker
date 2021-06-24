import React, { useState, useEffect, useContext } from 'react';
import TestDashboard from '../view/TestDashboard';
import { checkVitalAnomalies, getTime } from '../utils';
// import vitalHistory from '../model/vitalHistory';
import { DashboardContext } from '../context/Dashboard';
import { defaultOxyData } from '../configs';
const TIME_INTERVAL = 1000;
const signal = [];
const rollbackCount = 30;

// const defaultUserStatus = {
//   isConnected: false,
//   isEmergency: false,
//   deviceName: null,
//   startTime: null,
// };

// const defaultOxyData = {
//   spo2: 0,
//   heartRate: 0,
//   heartGraph: [],
//   elapsedTime: '00:00:00',
// };

// const userVital = new vitalHistory('Do Park',
//   process.env.REACT_APP_SERVICE_UUID,
//   process.env.REACT_APP_CHT_UUID);

const TestDashboardController = () => {

  const { actions, state } = useContext(DashboardContext);
  const { setUserStatus, setOxyData } = actions;
  const { userVital, userStatus } = state;
  const [BLE, setBLE] = useState(null);
  const [vitalSnapshot, setVitalSnapshot] = useState([]);

  useEffect(() => {
    if (userStatus.isConnected && userStatus.startTime) {
      const currentTime = setInterval(() => {

        const elapsedTime = getTime(userStatus.startTime);

        setOxyData(prev => {
          userVital.add(prev);
          return { ...prev, elapsedTime: elapsedTime };
        });

      }, TIME_INTERVAL);

      return () => {
        clearInterval(currentTime);
      };
    }

  }, [userStatus.isConnected, userStatus.startTime]);

  useEffect(() => {
    const newSnapshot = userVital.storage.slice(rollbackCount * -1);
    setVitalSnapshot(newSnapshot);
  },[JSON.stringify(userVital.storage)]);


  useEffect(() => {
    if (vitalSnapshot.length >= rollbackCount) {
      const isUserInComa = checkVitalAnomalies(vitalSnapshot);
      setUserStatus(prev => ({ ...prev, isEmergency: isUserInComa }));
    }
  }, [JSON.stringify(vitalSnapshot)]);

  const onConnected = async (device) => {
    setUserStatus(prev => ({
      ...prev,
      isConnected: true,
      deviceName: device.name,
      startTime: new Date(),
    }));
  };

  const onDisconnect = () => {
    if (BLE) {
      BLE.gatt.disconnect();
    }
    setUserStatus(prev =>
      ({
        ...prev,
        isConnected: false,
        deviceName: null,
        startTime: null,
      }));
    setOxyData(defaultOxyData);
    console.log('vital history: ', userVital);
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
          //this will potentially remove useEffect get time
          setOxyData(prev => ({ ...prev, heartGraph: signal.slice(5, 10) }));
        }
        if (identifier === VITAL) {
          setOxyData(prev => ({ ...prev, spo2: signal[5], heartRate: signal[6] }));
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
      setBLE(device);
      onConnected(device);
      device.addEventListener('gattserverdisconnected', onDisconnect);
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHT_UUID);
      const oximetry = await characteristic.startNotifications();
      oximetry.addEventListener('characteristicvaluechanged', handleNotifications);

    } catch (error) {

      alert(error);

    }
  };

  return <TestDashboard onDisconnect={onDisconnect} onSubscribe={onSubscribe}/>;
};

export default TestDashboardController;
