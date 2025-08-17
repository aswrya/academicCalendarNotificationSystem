// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/academic-calendar" className="text-2xl font-bold">Academic Calendar</Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/academic-calendar" className="hover:underline">Calendar</Link>

            <button
              onClick={() => navigate('/academic-calendar?new=1')}
              className="px-3 py-2 rounded bg-white text-blue-600 font-semibold hover:bg-blue-100"
            >
              + Add Event
            </button>

            <Link to="/profile" className="hover:underline">Profile</Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-3 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
