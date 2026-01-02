import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import axios from 'axios';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPin: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Note: Replace this with your actual auth state or localStorage retrieval
  const currentUser = JSON.parse(localStorage.getItem('rf_user')).username || '';

  const handleInputChange = (field, value) => {
    const cleanValue = field === 'currentPin' ? value.replace(/\D/g, '') : value;
    setFormData(prev => ({ ...prev, [field]: cleanValue }));
  };

  const handleSubmit = async () => {
    const { currentPin, currentPassword, newPassword, confirmPassword } = formData;
    
    // 1. Frontend Validation
    if (!currentPin || !currentPassword || !newPassword || !confirmPassword) {
      return message.error("Please fill in all fields");
    }
    if (currentPin.length !== 6) {
      return message.error("Current PIN must be 6 digits");
    }
    if (newPassword !== confirmPassword) {
      return message.error("New passwords do not match");
    }
    if (!currentUser) {
      return message.error("User session not found. Please re-login.");
    }

    setLoading(true);

    try {
      // 2. API Call to the Endpoint created earlier
      const response = await axios.post('/api/auth/change-password', {
        username: currentUser,
        currentPin,
        currentPassword,
        newPassword
      });

      if (response.data.status === 200) {
        message.success(response.data.message);
        // Clear form on success
        setFormData({
          currentPin: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      // Handle API errors (401 Unauthorized, 400 Bad Request, etc.)
      const errorMsg = error.response?.data?.message || "Internal Server Error";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px 20px', background: '#000', minHeight: '100vh' }}>
      <style>{`
        .form-container { border: 1px solid #333; background: #0a0a0a; width: 100%; }
        .form-row { display: flex; border-bottom: 1px solid #1a1a1a; min-height: 70px; }
        .form-label-cell { 
            width: 550px; 
            padding: 15px 20px; 
            border-right: 1px solid #333; 
            display: flex; 
            flex-direction: column; 
            justify-content: center;
        }
        .form-input-cell { flex-grow: 1; padding: 15px 20px; display: flex; align-items: center; background: #0a0a0a; }
        .label-text { color: #fff; font-weight: bold; font-size: 14px; }
        .sub-label-text { color: #888; font-size: 11px; margin-top: 2px; }
        .custom-input-password { 
            background: #eef3f8 !important; 
            border-radius: 2px;
            border: 1px solid #d9d9d9;
            height: 38px;
            width: 100%;
            display: flex;
            align-items: center;
        }
        .custom-input-password .ant-input-password-icon { color: #000 !important; font-size: 18px; }
        .custom-input-password input { background: #eef3f8 !important; color: #000 !important; font-weight: bold; }
        .spacer-row { height: 30px; background: #000; border-left: 1px solid #333; border-right: 1px solid #333; }
        .footer-action { background: #0a0a0a; padding: 20px; border: 1px solid #333; border-top: none; }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', textTransform: 'uppercase', borderBottom: '2px solid #ff4d4f', display: 'inline-block', padding: '0 10px 5px' }}>
          Change Account Password
        </h1>
      </div>

      <div className="form-container">
        <div className="form-row">
          <div className="form-label-cell">
            <span className="label-text">Current PIN:</span>
            <span className="sub-label-text">Enter your 6-digit security PIN to authorize change</span>
          </div>
          <div className="form-input-cell">
            <Input.Password 
              maxLength={6}
              value={formData.currentPin}
              onChange={(e) => handleInputChange('currentPin', e.target.value)}
              className="custom-input-password"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-label-cell">
            <span className="label-text">Current Password:</span>
            <span className="sub-label-text">Enter your existing account password</span>
          </div>
          <div className="form-input-cell">
            <Input.Password 
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className="custom-input-password"
            />
          </div>
        </div>

        <div className="spacer-row" />

        <div className="form-row">
          <div className="form-label-cell">
            <span className="label-text">New Password:</span>
            <span className="sub-label-text">Enter your new desired password</span>
          </div>
          <div className="form-input-cell">
            <Input.Password 
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="custom-input-password"
            />
          </div>
        </div>

        <div className="form-row" style={{ borderBottom: 'none' }}>
          <div className="form-label-cell">
            <span className="label-text">Confirm New Password:</span>
            <span className="sub-label-text">Please re-type your new password to verify</span>
          </div>
          <div className="form-input-cell">
            <Input.Password 
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="custom-input-password"
            />
          </div>
        </div>
      </div>

      <div className="footer-action">
        <Button 
          onClick={handleSubmit}
          loading={loading}
          style={{ background: '#34526f', color: '#fff', borderColor: '#4a6b8a', borderRadius: '3px', fontWeight: 'bold' }}
        >
          Update Password
        </Button>
      </div>
    </div>
  );
}