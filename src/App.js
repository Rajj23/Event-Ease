import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EventProvider } from './EventContext';
import NavbarComponent from './components/NavbarComponent';
import HomePage from './components/HomePage';
import CreateEvent from './components/CreateEvent';
import VendorList from './components/VendorList';
import Vendors from './components/Vendors';
import Inspiration from './components/Inspiration';
import InspirationDetails from './components/InspirationDetails';
import Dashboard from './components/Dashboard';
import EditEvent from './components/EditEvent';
import EventDetails from './components/EventDetails';
import Checklist from './components/Checklist';
import VendorRegister from './components/VendorRegister';
import EInvite from './components/EInvite';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <EventProvider>
      <Router>
        <div className="app-container">
          <NavbarComponent />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/event/:id/vendors" element={<VendorList />} />
              <Route path="/inspiration" element={<Inspiration />} />
              <Route path="/inspiration/:id" element={<InspirationDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/event/:id/edit" element={<EditEvent />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/einvite" element={<EInvite />} />
              <Route path="/register-vendor" element={<VendorRegister />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </EventProvider>
  );
}

export default App;