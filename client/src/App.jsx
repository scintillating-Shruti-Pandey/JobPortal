import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import JobsPage from './pages/JobsPage/JobsPage';
import JobDetailPage from './pages/JobDetailPage/JobDetailPage';
import CompaniesPage from './pages/CompaniesPage/CompaniesPage';
import AuthPage from './pages/AuthPage/AuthPage';
import SeekerDashboard from './pages/SeekerDashboard/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard/EmployerDashboard';
import PostJobPage from './pages/PostJobPage/PostJobPage';
import ProtectedRoute from './components/ProtectedRoute';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Seeker Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['seeker']} />}>
                <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
              </Route>

              {/* Employer Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                <Route path="/post-job" element={<PostJobPage />} />
              </Route>
            </Routes>
          </main>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                borderRadius: 'var(--radius-full)',
                padding: '12px 24px',
              },
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;