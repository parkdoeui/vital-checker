import React from 'react';
import { DashboardProvider } from './context/Dashboard';
import TestDashboardController from './controller/TestDashboardController';

const App = () => {
  return (
    <DashboardProvider>
      <TestDashboardController/>
    </DashboardProvider>
  );
};


export default App;


