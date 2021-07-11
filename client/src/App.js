import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import DashboardController from './controller/DashboardController';

const App = () => {
  return (
    <DashboardProvider>
      <DashboardController/>
    </DashboardProvider>
  );
};


export default App;


