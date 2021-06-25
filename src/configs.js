import storage from './model/storage';

export const defaultWidgets = [{
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

export const defaultUserStatus = {
  isConnected: false,
  isEmergency: false,
  deviceName: null,
  startTime: null,
};

export const defaultOxyData = {
  spo2: 0,
  heartRate: 0,
  heartGraph: [],
  elapsedTime: '00:00:00',
};

export const defaultVital = new storage(
  process.env.REACT_APP_SERVICE_UUID,
  process.env.REACT_APP_CHT_UUID);

export const initialState = {
  userStatus: defaultUserStatus,
  oxyData: defaultOxyData,
  userVital: defaultVital,
  vitalSnapshot: [],
  device: null,
  oximetry: null,
  rollbackCount: 30,
};
