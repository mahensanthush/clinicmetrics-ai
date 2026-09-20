
import { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function ClinicDashboard() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Gender: 'F',
    Age: 45,
    Neighbourhood: 'JARDIM DA PENHA',
    Scholarship: 0,
    Hipertension: 1,
    Diabetes: 0,
    Alcoholism: 0,
    Handcap: 0,
    SMS_received: 1,
    DaysWaiting: 14
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const toggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === 0 ? 1 : 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/predict-no-show',
        formData
      );

      setPrediction(response.data);
    } catch (error) {
      console.error('API Error:', error);
      setError(
        'Unable to connect to the prediction server. Please make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleFields = [
    ['Hipertension', 'Hypertension', 'High blood pressure'],
    ['Diabetes', 'Diabetes', 'Diabetes condition'],
    ['Alcoholism', 'Alcoholism', 'Alcohol dependency'],
    ['Handcap', 'Handicap', 'Disability status'],
    ['Scholarship', 'Scholarship', 'Financial support'],
    ['SMS_received', 'SMS Reminder', 'Reminder received']
  ];

  const riskPercentage = prediction
    ? (Number(prediction.prediction_risk) * 100).toFixed(1)
    : 0;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            +
          </div>

          <div>
            <h1>ShowRatePredictor</h1>
            
          </div>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-item active">
            <span className="nav-icon">▦</span>
            Dashboard
          </div>

        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            <div>
              <strong>System Online</strong>
              <small>AI prediction service</small>
            </div>
          </div>

          <div className="sidebar-footer">
            <span>ClinicMetrics AI</span>
            <small>v1.0.0</small>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <p className="breadcrumb">
              Dashboard / <span>Patient Analysis</span>
            </p>

            <h2>Patient Risk Dashboard</h2>
          </div>

          <div className="profile">
            <div className="profile-avatar">
              DR
            </div>

            <div>
              <strong>Clinical Staff</strong>
              <span>Healthcare Portal</span>
            </div>
          </div>

        </header>

        {/* STAT CARDS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon blue">◎</div>
            <div>
              <span>Analysis Type</span>
              <strong>No-Show Prediction</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <span>Prediction Model</span>
              <strong>AI Powered</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">⚡</div>
            <div>
              <span>Response</span>
              <strong>Real-Time</strong>
            </div>
          </div>

        </section>

        {/* CONTENT GRID */}
        <section className="content-grid">

          {/* PATIENT FORM */}
          <div className="panel form-panel">

            <div className="panel-header">
              <div>
                <h3>Patient Information</h3>
                <p>Enter patient details for AI risk analysis</p>
              </div>

              <span className="secure-badge">
                🔒 Secure
              </span>
            </div>

            <form onSubmit={handleSubmit}>

              {/* BASIC INFORMATION */}
              <div className="section-title">
                <span>01</span>
                Basic Information
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label>Gender</label>

                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                  >
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Age</label>

                  <input
                    type="number"
                    name="Age"
                    min="0"
                    max="120"
                    value={formData.Age}
                    onChange={handleNumberChange}
                  />
                </div>

                <div className="form-group full">
                  <label>Neighbourhood</label>

                  <input
                    type="text"
                    name="Neighbourhood"
                    value={formData.Neighbourhood}
                    onChange={handleChange}
                    placeholder="Enter neighbourhood"
                  />
                </div>

                <div className="form-group">
                  <label>Days Waiting</label>

                  <input
                    type="number"
                    name="DaysWaiting"
                    min="0"
                    value={formData.DaysWaiting}
                    onChange={handleNumberChange}
                  />
                </div>

              </div>

              {/* HEALTH INFORMATION */}
              <div className="section-title health-title">
                <span>02</span>
                Health & Appointment Details
              </div>

              <div className="conditions-grid">

                {toggleFields.map(([field, label, description]) => (
                  <button
                    type="button"
                    key={field}
                    onClick={() => toggle(field)}
                    className={`condition-card ${
                      formData[field] ? 'selected' : ''
                    }`}
                  >
                    <div className="condition-top">
                      <div className="condition-icon">
                        {formData[field] ? '✓' : '○'}
                      </div>

                      <div className="toggle-switch">
                        <span
                          className={
                            formData[field] ? 'toggle-on' : ''
                          }
                        ></span>
                      </div>
                    </div>

                    <strong>{label}</strong>
                    <small>{description}</small>

                    <div className="condition-status">
                      {formData[field] ? 'YES' : 'NO'}
                    </div>
                  </button>
                ))}

              </div>

              {/* SUBMIT */}
              <div className="form-actions">

                <button
                  type="button"
                  className="reset-button"
                  onClick={() =>
                    setFormData({
                      Gender: 'F',
                      Age: 45,
                      Neighbourhood: 'JARDIM DA PENHA',
                      Scholarship: 0,
                      Hipertension: 1,
                      Diabetes: 0,
                      Alcoholism: 0,
                      Handcap: 0,
                      SMS_received: 1,
                      DaysWaiting: 14
                    })
                  }
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="analyze-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Patient Risk
                      <span>→</span>
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>

          {/* RESULT PANEL */}
          <div className="panel result-panel">

            <div className="panel-header">
              <div>
                <h3>Risk Assessment</h3>
                <p>AI-generated prediction</p>
              </div>

              <div className="ai-badge">
                AI
              </div>
            </div>

            {!prediction && !loading && !error && (
              <div className="empty-result">

                <div className="empty-icon">
                  ✦
                </div>

                <h4>Ready for Analysis</h4>

                <p>
                  Complete the patient information and click
                  <strong> Analyze Patient Risk</strong> to generate
                  an AI-powered prediction.
                </p>

                <div className="prediction-info">
                  <span>●</span>
                  Prediction uses patient information
                </div>

              </div>
            )}

            {loading && (
              <div className="loading-result">

                <div className="loading-circle">
                  <div></div>
                </div>

                <h4>Analyzing Patient</h4>

                <p>
                  Our AI model is evaluating the provided
                  patient information.
                </p>

              </div>
            )}

            {error && (
              <div className="error-result">

                <div className="error-icon">!</div>

                <h4>Prediction Failed</h4>

                <p>{error}</p>

              </div>
            )}

            {prediction && !loading && (
              <div className="result-content">

                <div className="risk-label">
                  PREDICTED NO-SHOW RISK
                </div>

                <div
                  className={`risk-circle ${
                    prediction.will_no_show
                      ? 'high-risk'
                      : 'low-risk'
                  }`}
                >
                  <div className="risk-inner">
                    <strong>{riskPercentage}%</strong>
                    <span>Risk Score</span>
                  </div>
                </div>

                <div
                  className={`risk-status ${
                    prediction.will_no_show
                      ? 'high'
                      : 'low'
                  }`}
                >
                  <span className="risk-status-dot"></span>

                  {prediction.will_no_show
                    ? 'High No-Show Risk'
                    : 'Likely to Attend'}
                </div>

                <div className="result-divider"></div>

                <div className="result-summary">

                  <div>
                    <span>Patient Age</span>
                    <strong>{formData.Age} years</strong>
                  </div>

                  <div>
                    <span>Waiting Period</span>
                    <strong>{formData.DaysWaiting} days</strong>
                  </div>

                  <div>
                    <span>SMS Reminder</span>
                    <strong>
                      {formData.SMS_received ? 'Received' : 'Not Received'}
                    </strong>
                  </div>

                </div>

                <div className="recommendation">
                  <div className="recommendation-icon">
                    💡
                  </div>

                  <div>
                    <strong>Clinical Insight</strong>

                    <p>
                      {prediction.will_no_show
                        ? 'Consider contacting this patient before the scheduled appointment.'
                        : 'The patient currently shows a lower predicted risk of missing the appointment.'}
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>

        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <span>
            © 2026 ClinicMetrics AI
          </span>

          <span>
            Patient data is processed securely for prediction purposes.
          </span>
        </footer>

      </main>
    </div>
  );
}

