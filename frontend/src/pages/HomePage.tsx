import { useNavigate } from 'react-router-dom';

function HomePage({ setAuthUser }: { setAuthUser: (user: any) => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthUser(null); // Reset the authenticated user to null
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default HomePage;
