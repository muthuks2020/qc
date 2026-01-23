import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, Save } from 'lucide-react';
import { colors } from '../constants/theme';
import { Button } from '../components/common';
import { InspectionMatrix, BatchInfo } from '../components/inspection';
import { fetchJobDetails, submitInspection, saveDraft } from '../api';

export const InspectionPage = ({ jobId, onBack }) => {
  const [job, setJob] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
    } else {
      setLoading(false);
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchJobDetails(jobId);
      setJob(data);
      setCheckpoints(data.checkpoints || []);
    } catch (error) {
      console.error('Failed to load job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSample = (checkpointIndex, sampleIndex) => {
    setCheckpoints(prev => {
      const updated = [...prev];
      const currentValue = updated[checkpointIndex].samples[sampleIndex];
      
      // Cycle: null -> OK -> NG -> null
      let newValue;
      if (currentValue === null) newValue = 'OK';
      else if (currentValue === 'OK') newValue = 'NG';
      else newValue = null;
      
      updated[checkpointIndex] = {
        ...updated[checkpointIndex],
        samples: [
          ...updated[checkpointIndex].samples.slice(0, sampleIndex),
          newValue,
          ...updated[checkpointIndex].samples.slice(sampleIndex + 1),
        ],
      };
      
      return updated;
    });
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft(jobId, { checkpoints });
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft');
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Calculate results
      let totalPass = 0, totalFail = 0;
      checkpoints.forEach(cp => {
        cp.samples.forEach(s => {
          if (s === 'OK') totalPass++;
          else if (s === 'NG') totalFail++;
        });
      });

      const result = {
        checkpoints,
        summary: {
          totalSamples: totalPass + totalFail,
          passed: totalPass,
          failed: totalFail,
          passRate: ((totalPass / (totalPass + totalFail)) * 100).toFixed(1),
        },
        submittedAt: new Date().toISOString(),
      };

      await submitInspection(jobId, result);
      alert('Inspection submitted successfully!');
      onBack();
    } catch (error) {
      console.error('Failed to submit inspection:', error);
      alert('Failed to submit inspection');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px 40px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: colors.neutral[500] }}>Loading inspection...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1400px' }}>
      {/* Breadcrumb & Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: colors.neutral[500],
          fontSize: '14px',
        }}>
          <span
            style={{ cursor: 'pointer' }}
            onClick={onBack}
          >
            Dashboard
          </span>
          <ChevronRight size={16} />
          <span style={{ color: colors.neutral[800], fontWeight: 500 }}>
            {job ? `Inspection - ${job.irNo}` : 'New Inspection'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
              src="/uploads/appasamy-logo.png"
              alt="Appasamy Associates"
              className="app-logo"
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" icon={Save} onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button
              variant="success"
              icon={CheckCircle2}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Inspection'}
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
        {/* Left Panel - Batch Info */}
        <div>
          <BatchInfo job={job} onScan={() => alert('QR Scanner coming soon!')} />
        </div>

        {/* Right Panel - Inspection Matrix */}
        <div>
          {checkpoints.length > 0 ? (
            <InspectionMatrix
              checkpoints={checkpoints}
              onToggleSample={handleToggleSample}
            />
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              border: `1px solid ${colors.neutral[100]}`,
            }}>
              <p style={{ color: colors.neutral[500] }}>
                {job ? 'No checkpoints defined for this product' : 'Scan a batch or select a job to start inspection'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
