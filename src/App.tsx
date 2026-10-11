/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { SpaceUploadPage } from './pages/SpaceUploadPage';
import { DashboardPage } from './pages/DashboardPage';
import { MaintenancePage } from './pages/MaintenancePage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/questionnaire" element={<QuestionnairePage />} />
              <Route path="/upload" element={<SpaceUploadPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <DisclaimerBanner />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
