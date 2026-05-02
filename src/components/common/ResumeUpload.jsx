import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/authService';

const API_BASE_URL = 'http://localhost:8082/api/resumes';

const ResumeUpload = ({ registeredFair }) => {
  const currentUser = getCurrentUser();

  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadingCompany, setUploadingCompany] = useState('');
  const [submittedResumes, setSubmittedResumes] = useState([]);
  const [message, setMessage] = useState('');

  const companies = registeredFair?.participatingCompanies || [];

  useEffect(() => {
    if (currentUser?.email) {
      fetchStudentResumes();
    }
  }, [currentUser?.email]);

  const fetchStudentResumes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/${currentUser.email}`);
      if (!response.ok) return;
      const data = await response.json();
      setSubmittedResumes(data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const getSubmittedResume = (company) => {
    return submittedResumes.find(
      (resume) =>
        resume.company === company &&
        resume.fairName === registeredFair?.name &&
        resume.studentEmail === currentUser?.email
    );
  };

  const handleFileChange = (company, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file only');
      return;
    }

    setSelectedFiles((prev) => ({
      ...prev,
      [company]: file,
    }));

    setMessage('');
  };

  const handleUpload = async (company) => {
    const file = selectedFiles[company];

    if (!file) {
      alert(`Please choose a PDF file for ${company}`);
      return;
    }

    if (!currentUser?.email) {
      alert('Please login first');
      return;
    }

    if (getSubmittedResume(company)) {
      alert(`Resume already submitted for ${company}`);
      return;
    }

    try {
      setUploadingCompany(company);
      setMessage('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('company', company);
      formData.append('fairName', registeredFair?.name || 'Career Fair');
      formData.append('email', currentUser.email);
      formData.append('name', currentUser.name || 'Student');

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      await response.json();

      setMessage(`✅ Resume uploaded successfully for ${company}`);
      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[company];
        return updated;
      });

      fetchStudentResumes();
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`❌ ${error.message || 'Upload failed'}`);
    } finally {
      setUploadingCompany('');
    }
  };

  if (companies.length === 0) {
    return (
      <div style={styles.emptyBox}>
        No companies available in this fair.
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {message && (
        <div
          style={{
            ...styles.message,
            background: message.startsWith('✅') ? '#ECFDF5' : '#FEF2F2',
            borderColor: message.startsWith('✅') ? '#A7F3D0' : '#FECACA',
            color: message.startsWith('✅') ? '#065F46' : '#B91C1C',
          }}
        >
          {message}
        </div>
      )}

      {companies.map((company) => {
        const submitted = getSubmittedResume(company);

        return (
          <div key={company} style={styles.companyCard}>
            <div style={styles.companyHeader}>
              <div>
                <div style={styles.companyName}>{company}</div>
                <div style={styles.companySubtext}>
                  Upload a PDF resume for this company
                </div>
              </div>

              {submitted ? (
                <span style={styles.submittedBadge}>Submitted</span>
              ) : (
                <span style={styles.pendingBadge}>Not submitted</span>
              )}
            </div>

            {submitted ? (
              <div style={styles.submittedBox}>
                <div><strong>File:</strong> {submitted.fileName}</div>
                <div>
                  <strong>Uploaded:</strong>{' '}
                  {new Date(submitted.uploadedAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(company, e)}
                  style={styles.fileInput}
                />

                {selectedFiles[company] && (
                  <div style={styles.selectedFile}>
                    Selected: {selectedFiles[company].name}
                  </div>
                )}

                <button
                  onClick={() => handleUpload(company)}
                  disabled={!selectedFiles[company] || uploadingCompany === company}
                  style={{
                    ...styles.uploadButton,
                    opacity: !selectedFiles[company] || uploadingCompany === company ? 0.6 : 1,
                    cursor: !selectedFiles[company] || uploadingCompany === company ? 'not-allowed' : 'pointer',
                  }}
                >
                  {uploadingCompany === company ? 'Uploading...' : 'Submit Resume'}
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  message: {
    border: '1px solid',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '13px',
    fontWeight: 600,
  },
  companyCard: {
    background: '#ffffff',
    border: '1px solid #D0E2F4',
    borderRadius: '12px',
    padding: '16px',
  },
  companyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  companyName: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0C447C',
  },
  companySubtext: {
    fontSize: '12px',
    color: '#5a7a9a',
    marginTop: '4px',
  },
  submittedBadge: {
    background: '#EAF3DE',
    color: '#27500A',
    border: '1px solid #C0DD97',
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '999px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  pendingBadge: {
    background: '#F0F6FD',
    color: '#185FA5',
    border: '1px solid #B5D4F4',
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '999px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  submittedBox: {
    background: '#F8FBFF',
    border: '1px solid #DCEAF8',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '13px',
    color: '#1a3a5c',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fileInput: {
    display: 'block',
    width: '100%',
    marginBottom: '10px',
    fontSize: '13px',
  },
  selectedFile: {
    fontSize: '12px',
    color: '#065F46',
    marginBottom: '10px',
    fontWeight: 600,
  },
  uploadButton: {
    background: '#185FA5',
    border: '1px solid #185FA5',
    color: '#fff',
    fontSize: '13px',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 700,
  },
  emptyBox: {
    background: '#fff',
    border: '1px solid #D0E2F4',
    borderRadius: '12px',
    padding: '18px',
    textAlign: 'center',
    color: '#5a7a9a',
    fontSize: '13px',
  },
};

export default ResumeUpload;