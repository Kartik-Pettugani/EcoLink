import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Search, MessageCircle } from 'lucide-react';

const LandingPage = () => {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="min-h-[80vh]">
      {/* Hero Section */}
      <div className="container-app py-24">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Join thousands building sustainable communities
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
          >
            Build a{' '}
            <span className="relative">
              <span className="gradient-text">Circular Economy</span>
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400/30 to-blue-400/30 rounded-full blur-sm"></div>
            </span>
            <br />
            <span className="text-5xl md:text-6xl text-(--muted)">in Your Community</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-(--muted) mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Connect with neighbors to share, exchange, and reuse items. 
            <span className="font-semibold text-(--fg)"> Reduce waste, save money,</span> and build a more sustainable future together.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link
              to="/signup"
              className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <span className="flex items-center gap-2">
                Join the Community
                <span className="text-xl">🌱</span>
              </span>
            </Link>
            <Link
              to={userData ? "/home" : "/signin"}
              className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold"
            >
              {userData ? 'Go to Dashboard' : 'Sign In'}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">1,200+</div>
              <div className="text-(--muted)">Items Shared</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-(--muted)">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">2.5T</div>
              <div className="text-(--muted)">CO₂ Saved</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-transparent to-(--surface)">
        <div className="container-app">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                How <span className="gradient-text">EcoLink</span> Works
              </h2>
              <p className="text-xl text-(--muted) max-w-3xl mx-auto">
                Simple steps to create a more sustainable community and reduce waste together
              </p>
            </motion.div>
          </div>
          
          <div className="bg-(--card) p-8 rounded-3xl border border-(--border) shadow-sm">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group text-center p-8 rounded-3xl border border-(--border) bg-(--card) hover-lift relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl border border-(--border) bg-linear-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-(--fg)">
                  Post Items
                </h3>
                <p className="text-(--muted) leading-relaxed">
                  Share items you no longer need - electronics, furniture, clothes, books, and more. 
                  Help others find what they need while reducing waste.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group text-center p-8 rounded-3xl border border-(--border) bg-(--card) hover-lift relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl border border-(--border) bg-linear-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-(--fg)">
                  Discover Nearby
                </h3>
                <p className="text-(--muted) leading-relaxed">
                  Find items you need from people in your local area using location-based search. 
                  Connect with your community and discover hidden treasures.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group text-center p-8 rounded-3xl border border-(--border) bg-(--card) hover-lift relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl border border-(--border) bg-linear-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-(--fg)">
                  Connect & Exchange
                </h3>
                <p className="text-(--muted) leading-relaxed">
                  Chat with other users, arrange pickups, and track your environmental impact. 
                  Build lasting connections while making a positive difference.
                </p>
              </div>
            </motion.div>
            </div>

            {/* decorative divider to separate from impact section */}
            <div className="my-10 flex justify-center">
              <div className="w-28 h-1 rounded-full bg-linear-to-r from-emerald-400 to-blue-400 opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Wave Divider */}
<div className="relative">
  <svg className="absolute top-0 w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
    <path fill="var(--surface)" fillOpacity="1" d="M0,192L48,165.3C96,139,192,85,288,85.3C384,85,480,139,576,144C672,149,768,107,864,101.3C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
  </svg>
  <div className="h-20 bg-gradient-to-b from-(--surface) to-transparent"></div>
</div>


      {/* Impact Section */}
  <div className="py-24 bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="container-app text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Make a <span className="text-emerald-200">Real Impact</span>
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100 mb-16 max-w-3xl mx-auto">
              Every item shared is one less item in a landfill. Join the movement for a sustainable future.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group text-center p-8 rounded-3xl border border-white/10 bg-white/5 hover-lift relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-400/6 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">♻️</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Reduce Waste</h3>
                <p className="text-emerald-100 leading-relaxed">Keep usable items out of landfills and extend their lifecycle</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group text-center p-8 rounded-3xl border border-white/10 bg-white/5 hover-lift relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-300/6 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">🌱</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Lower Carbon Footprint</h3>
                <p className="text-emerald-100 leading-relaxed">Reduce the need for new production and manufacturing</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group text-center p-8 rounded-3xl border border-white/10 bg-white/5 hover-lift relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-200/6 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">🏘️</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Build Community</h3>
                <p className="text-emerald-100 leading-relaxed">Connect with neighbors and strengthen local relationships</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
