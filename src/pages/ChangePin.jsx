import React, { useState } from 'react';
import { Input, Button, message } from 'antd';

export default function ChangePin() {
  const [formData, setFormData] = useState({
    currentPin: '',
    currentPassword: '',
    newPin: '',
    confirmPin: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { currentPin, currentPassword, newPin, confirmPin } = formData;

    // Basic Validation
    if (!currentPin || !currentPassword || !newPin || !confirmPin) {
      return message.error("Please fill in all fields");
    }
    if (newPin !== confirmPin) {
      return message.error("New PIN and Confirmation PIN do not match");
    }
    if (newPin.length !== 6 || isNaN(newPin)) {
      return message.error("New PIN must be exactly 6 numbers");
    }

    setLoading(true);
    try {
      // Replace with your actual API call
      // await axios.post('/api/account/change-pin', formData);
      message.success("PIN changed successfully!");
      setFormData({ currentPin: '', currentPassword: '', newPin: '', confirmPin: '' });
    } catch (error) {
      message.error("Failed to change PIN. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px 20px', background: '#000', minHeight: '100vh' }}>
      <style>{`
        .form-container { border: 1px solid #333; background: #0a0a0a; width: 100%; margin-bottom: 20px; }
        .form-row { display: flex; border-bottom: 1px solid #1a1a1a; min-height: 60px; }
        .form-label-cell { 
            width: 550px; 
            padding: 12px 15px; 
            border-right: 1px solid #333; 
            display: flex; 
            flex-direction: column; 
            justify-content: center;
        }
        .form-input-cell { flex-grow: 1; padding: 12px 15px; display: flex; align-items: center; background: #0a0a0a; }
        
        .label-text { color: #fff; font-weight: bold; font-size: 14px; display: block; }
        .sub-label-text { color: #888; font-size: 11px; margin-top: 4px; }
        
        .custom-input { 
            border-radius: 4px; 
            background: #eef3f8 !important; 
            color: #000 !important; 
            border: 1px solid #d9d9d9; 
            height: 35px; 
            width: 100%; 
            font-weight: 500;
        }
        
        .spacer-row { height: 20px; background: #000; border-left: 1px solid #333; border-right: 1px solid #333; }
        .footer-action { background: #1a1a1a; padding: 15px; text-align: center; border-top: 1px solid #333; }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', textTransform: 'uppercase', borderBottom: '2px solid #ff4d4f', display: 'inline-block', padding: '0 10px 5px' }}>
          Change Account PIN
        </h1>
      </div>

      <div className="form-container">
        {/* Current PIN */}
        <div className="form-row">
          <div className="form-label-cell">
            <span className="label-text">Current PIN:</span>
            <span className="sub-label-text">Enter your current PIN</span>
          </div>
          <div className="form-input-cell">
            <Input.Password 
              value={formData.currentPin}
              onChange={(e) => handleInputChange('currentPin', e.target.value)}
              placeholder="Current PIN"
              className="custom-input" 
            />
          </div>
        </div>

        {/* Current Password */}
        <div className="form-row">
          <div className="form-label-cell">
            <span className="label-text">Current password:</span>
            <span className="sub-label-text">Please re-type your current password</span>
          </div>
          <div className="form-input-cell">
            <Input.Password 
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              placeholder="Current Password"
              className="custom-input" 
            />
          </div>
        </div>

        {/* Visual Spacer (Black gap in image) */}
        <div className="spacer-row" />

        {/* New PIN */}
        <div className="form-row">
          <div className="form-label-cell">
            <span className="label-text">New PIN:</span>
            <span className="sub-label-text">Enter a new valid PIN. Must be 6 numbers in lengths</span>
          </div>
          <div className="form-input-cell">
            <Input 
              maxLength={6}
              value={formData.newPin}
              onChange={(e) => handleInputChange('newPin', e.target.value)}
              placeholder="New PIN"
              className="custom-input" 
            />
          </div>
        </div>

        {/* Confirm PIN */}
        <div className="form-row" style={{ borderBottom: 'none' }}>
          <div className="form-label-cell">
            <span className="label-text">Confirm PIN:</span>
            <span className="sub-label-text">Please re-type your new PIN</span>
          </div>
          <div className="form-input-cell">
            <Input 
              maxLength={6}
              value={formData.confirmPin}
              onChange={(e) => handleInputChange('confirmPin', e.target.value)}
              placeholder="Confirm New PIN"
              className="custom-input" 
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="footer-action">
          <Button 
            onClick={handleSubmit}
            loading={loading}
            style={{ background: '#2c3e50', color: '#fff', borderColor: '#34495e', borderRadius: '3px', fontWeight: 'bold', padding: '0 20px' }}
          >
            Change PIN
          </Button>
        </div>
      </div>
    </div>
  );
}