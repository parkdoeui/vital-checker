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

export const defaultHistoryWidgets = [{
  accessor: 'heartRate',
  unit: 'bpm',
  description: 'Average Heart Rate 💖',
},
{
  accessor: 'spo2',
  unit: '%',
  description: 'Average SPO2 💨',
}];

export const defaultLineGraphs = [{
  title: 'Heart rate history',
  height: 300,
  config: {
    key: 'heartRate',
    xAxisRange: 'auto',
    yAxisRange: [0, 160],
    style: {
      color: '#fa0000',
      strokeWidth: 5,
    },
    threshold: {
      max: 130,
      min: 30,
      unit: 'bpm',
    },
  },
}, {
  title: 'Sp02 history',
  height: 300,
  config: {
    key: 'spo2',
    xAxisRange: 'auto',
    yAxisRange: [70, 110],
    style: {
      color: '#0075FF',
      strokeWidth: 5,
    },
    threshold: {
      max: null,
      min: 80,
      unit: '%',
    },
  },
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

export const defaultTabslist = [{
  name: 'Dashboard 📈',
  id: 'dashboard',
},
{
  name: 'History 📘',
  id: 'history',
},
{
  name: 'Settings ⚙️',
  id: 'settings',
}];

export const initialState = {
  userStatus: defaultUserStatus,
  oxyData: defaultOxyData,
  userVital: defaultVital,
  vitalSnapshot: [],
  device: null,
  oximetry: null,
  rollbackCount: 30,
};
