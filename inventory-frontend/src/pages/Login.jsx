import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, PawPrint, Lock, Mail } from 'lucide-react';

const users = [
  { email: 'admin@example.com', password: 'admin', role: 'admin' },
  { email: 'reception@example.com', password: 'reception', role: 'reception' },
  { email: 'doctor@example.com', password: 'doctor', role: 'doctor' },
];

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        localStorage.setItem('authToken', 'dummy-token');
        localStorage.setItem('userRole', foundUser.role);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="w-full max-w-md">
        {/* Logo and Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-500 p-4 rounded-full mb-4 shadow-lg">
            <PawPrint size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-teal-800">PetCare Plus</h1>
          <p className="text-gray-600 mt-2">Clinic & Inventory Management</p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm text-teal-600 hover:text-teal-800">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff size={18} className="text-gray-500" /> : 
                    <Eye size={18} className="text-gray-500" />
                  }
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Log in to Dashboard'
              )}
            </button>
            
            <div className="mt-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Keep me signed in
                </label>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need access? <a href="#" className="text-teal-600 hover:text-teal-800 font-medium">Contact administrator</a>
          </p>
        </div>
      </div>
      
      {/* Version info */}
      <div className="mt-8 text-center text-xs text-gray-500">
        PetCare Plus © <strong>intense solutions</strong> 2025
      </div>
    </div>
  );
}

export default Login;