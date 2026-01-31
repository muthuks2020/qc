import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { colors, borderRadius, shadows } from '../../constants/theme';

export const StatCard = ({ label, value, change, icon: Icon, color }) => {
  const isPositive = change?.startsWith('+');
  
  return (
    <div style={{
      background: 'white',
      borderRadius: borderRadius.xl,
      padding: '24px',
      boxShadow: shadows.md,
      border: `1px solid ${colors.neutral[100]}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            color: colors.neutral[500],
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '8px',
            margin: 0,
          }}>
            {label}
          </p>
          <p style={{
            fontSize: '32px',
            fontWeight: 700,
            color: colors.neutral[800],
            margin: '8px 0',
          }}>
            {value}
          </p>
          {change && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: isPositive ? colors.success : colors.danger,
              fontSize: '13px',
              fontWeight: 500,
            }}>
              {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {change} from yesterday
            </div>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={24} color={color} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
