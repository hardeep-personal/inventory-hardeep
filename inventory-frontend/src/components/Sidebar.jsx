import { Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, PawPrint, Lock, Mail, User } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const role = localStorage.getItem('userRole');

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'doctor', 'reception'] },
    { label: 'Products', path: '/products', roles: ['admin'] },
    { label: 'Purchases', path: '/purchases', roles: ['admin'] },
    { label: 'Sales', path: '/sales', roles: ['admin'] },
    { label: 'Reports', path: '/reports', roles: ['admin'] },
    { label: 'Settings', path: '/settings', roles: ['admin'] },
    { label: 'Vaccine', path: '/vaccine', roles: ['admin'] },
    { label: 'Prescription', path: '/prescription', roles: ['admin', 'doctor'] },
    { label: 'Receipt', path: '/receipt', roles: ['admin', 'reception'] },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="w-76 bg-teal-600 text-white flex flex-col p-4 min-h-screen">
      <div className='flex items-center justify-between gap-2'>

        <div className="bg-teal-500 p-2 rounded-full mb-4 shadow-lg">
          <PawPrint size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">PetCare Plus</h2>
        <div className="bg-teal-500 p-2 rounded-full mb-4 shadow-lg">
          <PawPrint size={24} className="text-white" />
        </div>
      </div>
      {role && (
  <div className="flex items-center gap-3 bg-gradient-to-r from-teal-100 via-white to-teal-100 text-teal-800 px-4 py-2 rounded-full shadow-md mb-6 animate-slide-glow">
    <div className="bg-white p-2 rounded-full shadow animate-pulse-slow">
      <User className="w-5 h-5 text-teal-600" />
    </div>
    <span className="text-sm font-medium tracking-wide animate-bounce-slow">
      Welcome, <span className="capitalize font-semibold">{role}</span> 👋
    </span>
  </div>
)}


      {visibleItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`mb-2 px-3 py-2 text-center rounded transition duration-200 cursor-pointer ${isActive
              ? 'bg-white text-teal-600 font-semibold shadow-inner'
              : 'bg-teal-700 text-white hover:bg-white hover:text-teal-600'
              }`}
          >
            {item.label}
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="mb-2 px-3 py-2 text-center rounded transition duration-200 bg-teal-800 text-white font-semibold shadow-inner cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
