import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Save, CheckCircle2, X, FileText } from 'lucide-react';
import { colors, borderRadius } from '../constants/theme';
import { Button } from '../components/common';
import { BatchInfo, InspectionMatrix } from '../components/inspection';
import { 
  fetchJobDetails, 
  submitInspection, 
  saveDraft,
  getStatusFromMeasuredValue,
} from '../api';
import { fetchQCFileByCheckpoint, fetchCheckpointParameters } from '../api/qcFileService';

/**
 * InspectionPage Component
 * 
 * Main inspection page with:
 * - Batch information panel
 * - Inspection matrix with measurement inputs and Yes/No toggles
 * - QC file modal for viewing parameters
 * - Auto-status determination based on measured values
 */
const InspectionPage = ({ jobId, onBack }) => {
  const [job, setJob] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // QC File Modal state
  const [qcFileModal, setQCFileModal] = useState({
    isOpen: false,
    checkpoint: null,
    qcFile: null,
    parameters: [],
    loading: false,
  });

  // Load job details
  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const jobData = await fetchJobDetails(jobId);
        setJob(jobData);
        setCheckpoints(jobData.checkpoints || []);
      } catch (error) {
        console.error('Failed to load job:', error);
        alert('Failed to load inspection job');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  /**
   * Handle Yes/No toggle for a sample
   * Cycles through: null -> OK -> NG -> null
   */
  const handleToggleSample = useCallback((checkpointIndex, sampleIndex) => {
    setCheckpoints(prev => {
      const updated = [...prev];
      const checkpoint = { ...updated[checkpointIndex] };
      const samples = [...checkpoint.samples];
      
      // Get current sample (support both old and new format)
      let currentSample = samples[sampleIndex];
      
      // Ensure sample is in new object format
      if (typeof currentSample !== 'object' || currentSample === null) {
        currentSample = { status: currentSample, measuredValue: null };
      } else {
        currentSample = { ...currentSample };
      }

      // Cycle through statuses: null -> OK -> NG -> null
      if (currentSample.status === null) {
        currentSample.status = 'OK';
      } else if (currentSample.status === 'OK') {
        currentSample.status = 'NG';
      } else {
        currentSample.status = null;
      }

      samples[sampleIndex] = currentSample;
      checkpoint.samples = samples;
      updated[checkpointIndex] = checkpoint;
      
      return updated;
    });
  }, []);

  /**
   * Handle measured value change for a sample
   * Also auto-determines status based on limits
   */
  const handleMeasuredValueChange = useCallback((checkpointIndex, sampleIndex, value) => {
    setCheckpoints(prev => {
      const updated = [...prev];
      const checkpoint = { ...updated[checkpointIndex] };
      const samples = [...checkpoint.samples];
      
      // Get current sample
      let currentSample = samples[sampleIndex];
      
      // Ensure sample is in new object format
      if (typeof currentSample !== 'object' || currentSample === null) {
        currentSample = { status: null, measuredValue: null };
      } else {
        currentSample = { ...currentSample };
      }

      // Update measured value
      currentSample.measuredValue = value;

      // Auto-determine status based on limits (if limits are defined)
      if (checkpoint.upperLimit && checkpoint.lowerLimit && value !== null) {
        const autoStatus = getStatusFromMeasuredValue(value, checkpoint);
        if (autoStatus !== null) {
          currentSample.status = autoStatus;
        }
      }

      samples[sampleIndex] = currentSample;
      checkpoint.samples = samples;
      updated[checkpointIndex] = checkpoint;
      
      return updated;
    });
  }, []);

  /**
   * Handle QC file link click
   * Opens modal with QC parameters
   */
  const handleQCFileClick = useCallback(async (checkpoint) => {
    setQCFileModal({
      isOpen: true,
      checkpoint,
      qcFile: null,
      parameters: [],
      loading: true,
    });

    try {
      // Fetch QC file and parameters
      const [qcFile, parameters] = await Promise.all([
        fetchQCFileByCheckpoint(checkpoint.id),
        fetchCheckpointParameters(checkpoint.id),
      ]);

      setQCFileModal(prev => ({
        ...prev,
        qcFile,
        parameters,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load QC file:', error);
      setQCFileModal(prev => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  /**
   * Close QC file modal
   */
  const closeQCFileModal = useCallback(() => {
    setQCFileModal({
      isOpen: false,
      checkpoint: null,
      qcFile: null,
      parameters: [],
      loading: false,
    });
  }, []);

  /**
   * Save inspection as draft
   */
  const handleSaveDraft = async () => {
    if (!job) return;

    try {
      await saveDraft(job.id, { checkpoints });
      alert('Draft saved successfully');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft');
    }
  };

  /**
   * Submit completed inspection
   */
  const handleSubmit = async () => {
    if (!job) return;

    // Validate that all samples have been inspected
    const totalSamples = checkpoints.reduce((acc, cp) => acc + cp.samples.length, 0);
    const completedSamples = checkpoints.reduce((acc, cp) => {
      return acc + cp.samples.filter(s => {
        const status = typeof s === 'object' ? s?.status : s;
        return status !== null;
      }).length;
    }, 0);

    if (completedSamples < totalSamples) {
      const proceed = window.confirm(
        `Only ${completedSamples} of ${totalSamples} samples have been inspected. Submit anyway?`
      );
      if (!proceed) return;
    }

    try {
      setSubmitting(true);
      await submitInspection(job.id, { checkpoints });
      alert('Inspection submitted successfully');
      onBack();
    } catch (error) {
      console.error('Failed to submit inspection:', error);
      alert('Failed to submit inspection');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
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
              onMeasuredValueChange={handleMeasuredValueChange}
              onQCFileClick={handleQCFileClick}
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

      {/* QC File Modal */}
      {qcFileModal.isOpen && (
        <QCFileModal
          checkpoint={qcFileModal.checkpoint}
          qcFile={qcFileModal.qcFile}
          parameters={qcFileModal.parameters}
          loading={qcFileModal.loading}
          onClose={closeQCFileModal}
        />
      )}
    </div>
  );
};

/**
 * QCFileModal Component
 * Modal for displaying QC file parameters
 */
const QCFileModal = ({ checkpoint, qcFile, parameters, loading, onClose }) => {
  // Handle clicking outside modal to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: borderRadius.xl,
        width: '500px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${colors.neutral[100]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: colors.primary + '15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FileText size={20} color={colors.primary} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.neutral[800] }}>
                QC Parameters
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: colors.neutral[500] }}>
                {checkpoint?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: colors.neutral[100],
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} color={colors.neutral[600]} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(80vh - 150px)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: colors.neutral[500] }}>Loading parameters...</p>
            </div>
          ) : (
            <>
              {/* QC File Info */}
              {qcFile && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: colors.neutral[700] }}>
                    {qcFile.name}
                  </h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: colors.neutral[500] }}>
                    {qcFile.description}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: colors.neutral[400] }}>
                    <span>Revision: {qcFile.revision}</span>
                    <span>Updated: {qcFile.lastUpdated}</span>
                  </div>
                </div>
              )}

              {/* Parameters Table */}
              {parameters.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: colors.neutral[700] }}>
                    Parameters
                  </h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {parameters.map((param, index) => (
                        <tr key={index} style={{ borderBottom: `1px solid ${colors.neutral[100]}` }}>
                          <td style={{
                            padding: '12px 0',
                            fontSize: '13px',
                            color: colors.neutral[600],
                            fontWeight: 500,
                            width: '50%',
                          }}>
                            {param.name}
                          </td>
                          <td style={{
                            padding: '12px 0',
                            fontSize: '13px',
                            color: colors.neutral[800],
                            fontWeight: 600,
                          }}>
                            {param.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* View Document Button */}
              {qcFile?.documentUrl && (
                <div style={{ marginTop: '24px' }}>
                  <Button
                    variant="primary"
                    icon={FileText}
                    onClick={() => window.open(qcFile.documentUrl, '_blank')}
                    style={{ width: '100%' }}
                  >
                    View Full Document
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!qcFile && parameters.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: colors.neutral[500] }}>
                    No QC parameters found for this checkpoint.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
