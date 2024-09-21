import { useState } from 'react';
import { Navigate, useNavigate, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';
import Header from './components/ui/Header';
import './App.css';

function App() {
  const loading = false;

  // const [authUser, setAuthUser] = useState(null);
  const [authUser, setAuthUser] = useState({
    id: 'synukjPXGvPxmwp6sNpr',
    user_name: 'Steven',
    user_id: 's343543543530',
    image_url: 'https://avatars.githubusercontent.com/u/5950307?s=48&v=4',
  });

  const navigate = useNavigate();
  const onLogout = () => {
    setAuthUser(null); // Reset the authenticated user to null
    navigate('/login'); // Redirect to the login page
  };

  if (loading) return null;
  return (
    <>
      {authUser && <Header authUser={authUser} onLogout={onLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <HomePage setAuthUser={setAuthUser} authUser={authUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !authUser ? (
              <LoginPage setAuthUser={setAuthUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !authUser ? (
              <SignUpPage setAuthUser={setAuthUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/admin" element={<AdminPage authUser={authUser}/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
