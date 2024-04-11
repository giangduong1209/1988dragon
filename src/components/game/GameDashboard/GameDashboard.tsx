import React from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { GameDashboardContent } from '../GameDashboardContent';

const GameDashboard = () => {
  return (
    <React.Fragment>
      <GameDashboardContent />
      <DashboardLayout />
    </React.Fragment>
  );
};

export default GameDashboard;
