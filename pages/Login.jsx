import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { authAPI } from '../api/allApi.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Verifying credentials...');

    try {
      const response = await authAPI.login(formData);

      const { token, user } = response.data;

      login(token, user);

      toast.success(`Welcome back, ${user.name}!`, { id: loadingToast });

      if (response.status === 200 || response.status === 201) {

        const from = location.state?.from?.pathname;

        if (from) {
          navigate(from, { replace: true });
        } else {
          switch (user.role) {
            case 'superadmin':
              navigate('/superadmin');
              break;
            case 'admin':
              navigate('/admin');
              break;
            default:
              navigate('/'); // Regular users go to home
              break;
          }
        }
      }

    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg = err.response?.data?.message || 'Invalid email or password';
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
          Sign in to Nexus
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          New here?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-indigo-100/50 border border-gray-100 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all placeholder:text-gray-300"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all placeholder:text-gray-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign in <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;