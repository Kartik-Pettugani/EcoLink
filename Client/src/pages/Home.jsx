import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOutUser } from '../../apiCalls/authCalls';
import { setUserData } from '../redux/userSlice';

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const res = await signOutUser();
      if (res && res.message === 'SignOut successful') {
        dispatch(setUserData(null));
        navigate('/');
      } else {
        console.error('Unexpected signout response:', res);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg)">
      <div className="container-app py-12">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Welcome back, {userData?.name || userData?.userName}!
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your <span className="gradient-text">EcoLink</span> Dashboard
          </h1>
          <p className="text-xl text-(--muted) max-w-3xl mx-auto">
            Start sharing, discovering, and building a more sustainable community. 
            Every action makes a difference for our planet.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group card p-8 text-center hover-lift relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-(--fg) mb-4">
                Post an Item
              </h3>
              <p className="text-(--muted) mb-6 leading-relaxed">
                Share items you no longer need with your community. Help others find what they need while reducing waste.
              </p>
              <Link
                to="/post-item"
                className="btn btn-primary w-full"
              >
                Post Item
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group card p-8 text-center hover-lift relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-(--fg) mb-4">
                Browse Items
              </h3>
              <p className="text-(--muted) mb-6 leading-relaxed">
                Discover items available in your local area. Find treasures while supporting sustainable living.
              </p>
              <Link
                to="/browse"
                className="btn btn-primary w-full"
              >
                Browse Items
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group card p-8 text-center hover-lift relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-(--fg) mb-4">
                My Impact
              </h3>
              <p className="text-(--muted) mb-6 leading-relaxed">
                Track your environmental impact and contributions. See how you're making a difference.
              </p>
              <Link
                to="/profile"
                className="btn btn-primary w-full"
              >
                View Impact
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-(--fg)">
              Recent Activity
            </h3>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 flex items-center justify-center">
              <span className="text-lg">📈</span>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">📝</span>
            </div>
            <h4 className="text-xl font-semibold text-(--fg) mb-3">
              Ready to Get Started?
            </h4>
            <p className="text-(--muted) mb-6 max-w-md mx-auto">
              No recent activity yet. Start by posting your first item or browsing available items to see your impact grow!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/post-item"
                className="btn btn-primary"
              >
                Post Your First Item
              </Link>
              <Link
                to="/browse"
                className="btn btn-primary outline"
              >
                Explore Items
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;