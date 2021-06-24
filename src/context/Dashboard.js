import React, { createContext, useReducer } from 'react';
import { defaultUserStatus, defaultOxyData, defaultVital } from '../configs';

const rollbackCount = 30;

const initialState = {
  userStatus: defaultUserStatus,
  oxyData: defaultOxyData,
  userVital: defaultVital,
  vitalSnapshot: [],
  device: null,
};

export const DashboardContext = createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {

    case 'CONNECT': {
      const { device } = action.payload;
      const userStatus = {
        ...state.userStatus,
        isConnected: true,
        deviceName: device.name,
        startTime: new Date(),
      };
      return { ...state, userStatus, device };
    }

    case 'DISCONNECT': {
      state.device.gatt.disconnect();
      const userStatus = {
        ...state.userStatus,
        isConnected: false,
        deviceName: null,
        startTime: new Date(),
      };

      const oxyData = { ...defaultOxyData };
      return { ...state, userStatus, oxyData };
    }

    case 'ALERT': {
      const { isEmergency } = action.payload;
      const userStatus = { ...state.userStatus, isEmergency };
      return { ...state, userStatus };
    }

    case 'RECORD_SNAPSHOT': {
      const vitalSnapshot = state.userVital.storage.slice(rollbackCount * -1);
      return { ...state, vitalSnapshot };
    }

    case 'RECORD_GRAPH_DATA': {
      const { heartGraph } = action.payload;
      const oxyData = { ...state.oxyData, heartGraph };
      return { ...state, oxyData };
    }

    case 'RECORD_VITAL_DATA': {
      const { spo2, heartRate } = action.payload;
      const oxyData = { ...state.oxyData, spo2, heartRate };
      return { ...state, oxyData };
    }

    case 'RECORD_ELAPSED_TIME': {
      const { elapsedTime } = action.payload;
      const oxyData = { ...state.oxyData, elapsedTime };
      state.userVital.add(oxyData);
      return { ...state, oxyData };
    }
  }
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

