import { Link } from 'react-router-dom';
import { User } from '../../types';

interface HeaderProps {
  authUser: User | null;
  onLogout: () => void;
}

const Header = ({ authUser, onLogout }: HeaderProps) => {
  return (
    <div className="header-container">
      <div className="heading">
        <h1>
          <Link to="/">Forum App</Link>
        </h1>
      </div>
      {authUser && (
        <div className="user-profile">
          <Link to="/admin" className="profile-link">
            {authUser.image_url ? (
              <img
                src={authUser.image_url}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <span className="profile-placeholder">{authUser.user_name}</span>
            )}
            <span className="username">{authUser.user_name}</span>
          </Link>
          <button className="logout-btn" onClick={onLogout}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
