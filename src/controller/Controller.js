import React, { useState, useEffect } from 'react';
import MainTest from '../view/MainTest';

const TIME_INTERVAL = 1000;
const signal = [];
const rollbackCount = 30;

const defaultUserStatus = {
  isConnected: false,
  isEmergency: false,
  deviceName: null,
  startTime: null,
};

const defaultOxyData = {
  spo2: 0,
  heartRate: 0,
  heartGraph: [],
  elapsedTime: '00:00:00',
};

class vitalHistory {
  constructor(userID) {
    this.userID = userID;
    this.storage = [];
  }

  add(data) {
    this.storage.push(data);
  }

  get() {
    return this.storage;
  }
}

const userVital = new vitalHistory('Do Park');

const getTime = (startTime) => {
  const endTime = new Date();
  const elapsedTime = endTime - startTime;
  const s = parseInt(elapsedTime / 1000) % 60;
  const m = parseInt(elapsedTime / 60000) % 60;
  const h = parseInt(elapsedTime / 3600000) % 24;

  const prefix = '0';
  const time = `${h < 10 ? prefix + h : h}:${m < 10 ? prefix + m : m}:${s < 10 ? prefix + s : s}`;
  return time;

};

const checkVitalAnomalies = (vitalSnapshot) => {
  const HR_MAX = 140;
  const HR_MIN = 40;
  const SPO2_MIN = 80;
  const testRange = [...vitalSnapshot];
  const lastVital = testRange.pop();

  const test1 = testRange.every(({ heartRate, spo2 }) =>
    heartRate === lastVital.heartRate &&
        spo2 === lastVital.spo2);

  const test2 = testRange.some(({ heartRate, spo2 }) => heartRate > HR_MAX || heartRate < HR_MIN || spo2 < SPO2_MIN);

  return test1 || test2;
};

const Controller = () => {

  const [userStatus, setUserStatus] = useState(defaultUserStatus);
  const [oxyData, setOxyData] = useState(defaultOxyData);
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

  const onDisconnected = () => {
    setUserStatus(prev =>
      ({
        ...prev,
        isConnected: false,
        deviceName: null,
        startTime: null,
      }));
    setOxyData(defaultOxyData);
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
    const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const CHT_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
    const CONFIG = {
      filters: [{
        services: [SERVICE_UUID],
      }],
    };

    try {

      const device = await navigator.bluetooth.requestDevice(CONFIG);
      onConnected(device);
      device.addEventListener('gattserverdisconnected', onDisconnected);
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHT_UUID);
      const oximetry = await characteristic.startNotifications();
      oximetry.addEventListener('characteristicvaluechanged', handleNotifications);

    } catch (error) {

      alert(error);

    }
  };



  return <MainTest setUserStatus={setUserStatus} onSubscribe={onSubscribe} userStatus={userStatus} oxyData={oxyData}/>;
};

export default Controller;
