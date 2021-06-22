import React, { useRef, useEffect, useState } from 'react';
import Typography from '../components/Typography';
import Widget from '../components/Widget';
import emergencyAudio from '../assets/warning.ogg';
import LineGraph from '../components/LineGraph';
const COOLDOWN_TIME = 10000;

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

const Dashboard = ({ userVital, onSubscribe, setUserStatus, userStatus, oxyData }) => {

  const { isConnected, isEmergency, deviceName } = userStatus;
  const [openModal, setOpenModal] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const serviceRef = useRef(null);
  const chtRef = useRef(null);
  useEffect(() => {
    if (isEmergency && !isCoolingDown) {
      setOpenModal(true);
    }
  }, [isEmergency, isCoolingDown]);

  useEffect(() => {
    if (isCoolingDown) {
      const coolDownInterval = setInterval(() => {
        setIsCoolingDown(false);
      }, COOLDOWN_TIME);

      return () => {
        clearInterval(coolDownInterval);
      };
    }
  }, [isCoolingDown]);

  const onModalClose = () => {
    setUserStatus(prev => ({ ...prev, isEmergency: false }));
    setOpenModal(false);
    setIsCoolingDown(true);
  };

  if (openModal) {
    audio.play();
  }

  const onConnect = () => {
    if (serviceRef.current !== null && chtRef.current !== null) {
      userVital.addUUIDs(serviceRef.current.value, chtRef.current.value);
    }
    onSubscribe();
  };

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
              <Typography variant='subtitle'>The user&#39;s vital sign is stopped. Call 911 if the user is in coma.<br />Do CPR until paramedics arrive.</Typography>
              <Typography variant='subtitle'>착용자의 바이탈 사인이 멈췄습니다. 의식이 없다면 911에 연락하세요.<br />구급대원이 도착할 때 까지 심폐소생술을 해주세요.</Typography>
            </div>
            <div>
              <button className='btn__primary' onClick={()=>onModalClose()}>착용자는 괜찮습니다. 알람을 끕니다.</button>
            </div>
          </div>
        </div>
      </div>}
      <div className='status-bar'>
        <div className={isConnected ? 'status-bar__prompt--success' : 'status-bar__prompt--warning'}>
          <Typography variant='body'>{deviceName || 'Device is not connected'}</Typography>
        </div>
        <div className='status-bar__inputs'>
          <form>
            {!userVital.serviceUUID && <input ref={serviceRef} placeholder='service UUID' type='text' />}
            {!userVital.chtUUID && <input ref={chtRef} placeholder='characteristic UUID' type='text' />}
          </form>
        </div>
        <div className='status-bar__buttonContainer'>
          {isConnected ? <p className='status-bar__message body'>Device connected</p>: <button className='btn__connect' onClick={()=>onConnect()}>Connect</button>}
        </div>
      </div>
      <div className='widget__container'>
        {widgets.map(({ accessor, unit, description }, idx) => <Widget key={idx} value={oxyData[accessor]} unit={unit} description={description} />)}
        <div className='widget--heart-graph'>
          <Typography variant='subtitle2'>Heart rate history</Typography>
          <LineGraph
            width={1453}
            height={300}
            data={userVital.storage}
            config={{
              key: 'heartRate',
              xAxisRange: 'auto',
              yAxisRange: [0, 160],
              style: {
                color: '#fa0000',
                strokeWidth: 5,
              },
            }} />
        </div>
      </div>
    </>
  );
};


export default Dashboard;
