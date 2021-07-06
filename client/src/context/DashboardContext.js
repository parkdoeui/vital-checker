import React, { createContext, useReducer } from 'react';
import { initialState, defaultOxyData } from '../configs';
import { getSummary } from '../utils';

export const DashboardContext = createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {

    case 'CONNECT': {
      const { device, oximetry } = action.payload;
      const userStatus = {
        ...state.userStatus,
        isConnected: true,
        deviceName: device.name,
        startTime: new Date(),
      };
      return { ...state, userStatus, device, oximetry };
    }

    case 'DISCONNECT': {
      state.device.gatt.disconnect();
      if (state.userStatus.isConnected) {

        const history = {
          runTime: state.oxyData.elapsedTime,
          date: state.userStatus.startTime,
        };
        getSummary(state.userVital.vitalLog);
        state.userVital.updateHistory(history);
        const userStatus = {
          ...state.userStatus,
          isConnected: false,
          deviceName: null,
          startTime: new Date(),
        };
        console.log(state.userVital);
        const oxyData = { ...defaultOxyData };
        return { ...state, userStatus, oxyData };
      }
      return { ...state };
    }

    case 'ALERT': {
      const { isEmergency } = action.payload;
      const userStatus = { ...state.userStatus, isEmergency };
      return { ...state, userStatus };
    }

    case 'RECORD_SNAPSHOT': {
      //rollback count determines how many seconds back
      //the app will trace back oxyData.
      const vitalSnapshot = state.userVital.vitalLog.slice(state.rollbackCount * -1);
      return { ...state, vitalSnapshot };
    }

    case 'RECORD_GRAPH_DATA': {
      const { heartGraph } = action.payload;
      const oxyData = { ...state.oxyData, heartGraph };
      return { ...state, oxyData };
    }

    case 'RECORD_VITAL_DATA': {
      const { spo2, heartRate } = action.payload;
      const oxyData = {
        ...state.oxyData,
        heartRate: heartRate ?? state.oxyData.heartRate,
        spo2: spo2 ?? state.oxyData.spo2,
      };
      return { ...state, oxyData };
    }

    case 'RECORD_ELAPSED_TIME': {
      const { elapsedTime } = action.payload;
      const oxyData = { ...state.oxyData, elapsedTime: elapsedTime.formattedTime, rawTime: elapsedTime.rawTime };
      const testValue = elapsedTime.rawTime - state.oxyData.rawTime;
      console.log(testValue);
      if (testValue > 1100) {
        // debugger;
        console.log(state.userVital);
      }
      state.userVital.updateLog(oxyData);
      return { ...state, oxyData };
    }
  }
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

