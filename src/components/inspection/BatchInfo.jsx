import React from 'react';
import { QrCode } from 'lucide-react';
import { colors, borderRadius, shadows } from '../../constants/theme';
import { Button } from '../common/Button';

export const BatchInfo = ({ job, onScan }) => {
  if (!job) return null;

  const fields = [
    { label: 'PO Number', value: job.poNo },
    { label: 'IR Number', value: job.irNo },
    { label: 'IR Date', value: job.irDate },
    { label: 'GRN Number', value: job.grnNo },
    { label: 'Part Code', value: job.product?.code },
    { label: 'Part Name', value: job.product?.name },
    { label: 'Supplier', value: job.supplier?.name },
    { label: 'Lot Size', value: job.lotSize },
    { label: 'Sample Size', value: job.sampleSize },
    { label: 'Quality Plan', value: job.qualityPlanNo },
    { label: 'IMTE ID', value: job.imteId },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: borderRadius.xl,
      padding: '24px',
      boxShadow: shadows.md,
      border: `1px solid ${colors.neutral[100]}`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.neutral[800] }}>
          Batch Information
        </h3>
        <Button
          variant="secondary"
          size="sm"
          icon={QrCode}
          onClick={onScan}
        >
          Scan
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {fields.map((field, index) => (
          <div key={index}>
            <label style={{
              fontSize: '12px',
              color: colors.neutral[400],
              display: 'block',
              marginBottom: '4px',
            }}>
              {field.label}
            </label>
            <p style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 500,
              color: colors.neutral[700],
              wordBreak: 'break-word',
            }}>
              {field.value || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchInfo;
