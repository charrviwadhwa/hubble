import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard'; // Import your new Dashboard
import ProtectedRoute from './components/ProtectedRoute';
import MySocieties from './pages/MySocieties';
import CreateSociety from './pages/CreateSociety';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CreateEvent from './pages/CreateEvent';
import EventDescription from './pages/EventDescription';
import EditSociety from './pages/EditSociety';
import EditEvent from './pages/EditEvent';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Event Feed */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-societies"
          element={
            <ProtectedRoute>
              <MySocieties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-society"
          element={
            <ProtectedRoute>
              <CreateSociety />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDescription />
            </ProtectedRoute>
          }
        />
        <Route path="/settings/societies/:id" element={<EditSociety />} />
        <Route path="/settings/events/:id" element={<EditEvent />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Protected Personal Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;