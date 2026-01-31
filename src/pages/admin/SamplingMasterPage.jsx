// Admin Sampling Master Page
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Download,
  Upload,
  Eye,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { Header, Card, Button, Badge } from '../../components/common';
import { colors, borderRadius } from '../../constants/theme';

// Mock sampling plans data
const mockSamplingPlans = [
  {
    id: 'SP-001',
    name: 'Critical Components - Level I',
    aqlLevel: 'Level I',
    inspectionLevel: 'Normal',
    lotSizeRange: '91-150',
    sampleSize: 20,
    acceptReject: { accept: 1, reject: 2 },
    status: 'active',
    products: 24,
    lastModified: '2026-01-25',
  },
  {
    id: 'SP-002',
    name: 'Electrical Assembly - Level II',
    aqlLevel: 'Level II',
    inspectionLevel: 'Tightened',
    lotSizeRange: '151-280',
    sampleSize: 32,
    acceptReject: { accept: 2, reject: 3 },
    status: 'active',
    products: 18,
    lastModified: '2026-01-22',
  },
  {
    id: 'SP-003',
    name: 'Visual Inspection - Standard',
    aqlLevel: 'Level III',
    inspectionLevel: 'Reduced',
    lotSizeRange: '51-90',
    sampleSize: 13,
    acceptReject: { accept: 1, reject: 2 },
    status: 'draft',
    products: 0,
    lastModified: '2026-01-28',
  },
  {
    id: 'SP-004',
    name: 'High-Precision Parts',
    aqlLevel: 'Special S-3',
    inspectionLevel: 'Normal',
    lotSizeRange: '281-500',
    sampleSize: 50,
    acceptReject: { accept: 3, reject: 4 },
    status: 'active',
    products: 12,
    lastModified: '2026-01-20',
  },
];

const SamplingMasterPage = () => {
  const [samplingPlans, setSamplingPlans] = useState(mockSamplingPlans);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPlans = samplingPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <Header 
        title="Sampling Master" 
        subtitle="Configure sampling plans and AQL levels for quality inspection"
        actions={
          <div style={styles.headerActions}>
            <Button variant="outline" icon={Upload} size="sm">
              Import
            </Button>
            <Button variant="outline" icon={Download} size="sm">
              Export
            </Button>
            <Button icon={Plus} onClick={() => setShowAddModal(true)}>
              Add Sampling Plan
            </Button>
          </div>
        }
      />

      <div style={styles.content}>
        {/* Search and Filter Bar */}
        <Card padding="16px">
          <div style={styles.toolbar}>
            <div style={styles.searchBox}>
              <Search size={18} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search sampling plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <div style={styles.filterButtons}>
              <Button variant="ghost" size="sm" icon={Filter}>
                Filter
              </Button>
            </div>
          </div>
        </Card>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <SummaryCard 
            label="Total Plans" 
            value={samplingPlans.length} 
            color={colors.primary} 
          />
          <SummaryCard 
            label="Active Plans" 
            value={samplingPlans.filter(p => p.status === 'active').length} 
            color={colors.success} 
          />
          <SummaryCard 
            label="Draft Plans" 
            value={samplingPlans.filter(p => p.status === 'draft').length} 
            color={colors.warning} 
          />
          <SummaryCard 
            label="Products Covered" 
            value={samplingPlans.reduce((sum, p) => sum + p.products, 0)} 
            color={colors.accent} 
          />
        </div>

        {/* Sampling Plans Table */}
        <Card padding="0">
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Plan ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>AQL Level</th>
                  <th style={styles.th}>Inspection Level</th>
                  <th style={styles.th}>Lot Size Range</th>
                  <th style={styles.th}>Sample Size</th>
                  <th style={styles.th}>Accept/Reject</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Products</th>
                  <th style={styles.thAction}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.planId}>{plan.id}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.planName}>{plan.name}</span>
                    </td>
                    <td style={styles.td}>{plan.aqlLevel}</td>
                    <td style={styles.td}>{plan.inspectionLevel}</td>
                    <td style={styles.td}>{plan.lotSizeRange}</td>
                    <td style={styles.td}>
                      <span style={styles.sampleSize}>{plan.sampleSize}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.acceptReject}>
                        <span style={{ color: colors.success }}>Ac: {plan.acceptReject.accept}</span>
                        {' / '}
                        <span style={{ color: colors.danger }}>Re: {plan.acceptReject.reject}</span>
                      </span>
                    </td>
                    <td style={styles.td}>
                      <Badge type="status" value={plan.status} size="sm" />
                    </td>
                    <td style={styles.td}>{plan.products}</td>
                    <td style={styles.tdAction}>
                      <div style={styles.actions}>
                        <button style={styles.actionButton} title="View">
                          <Eye size={16} />
                        </button>
                        <button style={styles.actionButton} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button style={{ ...styles.actionButton, color: colors.danger }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPlans.length === 0 && (
            <div style={styles.emptyState}>
              <p>No sampling plans found matching your search.</p>
            </div>
          )}
        </Card>

        {/* AQL Reference Info */}
        <Card>
          <h3 style={styles.infoTitle}>AQL Reference Guide</h3>
          <p style={styles.infoText}>
            AQL (Acceptable Quality Level) is the quality level that is the worst tolerable. 
            The sampling plans above are based on ISO 2859-1 / ANSI/ASQ Z1.4 standards.
          </p>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <strong>Level I:</strong> Reduced discrimination
            </div>
            <div style={styles.infoItem}>
              <strong>Level II:</strong> Normal (most common)
            </div>
            <div style={styles.infoItem}>
              <strong>Level III:</strong> More discrimination
            </div>
            <div style={styles.infoItem}>
              <strong>Special (S-1 to S-4):</strong> For destructive testing
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ label, value, color }) => (
  <Card>
    <div style={styles.summaryCard}>
      <span style={{ ...styles.summaryValue, color }}>{value}</span>
      <span style={styles.summaryLabel}>{label}</span>
    </div>
  </Card>
);

