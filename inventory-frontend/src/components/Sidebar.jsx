import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Products', path: '/products' },
    { label: 'Purchases', path: '/purchases' },
    { label: 'Sales', path: '/sales' },
    { label: 'Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' },
    { label: 'vaccine', path: '/vaccine' },

  ];

  return (
    <div className=" w-60 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Inventory</h2>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`mb-2 px-3 py-2 rounded hover:bg-gray-700 ${
            location.pathname === item.path ? 'bg-gray-700' : ''
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
