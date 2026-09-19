import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CommandCentre from './pages/CommandCentre';
import CaseList from './pages/CaseList';
import CaseDetail from './pages/CaseDetail';
import Alerts from './pages/Alerts';
import Outcomes from './pages/Outcomes';
import Audit from './pages/Audit';
import Complaint from './pages/Complaint';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/command-centre" element={<CommandCentre />} />
        <Route path="/cases" element={<CaseList />} />
        <Route path="/case-detail" element={<CaseDetail />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/outcomes" element={<Outcomes />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/complaint" element={<Complaint />} />
      </Routes>
    </Router>
  );
}