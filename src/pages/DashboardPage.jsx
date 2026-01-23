import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Clock, CheckCircle2, TrendingUp, Plus, Filter, Search } from 'lucide-react';
import { colors } from '../constants/theme';
import { Header, Button } from '../components/common';
import { StatCard, JobCard } from '../components/dashboard';
import { fetchPendingJobs, fetchDashboardStats } from '../api';

export const DashboardPage = ({ onNavigateToInspection }) => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, in_progress

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const handleJobClick = (job) => {
    onNavigateToInspection(job.id);
  };

  const statCards = [
    { label: 'Pending Jobs', value: stats?.pendingJobs || 0, change: '+3', icon: ClipboardCheck, color: colors.primary },
    { label: 'In Progress', value: stats?.inProgress || 0, change: '+1', icon: Clock, color: colors.warning },
    { label: 'Completed Today', value: stats?.completedToday || 0, change: '+12%', icon: CheckCircle2, color: colors.success },
    { label: 'Pass Rate', value: `${stats?.passRate || 0}%`, change: '+2.1%', icon: TrendingUp, color: colors.primary },
  ];

  if (loading) {
    return (
      <div style={{ padding: '32px 40px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: colors.neutral[500] }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <Header
        title="Quality Control Dashboard"
        subtitle="Welcome back! Here's today's inspection overview."
      >
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => onNavigateToInspection(null)}
        >
          New Inspection
        </Button>
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
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '24px',
      }}>
        {/* Pending Jobs List */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: colors.neutral[800] }}>
              QC Jobs Queue
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'pending', 'in_progress'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: filter === f ? colors.primary : colors.neutral[100],
                    color: filter === f ? 'white' : colors.neutral[600],
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              background: colors.neutral[50],
              borderRadius: '12px',
            }}>
              <p style={{ color: colors.neutral[500] }}>No jobs found</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={handleJobClick} />
            ))
          )}
        </div>

        {/* Quick Stats Panel */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${colors.neutral[100]}`,
          height: 'fit-content',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 600, color: colors.neutral[800] }}>
            Today's Activity
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ActivityItem label="Inspections Started" value="8" time="Last: 10 mins ago" />
            <ActivityItem label="Inspections Completed" value="12" time="Last: 25 mins ago" />
            <ActivityItem label="Items Rejected" value="3" time="Supplier: Precision Co." />
            <ActivityItem label="Pending Approvals" value="5" time="Awaiting QA review" />
          </div>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${colors.neutral[100]}` }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: colors.neutral[700] }}>
              Top Suppliers Today
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SupplierRow name="Sri Sakthi Ganesh Casting" jobs={4} passRate={98} />
              <SupplierRow name="Precision Components" jobs={3} passRate={100} />
              <SupplierRow name="Optical Lens Mfg" jobs={2} passRate={95} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ActivityItem = ({ label, value, time }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <p style={{ margin: 0, fontSize: '14px', color: colors.neutral[700] }}>{label}</p>
      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: colors.neutral[400] }}>{time}</p>
    </div>
    <span style={{ fontSize: '20px', fontWeight: 700, color: colors.neutral[800] }}>{value}</span>
  </div>
);

const SupplierRow = ({ name, jobs, passRate }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: colors.neutral[50],
    borderRadius: '8px',
  }}>
    <span style={{ fontSize: '13px', color: colors.neutral[700] }}>{name}</span>
    <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
      <span style={{ color: colors.neutral[500] }}>{jobs} jobs</span>
      <span style={{ color: colors.success, fontWeight: 600 }}>{passRate}%</span>
    </div>
  </div>
);

export default DashboardPage;
