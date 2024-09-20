import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignUpPage({ setAuthUser }: { setAuthUser: (user: any) => void }) {
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Simulated stored user information for validation
  const storedUserInfo = {
    userID: '12345',
    username: 'johnDoe',
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Validate if the entered ID and username match the stored information
    if (
      userID === storedUserInfo.userID &&
      username === storedUserInfo.username
    ) {
      alert('Registration successful!');
      // Set authenticated user
      setAuthUser({ userID, username, userImage });
    } else {
      setErrorMessage('ID or Username is incorrect. Please try again.');
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
