import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Filter,
} from 'lucide-react';
import { colors } from '../constants/theme';
import { Header, Button } from '../components/common';
import { StatCard, JobCard } from '../components/dashboard';
import { fetchPendingJobs, fetchDashboardStats } from '../api';

/**
 * DashboardPage Component
 * Main dashboard with KPIs and pending jobs queue
 */
const DashboardPage = ({ onNavigateToInspection }) => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [jobsData, statsData] = await Promise.all([
        fetchPendingJobs(),
        fetchDashboardStats(),
      ]);
      setJobs(jobsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (statusFilter === 'all') return true;
    return job.status === statusFilter;
  });

  const handleJobClick = (job) => {
    onNavigateToInspection(job.id);
  };

  const statCards = [
    {
      label: 'Pending Jobs',
      value: stats?.pendingJobs || 0,
      change: '+3',
      icon: ClipboardList,
      color: colors.primary,
    },
    {
      label: 'In Progress',
      value: stats?.inProgress || 0,
      change: '+1',
      icon: Clock,
      color: colors.warning,
    },
    {
      label: 'Completed Today',
      value: stats?.completedToday || 0,
      change: '+12%',
      icon: CheckCircle2,
      color: colors.success,
    },
    {
      label: 'Pass Rate',
      value: `${stats?.passRate || 0}%`,
      change: '+2.1%',
      icon: TrendingUp,
      color: colors.primary,
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        padding: '32px 40px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <p style={{ color: colors.neutral[500] }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <Header 
        title="Quality Control Dashboard" 
        subtitle="Welcome back! Here's today's inspection overview."
      >
        <img
          src="/uploads/appasamy-logo.png"
          alt="Appasamy Associates"
          style={{ height: '40px' }}
        />
      </Header>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Jobs Section */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${colors.neutral[100]}`,
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: 600, 
            color: colors.neutral[800] 
          }}>
            Pending Inspections
          </h3>
          
          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'pending', 'in_progress'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  background: statusFilter === status ? colors.primary : colors.neutral[100],
                  color: statusFilter === status ? 'white' : colors.neutral[600],
                  transition: 'all 0.2s',
                }}
              >
                {status === 'all' ? 'All' : status === 'in_progress' ? 'In Progress' : 'Pending'}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={handleJobClick} />
            ))
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: colors.neutral[500],
            }}>
              No jobs found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