const styles = {
  page: {
    minHeight: '100vh',
    background: colors.neutral[50],
  },

  content: {
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  headerActions: {
    display: 'flex',
    gap: '8px',
  },

  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },

  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    maxWidth: '400px',
    padding: '8px 16px',
    background: colors.neutral[50],
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.neutral[200]}`,
  },

  searchIcon: {
    color: colors.neutral[400],
  },

  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '14px',
    width: '100%',
    color: colors.neutral[700],
  },

  filterButtons: {
    display: 'flex',
    gap: '8px',
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },

  summaryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px',
  },

  summaryValue: {
    fontSize: '28px',
    fontWeight: 700,
  },

  summaryLabel: {
    fontSize: '13px',
    color: colors.neutral[500],
  },

  tableContainer: {
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${colors.neutral[100]}`,
    background: colors.neutral[50],
    whiteSpace: 'nowrap',
  },

  thAction: {
    textAlign: 'center',
    padding: '14px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${colors.neutral[100]}`,
    background: colors.neutral[50],
    width: '120px',
  },

  tr: {
    transition: 'background 0.15s',
  },

  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: colors.neutral[700],
    borderBottom: `1px solid ${colors.neutral[100]}`,
    whiteSpace: 'nowrap',
  },

  tdAction: {
    padding: '14px 16px',
    borderBottom: `1px solid ${colors.neutral[100]}`,
    textAlign: 'center',
  },

  planId: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: colors.primary,
    fontWeight: 500,
  },

  planName: {
    fontWeight: 500,
    color: colors.neutral[800],
  },

  sampleSize: {
    fontWeight: 600,
    color: colors.primary,
  },

  acceptReject: {
    fontSize: '13px',
    fontWeight: 500,
  },

  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },

  actionButton: {
    width: '32px',
    height: '32px',
    borderRadius: borderRadius.md,
    border: 'none',
    background: colors.neutral[50],
    color: colors.neutral[500],
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },

  emptyState: {
    padding: '48px',
    textAlign: 'center',
    color: colors.neutral[500],
  },

  infoTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral[800],
    margin: '0 0 12px',
  },

  infoText: {
    fontSize: '14px',
    color: colors.neutral[600],
    margin: '0 0 16px',
    lineHeight: 1.6,
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },

  infoItem: {
    fontSize: '13px',
    color: colors.neutral[600],
    padding: '8px 12px',
    background: colors.neutral[50],
    borderRadius: borderRadius.md,
  },
};

export default SamplingMasterPage;
