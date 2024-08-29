// src/App.js
import React, { useState } from 'react';
import { Client, Databases } from 'appwrite';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminDashboard from './components/AdminLogin/AdminDashboard';

import './App.css';

const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: '669f7ccb001ee4eee52f',
  databaseId: '669f83c50009eaba4c4f',
  userCollectionId: '669f841a002339570792',
  videoCollectionId: '669f846d0024f4d446cf',
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin onLogin={setIsLoggedIn} />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <AdminDashboard /> : <AdminLogin onLogin={setIsLoggedIn} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
