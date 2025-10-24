import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInUser } from '../../apiCalls/authCalls';
import { motion } from 'framer-motion';

const SignIn = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await signInUser(formData);
      if (response.message === 'SignIn successful') {
        // Store the user data returned from server
        dispatch(setUserData(response.user));
        navigate('/home');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto card-glass p-10 hover-lift"
      >
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-2xl">
              <span className="text-3xl">🌱</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-(--fg) mb-2">
            Welcome back to <span className="gradient-text">EcoLink</span>
          </h2>
          <p className="text-(--muted) microcopy">
            Or{' '}
            <Link
              to="/signup"
              className="font-semibold text-(--brand) hover:text-(--brand-dark) transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="userName" className="block text-sm font-semibold text-(--fg)">
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                className="input"
                placeholder="Enter your username"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-(--fg)">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                {error}
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-(--brand) focus:ring-emerald-400/40 border-(--border) rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-(--fg)">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-(--brand) hover:text-(--brand-dark) transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-(--muted) hover:text-(--fg) transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignIn;
