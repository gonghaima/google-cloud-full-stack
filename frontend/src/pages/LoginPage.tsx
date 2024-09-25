import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CONSTANT } from '../lib';

function LoginPage({ setAuthUser }: { setAuthUser: (user: any) => void }) {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // use CONSTANT.baseUrl_local for local development
      const response = await fetch(`${CONSTANT.baseUrl_local}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userID, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Set the authenticated user
        setAuthUser(data.user); // Assuming your API returns user data
        navigate('/'); // Redirect to home page
      } else {
        setErrorMessage('Invalid ID or Password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="title">Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userID">ID:</label>
        <input
          type="text"
          id="userID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          placeholder="Enter your ID"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your Password"
          required
        />

        {errorMessage && <div className="error">{errorMessage}</div>}

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
