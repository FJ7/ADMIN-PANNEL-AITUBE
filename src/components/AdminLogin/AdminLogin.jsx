// src/components/AdminLogin/AdminLogin.js
import React, { useState } from 'react';
import { Client, Account } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: '669f7ccb001ee4eee52f',
};

const client = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
const account = new Account(client);

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await account.createEmailPasswordSession(email, password);
      onLogin(true);
      navigate('/dashboard');
    } catch (error) {
      console.log(error)
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default AdminLogin;
