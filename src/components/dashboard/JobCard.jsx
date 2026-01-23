import React from 'react';
import { Clock, Package, ArrowRight } from 'lucide-react';
import { colors, borderRadius, shadows } from '../../constants/theme';
import { Badge } from '../common/Badge';

export const JobCard = ({ job, onClick }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div
      onClick={() => onClick(job)}
      style={{
        background: 'white',
        borderRadius: borderRadius.lg,
        padding: '20px',
        boxShadow: shadows.sm,
        border: `1px solid ${colors.neutral[100]}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '12px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.md;
        e.currentTarget.style.borderColor = colors.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = shadows.sm;
        e.currentTarget.style.borderColor = colors.neutral[100];
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: colors.neutral[800] }}>
            {job.product.name}
          </h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.neutral[500] }}>
            {job.product.code}
          </p>
        </div>
        <Badge type="priority" value={job.priority} size="sm" />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: colors.neutral[500], fontSize: '13px' }}>
          <Package size={14} />
          <span>GRN: {job.grnNo}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: colors.neutral[500], fontSize: '13px' }}>
          <Clock size={14} />
          <span>{formatDate(job.createdAt)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: colors.neutral[600] }}>
          <span style={{ fontWeight: 500 }}>{job.supplier.name.split(',')[0]}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: colors.primary,
          fontSize: '13px',
          fontWeight: 500,
        }}>
          Start QC <ArrowRight size={16} />
        </div>
      </div>

      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: `1px solid ${colors.neutral[100]}`,
        display: 'flex',
        gap: '24px',
      }}>
        <div>
          <span style={{ fontSize: '12px', color: colors.neutral[400] }}>Lot Size</span>
          <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: colors.neutral[700] }}>{job.lotSize}</p>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: colors.neutral[400] }}>Sample</span>
          <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: colors.neutral[700] }}>{job.sampleSize}</p>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: colors.neutral[400] }}>Status</span>
          <p style={{ margin: '2px 0 0 0' }}>
            <Badge type="status" value={job.status} size="sm" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
