import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { colors, borderRadius, shadows } from '../../constants/theme';
import { Badge } from '../common/Badge';

export const JobCard = ({ job, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div
      onClick={() => onClick(job)}
      style={{
        background: 'white',
        borderRadius: borderRadius.lg,
        padding: '16px',
        border: `1px solid ${colors.neutral[100]}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.md;
        e.currentTarget.style.borderColor = colors.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = colors.neutral[100];
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {/* GRN & Priority */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: colors.neutral[800], fontSize: '14px' }}>
              {job.grnNo}
            </span>
            <Badge type="priority" value={job.priority} size="sm" />
          </div>

          {/* Product Name */}
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '13px',
            color: colors.neutral[600],
            lineHeight: 1.4,
          }}>
            {job.product?.name}
          </p>

          {/* Supplier */}
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: colors.neutral[400],
          }}>
            {job.supplier?.name}
          </p>

          {/* Meta Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '12px',
            fontSize: '12px',
            color: colors.neutral[400],
          }}>
            <span>Lot: {job.lotSize}</span>
            <span>Sample: {job.sampleSize}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              {getTimeAgo(job.createdAt)}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: colors.neutral[50],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ChevronRight size={18} color={colors.neutral[400]} />
        </div>
      </div>
    </div>
  );
};

export default JobCard;
