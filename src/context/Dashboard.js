import React, { createContext, useState } from 'react';
import { defaultUserStatus, defaultOxyData, defaultVital } from '../configs';

export const DashboardContext = createContext({
  state: {
    userStatus: null,
    oxyData: null,
    userVital: null,
  },
  actions: {
    setUserStatus: () => {},
    setOxyData: () => {},
  },
});

export const DashboardProvider = ({ children }) => {

  const [userStatus, setUserStatus] = useState(defaultUserStatus);
  const [oxyData, setOxyData] = useState(defaultOxyData);

  const value = {
    state: {
      userStatus,
      oxyData,
      userVital: defaultVital,
    },
    actions: {
      setUserStatus,
      setOxyData,
    },
  };
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

