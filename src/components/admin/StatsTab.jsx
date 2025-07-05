import React, { useState, useEffect, lazy } from 'react';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '@stores/analyticsStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

const { FiTrendingUp, FiUsers, FiMessageCircle, FiDollarSign, FiCalendar } = FiIcons;

// Lazy load charts to reduce bundle size
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const PieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));

function StatsTab() {
  const { track } = useAnalyticsStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats = {
        overview: {
          totalUsers: 1247,
          activeUsers: 892,
          totalMessages: 15432,
          revenue: 24567
        },
        dailyActiveUsers: [
          { date: '2024-01-01', users: 45 },
          { date: '2024-01-02', users: 52 },
          { date: '2024-01-03', users: 48 },
          { date: '2024-01-04', users: 61 },
          { date: '2024-01-05', users: 55 },
          { date: '2024-01-06', users: 67 },
          { date: '2024-01-07', users: 73 }
        ],
        messagesByDay: [
          { date: '2024-01-01', messages: 234 },
          { date: '2024-01-02', messages: 298 },
          { date: '2024-01-03', messages: 267 },
          { date: '2024-01-04', messages: 345 },
          { date: '2024-01-05', messages: 312 },
          { date: '2024-01-06', messages: 378 },
          { date: '2024-01-07', messages: 423 }
        ],
        planDistribution: [
          { name: 'Free', value: 65, color: '#3B82F6' },
          { name: 'Pro', value: 25, color: '#8B5CF6' },
          { name: 'Enterprise', value: 10, color: '#10B981' }
        ]
      };
      
      setStats(mockStats);
      track('admin_stats_viewed', { timeRange });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics & Statistics
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <SafeIcon icon={FiUsers} className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview.activeUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">+8% from last month</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview.totalMessages.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">+15% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <SafeIcon icon={FiMessageCircle} className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats?.overview.revenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">+23% from last month</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <SafeIcon icon={FiDollarSign} className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Active Users
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart placeholder - Daily Active Users
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Messages per Day
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart placeholder - Messages per Day
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Plan Distribution
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart placeholder - Plan Distribution
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart placeholder - User Growth
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsTab;