import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Activity, Leaf, Package, Recycle, Calendar, Scale } from 'lucide-react';
import { getUserStats } from '../../apiCalls/dashboardCalls';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const [stats, setStats] = useState({
    itemsShared: 0,
    itemsReceived: 0,
    totalTransactions: 0,
    wasteSaved: 0,
    co2Saved: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getUserStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate CO2 savings based on waste saved (rough estimate)
  const calculateCO2Savings = (wasteKg) => {
    // Average CO2 savings per kg of waste diverted from landfill
    const CO2_PER_KG = 2.5;
    return (wasteKg * CO2_PER_KG).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg) flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--brand)" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg)">
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold text-(--fg) mb-8">My Impact Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Items Shared */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500/10 to-green-600/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-(--fg)">Items Shared</h3>
                <p className="text-3xl font-bold text-(--brand)">{stats.itemsShared}</p>
              </div>
            </div>
          </motion.div>

          {/* Items Received */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-(--fg)">Items Received</h3>
                <p className="text-3xl font-bold text-(--brand)">{stats.itemsReceived}</p>
              </div>
            </div>
          </motion.div>

          {/* Total Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-(--fg)">Total Transactions</h3>
                <p className="text-3xl font-bold text-(--brand)">{stats.totalTransactions}</p>
              </div>
            </div>
          </motion.div>

          {/* Waste Saved */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-yellow-500/10 to-yellow-600/10 flex items-center justify-center">
                <Recycle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-(--fg)">Waste Saved</h3>
                <p className="text-3xl font-bold text-(--brand)">{stats.wasteSaved}kg</p>
              </div>
            </div>
          </motion.div>

          {/* CO2 Savings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-(--fg)">CO₂ Saved</h3>
                <p className="text-3xl font-bold text-(--brand)">{calculateCO2Savings(stats.wasteSaved)}kg</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-(--fg) mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-(--surface)">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-500/10 to-brand-600/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-(--brand)" />
                </div>
                <div>
                  <p className="font-semibold text-(--fg)">{activity.title}</p>
                  <p className="text-sm text-(--muted)">{new Date(activity.date).toLocaleDateString()}</p>
                  {activity.itemId && (
                    <Link to={'/item/${activity.itemId}'} className="text-sm text-(--brand) hover:underline">
                      View Item
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
