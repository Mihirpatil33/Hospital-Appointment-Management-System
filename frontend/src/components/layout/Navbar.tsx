import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-brand-400'
      : 'text-slate-400 hover:text-slate-200 transition-colors';

  const patientLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/my-appointments', label: 'Appointments' },
    { to: '/my-prescriptions', label: 'Prescriptions' },
    { to: '/payments', label: 'Payments' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Dashboard' },
    { to: '/doctor/appointments', label: 'Appointments' },
    { to: '/doctor/prescriptions/create', label: 'Prescribe' },
    { to: '/doctor/profile', label: 'My Profile' },
  ];

  const links = user?.role === 'DOCTOR' ? doctorLinks : patientLinks;

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="font-display text-white text-lg hidden sm:block">MediBook</span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div className="flex items-center gap-5 text-sm overflow-x-auto scrollbar-hide">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`whitespace-nowrap ${isActive(l.to)}`}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {user ? (
            <>
              <span className="text-slate-500 text-xs hidden md:block max-w-[120px] truncate">
                {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
