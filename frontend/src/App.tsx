import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';
import Header from './components/ui/Header';
import './App.css';

function App() {
  const loading = false;
  const data = { authUser: null };

  const [authUser, setAuthUser] = useState(null);

  if (loading) return null;
  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <HomePage setAuthUser={setAuthUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
