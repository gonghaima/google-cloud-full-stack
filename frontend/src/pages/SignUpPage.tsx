import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CONSTANT } from '../lib';

function SignUpPage({ setAuthUser }: { setAuthUser: (user: any) => void }) {
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userImage, setUserImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Ensure that the image is selected before making the request
    if (!userImage) {
      setErrorMessage('Please upload a user image.');
      return;
    }

    try {
      // Create FormData to send multipart/form-data
      const formData = new FormData();
      formData.append('id', userID);
      formData.append('user_name', username);
      formData.append('password', password);
      formData.append('image', userImage); // Add user image to form data

      // Use CONSTANT.baseUrl_local for local development
      const response = await fetch(`${CONSTANT.baseUrl_local}/users`, {
        method: 'POST',
        body: formData, // Send formData directly
      });
      if (response.ok) {
        const data = await response.json();
        // Set the authenticated user
        setAuthUser(data); // Assuming your API returns user data
        navigate('/'); // Redirect to home page
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="registration-container">
      <h2 className="title">Register</h2>
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

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Username"
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

        <label htmlFor="userImage">User Image:</label>
        <input
          type="file"
          id="userImage"
          onChange={(e) => setUserImage(e.target.files?.[0] || null)}
          required
        />

        {errorMessage && <div className="error">{errorMessage}</div>}

        <button type="submit" className="register-btn">
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default SignUpPage;
