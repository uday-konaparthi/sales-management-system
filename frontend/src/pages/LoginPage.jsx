import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, token, error } = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.log(response)
        toast.error('Login failed!');
        return;
      }
      
      const data = await response.json();
      localStorage.setItem('auth-token', data.token);
      toast.success('successfully logged in')
      dispatch(loginSuccess(data));
      navigate('/')
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-700 p-8 rounded-lg shadow-md w-full max-w-md relative"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">Welcome Dude</h2>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          required
          className="w-full mb-4 px-4 py-3 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
            className="w-full px-4 py-3 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-white right-3 top-1/2 transform -translate-y-1/2 cursor-pointer focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 my-5 rounded-md text-white font-semibold ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className='text-white flex place-self-center pt-5 text-sm'>Don't have an Account ,
          <span className='text-blue-500 cursor-pointer hover:underline' 
          onClick={() => navigate('/register')}> Signup</span>
        </p>
      </form>
    </div>
  );
}
