import React, { useEffect, useState } from 'react';
import Typography from '../components/Typography';
import Widget from '../components/Widget';
import emergencyAudio from '../assets/warning.ogg';

const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const CHT_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const CONFIG = {
  filters: [{
    services: [SERVICE_UUID],
  }],
};
const VITAL = 8;
const GRAPH = 7;
const TIME_INTERVAL = 1000;
const vitalHistory = [];
const signal = [];
const rollbackNum = 5;

const getTime = (startTime) => {
  const endTime = new Date();
  const elapsedTime = endTime - startTime;
  const s = parseInt(elapsedTime / 1000) % 60;
  const m = parseInt(elapsedTime / 60000) % 60;
  const h = parseInt(elapsedTime / 3600000) % 24;
  (elapsedTime);
  (m, h);
  const prefix = '0';
  const time = `${h < 10 ? prefix + h : h}:${m < 10 ? prefix + m : m}:${s < 10 ? prefix + s : s}`;
  return time;

};

const widgets = [{
  accessor: 'heartRate',
  unit: 'bpm',
  description: 'Heart Rate 💖',
},
{
  accessor: 'spo2',
  unit: '%',
  description: 'SPO2 💨',
},
{
  accessor: 'elapsedTime',
  unit: null,
  description: 'Elapsed Time 🕒',
}];

const audio = new Audio(emergencyAudio);
const defaultOxyData = { spo2: 0, heartRate: 0, heartGraph: [], elapsedTime: '00:00:00' };
const Main = () => {
  const [isEmergency, setIsEmergency] = useState(false);
  const [oxyData, setOxyData] = useState(defaultOxyData);
  const [timer, setTimer] = useState(null);
  // const [elapsedTime, setElapsedTime] = useState('00:00:00');
  // const [vitals, setVitals] = useState({spo2: 0, heartRate: 0, graph: []})
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState('No devices are connected X');
  const [openModal, setOpenModal] = useState(false);

  const handleNotifications = (e) => {
    const value = e.target.value;
    const breakPoint = 170;
    for (let i = 0; i < value.byteLength; i++) {
      const count = value.getUint8(i);
      if (count === breakPoint && signal.length > 0) {
        const identifier = signal[3];
        if (identifier === GRAPH) {
          setOxyData(prev => ({ ...prev, heartGraph: signal.slice(5, 10) }));
        }

        if (identifier === VITAL) {
          setOxyData(prev => ({ ...prev, spo2: signal[5], heartRate: signal[6] }));
        }
        // storage.push(signal);
        signal.length = 0;
      }
      signal.push(count);
    }
  };

  const onDisconnected = ( _, device) => {
    console.log(device);
    setIsConnected(false);
    setDeviceName('No devices are connected');
    setTimer(false);
    setOxyData(defaultOxyData);
  };

  const subscribeBLE = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice(CONFIG);
      setIsConnected(true);
      setDeviceName(device.name);
      setTimer(new Date());
      device.addEventListener('gattserverdisconnected', () => onDisconnected(null));
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHT_UUID);
      const oximetry = await characteristic.startNotifications();
      oximetry.addEventListener('characteristicvaluechanged', handleNotifications);

    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (isConnected && timer !== null) {

      const currentTime = setInterval(() => {
        const elapsedTime = getTime(timer);
        setOxyData(prev => {
          vitalHistory.push(prev);
          return { ...prev, elapsedTime: elapsedTime };
        });
      }, TIME_INTERVAL);
      return () => {
        clearInterval(currentTime);
      };
    }
  }, [isConnected, timer]);

  const checkVitalAnormalies = () => {
    const testingRange = [...vitalHistory];
    const lastVital = testingRange.pop();

    const test1 = testingRange.every(({ heartRate, spo2 }) =>
      heartRate === lastVital.heartRate &&
          spo2 === lastVital.spo2);

    const test2 = testingRange.some(({ heartRate, spo2 }) => heartRate > 140 || heartRate < 40 || spo2 < 80);
    console.table(test1, test2);
    return test1 || test2;
  };

  useEffect(() => {
    const len = vitalHistory.length;
    if (len > rollbackNum) {
      const isUserInComa = checkVitalAnormalies();
      setIsEmergency(isUserInComa);
      vitalHistory.shift();
      console.table(vitalHistory);
    }
  }, [JSON.stringify(vitalHistory)]);



  useEffect(() => {
    if (isEmergency) {
      setOpenModal(true);
    }
  },[isEmergency]);

  const onModalClose = () => {
    setIsEmergency(false);
    setOpenModal(false);
  };

  if (openModal) {
    audio.play();
  }

  return (
    <>
      {openModal && <div className='modal__background'>
        <div className='modal__container'>
          <div className='modal'>
            <div>
              <Typography variant='title'>Emergency</Typography>
              <Typography variant='title'>응급상황</Typography>
            </div>
            <div>
              <Typography variant='subtitle'>The vital sign of the user is stopped. Call 911 if the user is in coma.<br />Do CPR until paramedics arrive.</Typography>
              <Typography variant='subtitle'>착용자의 바이탈 사인이 멈췄습니다. 의식이 없다면 911에 연락하세요.<br />구급대원이 도착할 때 까지 심폐소생술을 실행하세요.</Typography>
            </div>
            <div>
              <button className='btn__primary' onClick={()=>onModalClose()}>착용자는 괜찮습니다. 알람을 끕니다.</button>
            </div>
          </div>
        </div>
      </div>}
      <div className='status-bar'>
        <div className={isConnected ? 'status-bar__prompt--success' : 'status-bar__prompt--warning'}>
          <Typography variant='body'>{deviceName}</Typography>
        </div>
        {isConnected ? <p className='status-bar__message body'>Device connected</p>: <button className='btn__connect' onClick={subscribeBLE}>Connect</button>}
      </div>
      <div className='widget__container'>
        {widgets.map(({ accessor, unit, description }, idx) => <Widget key={idx} value={oxyData[accessor]} unit={unit} description={description} />)}
      </div>
    </>
  );
};


export default Main;
