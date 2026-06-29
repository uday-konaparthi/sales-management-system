import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import SignupPage from './pages/RegisterPage';
import { Navbar08 } from './components/ui/shadcn-io/navbar-08';
import { useEffect } from 'react';
import { loginSuccess } from './store/authSlice';
import ProfilePage from './components/nav/ProfilePage.jsx';
import SettingsPage from './components/nav/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state.auth.user);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const user = useSelector((state) => state.auth.user);
  const { fetchedProds, showProdList, selectedProd } = useSelector((state) => state.barCodeFetch)
  const dispatch = useDispatch();

  useEffect(() => {
    console.log({
      user: user
    })
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: 'include'
        });

        if(!response.ok) {
          console.log(response.message);
          return;
        }
          const data = await response.json();
          //console.log("AUTO_LOGIN : ", data)
          dispatch(loginSuccess(data)); 
      } catch (error) {
        console.error('Auto-login failed:', error);
      }
    };

    checkAuth();
  }, []); // Remove navigate and userSignedin dependency

  return (
    <>
      <ToastContainer />
      {user && <Navbar08 />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <SignupPage />} />
        <Route path="/" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute><ProductsPage /></ProtectedRoute>
        } />
        <Route path="/sales" element={
          <ProtectedRoute><SalesPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
