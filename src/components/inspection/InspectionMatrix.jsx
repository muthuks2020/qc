import React from 'react';
import { Check, X } from 'lucide-react';
import { colors, borderRadius } from '../../constants/theme';

export const InspectionMatrix = ({ checkpoints, onToggleSample }) => {
  const getPassCount = () => {
    let pass = 0, fail = 0;
    checkpoints.forEach(cp => {
      cp.samples.forEach(s => {
        if (s === 'OK') pass++;
        else if (s === 'NG') fail++;
      });
    });
    return { pass, fail, total: pass + fail };
  };

  const { pass, fail, total } = getPassCount();
  const passRate = total > 0 ? ((pass / total) * 100).toFixed(1) : 0;

  return (
    <div style={{
      background: 'white',
      borderRadius: borderRadius.xl,
      padding: '24px',
      border: `1px solid ${colors.neutral[100]}`,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.neutral[800] }}>
          Inspection Matrix
        </h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{
            padding: '8px 16px',
            background: colors.successLight,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Check size={16} color={colors.success} />
            <span style={{ fontWeight: 600, color: colors.success }}>{pass}</span>
            <span style={{ color: colors.success, fontSize: '13px' }}>Passed</span>
          </div>
          <div style={{
            padding: '8px 16px',
            background: colors.dangerLight,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <X size={16} color={colors.danger} />
            <span style={{ fontWeight: 600, color: colors.danger }}>{fail}</span>
            <span style={{ color: colors.danger, fontSize: '13px' }}>Failed</span>
          </div>
          <div style={{
            padding: '8px 16px',
            background: colors.neutral[100],
            borderRadius: '8px',
          }}>
            <span style={{ fontWeight: 600, color: colors.neutral[700] }}>{passRate}%</span>
            <span style={{ color: colors.neutral[500], fontSize: '13px', marginLeft: '4px' }}>Pass Rate</span>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                background: colors.neutral[50],
                color: colors.neutral[600],
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '8px 0 0 0',
              }}>
                Checkpoint
              </th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                background: colors.neutral[50],
                color: colors.neutral[600],
                fontSize: '12px',
                fontWeight: 600,
                width: '100px',
              }}>
                Spec
              </th>
              {[...Array(10)].map((_, i) => (
                <th key={i} style={{
                  padding: '12px 8px',
                  background: colors.neutral[50],
                  color: colors.neutral[600],
                  fontSize: '12px',
                  fontWeight: 600,
                  textAlign: 'center',
                  minWidth: '48px',
                }}>
                  S{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {checkpoints.map((checkpoint, cpIndex) => (
              <tr key={checkpoint.id} style={{
                borderBottom: `1px solid ${colors.neutral[100]}`,
              }}>
                <td style={{
                  padding: '16px',
                  fontSize: '14px',
                  color: colors.neutral[700],
                  fontWeight: 500,
                }}>
                  {checkpoint.name}
                  <div style={{ fontSize: '12px', color: colors.neutral[400], marginTop: '2px' }}>
                    {checkpoint.instrument}
                  </div>
                </td>
                <td style={{
                  padding: '16px',
                  fontSize: '13px',
                  color: colors.neutral[600],
                }}>
                  {checkpoint.spec}
                  {checkpoint.tolerance !== '-' && (
                    <div style={{ fontSize: '11px', color: colors.neutral[400] }}>
                      {checkpoint.tolerance}
                    </div>
                  )}
                </td>
                {checkpoint.samples.map((sample, sampleIndex) => (
                  <td key={sampleIndex} style={{ padding: '8px', textAlign: 'center' }}>
                    <SampleButton
                      value={sample}
                      onClick={() => onToggleSample(cpIndex, sampleIndex)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sample toggle button component
const SampleButton = ({ value, onClick }) => {
  const getStyles = () => {
    if (value === 'OK') {
      return {
        background: colors.success,
        color: 'white',
        icon: <Check size={16} />,
      };
    }
    if (value === 'NG') {
      return {
        background: colors.danger,
        color: 'white',
        icon: <X size={16} />,
      };
    }
    return {
      background: colors.neutral[100],
      color: colors.neutral[400],
      icon: null,
    };
  };

  const styles = getStyles();

  return (
    <button
      onClick={onClick}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        ...styles,
      }}
    >
      {styles.icon || '–'}
    </button>
  );
};

export default InspectionMatrix;
