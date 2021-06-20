import React, { useEffect, useState } from 'react';
import Typography from '../components/Typography';
import Widget from '../components/Widget';
import emergencyAudio from '../assets/warning.ogg';

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

const MainTest = ({ onSubscribe, setUserStatus, userStatus, oxyData }) => {

  const { isConnected, isEmergency, deviceName, startTime } = userStatus;
  console.log(isEmergency);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (isEmergency) {
      setOpenModal(true);
    }
  },[isEmergency]);

  const onModalClose = () => {
    setUserStatus(prev => ({ ...prev, isEmergency: false }));
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
              <Typography variant='subtitle'>The user's vital sign is stopped. Call 911 if the user is in coma.<br />Do CPR until paramedics arrive.</Typography>
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
        {isConnected ? <p className='status-bar__message body'>Device connected</p>: <button className='btn__connect' onClick={onSubscribe}>Connect</button>}
      </div>
      <div className='widget__container'>
        {widgets.map(({ accessor, unit, description }, idx) => <Widget key={idx} value={oxyData[accessor]} unit={unit} description={description} />)}
      </div>
    </>
  );
};


export default MainTest;
