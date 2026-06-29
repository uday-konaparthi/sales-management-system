import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const dispatch = useDispatch(); // If you want to use Redux after signup
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth); // reuse auth loading/error or create your own slice

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState('');
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch( `${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username,
          email,
          password,

          role: "owner",

          shopName,
          ownerName,
          phone,
          gstNumber,
          address,
          city,
          state: stateName,
          pincode,
        }),
      });

      if (!response.ok) {
        toast.error('Signup failed!');
        return;
      }

      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Signup error!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-700 p-8 rounded-lg shadow-md w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hidden"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">Create Your Account</h2>

        <input
          type="username"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
          required
          className="w-full mb-4 px-4 py-3 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          required
          className="w-full mb-4 px-4 py-3 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative mb-4">
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

        <div className="relative mb-6">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            className="w-full px-4 py-3 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute text-white right-3 top-1/2 transform -translate-y-1/2 cursor-pointer focus:outline-none"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <input
          type="text"
          placeholder="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 text-white border border-gray-300 rounded-md bg-transparent"
        />

        <input
          type="text"
          placeholder="Owner Name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 text-white border border-gray-300 rounded-md bg-transparent"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 text-white border border-gray-300 rounded-md bg-transparent"
        />

        <input
          type="text"
          placeholder="GST Number (Optional)"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
          className="w-full mb-4 px-4 py-3 text-white border border-gray-300 rounded-md bg-transparent"
        />

        <textarea
          placeholder="Shop Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          required
          className="w-full mb-4 px-4 py-3 text-white border border-gray-300 rounded-md bg-transparent"
        />

        <div className="grid grid-cols-3 gap-3 mb-4">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="px-4 py-3 text-white border border-gray-300 rounded-md bg-transparent"
          />

          <input
            type="text"
            placeholder="State"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            required
            className="px-4 py-3 text-white border border-gray-300 rounded-md bg-transparent"
          />

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
            className="px-4 py-3 text-white border border-gray-300 rounded-md bg-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className='text-white flex place-self-center pt-5 text-sm'>Already have an Account ,
          <span className='text-blue-500 cursor-pointer hover:underline'
            onClick={() => navigate('/login')}> Login</span>
        </p>
      </form>
    </div>
  );
}
