import React, { useState } from 'react';
import { Button, Input, Form, ConfigProvider, theme, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowLeftOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // New: Loading state

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // Connect to the secure /api/auth/register endpoint we created
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          email: values.email,
          pin: values.pin
        }),
      });

      const result = await response.json();

      // Using your Standard Return { status, message, data }
      if (response.ok && result.status === 200) {
        message.success(result.message || "Account created successfully!");
        navigate("/login");
      } else {
        // Handle 409 (Conflict) or 400 (Validation) from backend
        message.error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error('Connection Error:', error);
      message.error("Cannot connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="login-card">
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src="/logo.jpg" 
            alt="RF Online Logo" 
            style={{ width: '80%', maxWidth: '150px', height: 'auto', display: 'block', margin: '0 auto' }}
          />
          <h2 style={{ color: '#2ecc71', marginTop: '10px', fontSize: '18px', letterSpacing: '1px' }}>CREATE ACCOUNT</h2>
        </div>

        <Form form={form} onFinish={handleRegister} layout="vertical" requiredMark={false}>
          
          {/* Username: 4-12 characters */}
          <div className="rf-input-wrapper">
            <label className="rf-label">Username (4-12 characters)</label>
            <Form.Item 
              name="username" 
              style={{ margin: 0 }}
              rules={[
                { required: true, message: 'Username is required' },
                { min: 4, message: 'Minimum 4 characters' },
                { max: 12, message: 'Maximum 12 characters' },
                { pattern: /^[a-zA-Z0-9]+$/, message: 'Alphanumeric only (No spaces)' }
              ]}
            >
              <Input 
                variant="borderless" 
                placeholder="Enter Username" 
                prefix={<UserOutlined style={{ color: '#888', fontSize: '12px' }} />} 
                style={{ color: '#333', padding: '0px' }} 
              />
            </Form.Item>
          </div>

          {/* Email: Email Format */}
          <div className="rf-input-wrapper">
            <label className="rf-label">Email Address</label>
            <Form.Item 
              name="email" 
              style={{ margin: 0 }}
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                variant="borderless" 
                placeholder="example@mail.com" 
                prefix={<MailOutlined style={{ color: '#888', fontSize: '12px' }} />} 
                style={{ color: '#333', padding: '0px' }} 
              />
            </Form.Item>
          </div>

          {/* Password: 4-12 characters */}
          <div className="rf-input-wrapper">
            <label className="rf-label">Password (4-12 characters)</label>
            <Form.Item 
              name="password" 
              style={{ margin: 0 }}
              rules={[
                { required: true, message: 'Password is required' },
                { min: 4, message: 'Minimum 4 characters' },
                { max: 12, message: 'Maximum 12 characters' }
              ]}
            >
              <Input.Password 
                variant="borderless" 
                placeholder="••••••••" 
                prefix={<LockOutlined style={{ color: '#888', fontSize: '12px' }} />} 
                style={{ color: '#333', padding: '0px' }} 
              />
            </Form.Item>
          </div>

          {/* Confirm Password */}
          <div className="rf-input-wrapper">
            <label className="rf-label">Confirm Password</label>
            <Form.Item 
              name="confirm" 
              dependencies={['password']}
              style={{ margin: 0 }}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                variant="borderless" 
                placeholder="••••••••" 
                prefix={<LockOutlined style={{ color: '#888', fontSize: '12px' }} />} 
                style={{ color: '#333', padding: '0px' }} 
              />
            </Form.Item>
          </div>

          {/* Pin: 6 digits */}
          <div className="rf-input-wrapper">
            <label className="rf-label">Security PIN (6 Digits)</label>
            <Form.Item 
              name="pin" 
              style={{ margin: 0 }}
              rules={[
                { required: true, message: '6-digit PIN is required' },
                { pattern: /^\d{6}$/, message: 'Must be exactly 6 digits' }
              ]}
            >
              <Input 
                variant="borderless" 
                maxLength={6} 
                placeholder="123456" 
                prefix={<SafetyOutlined style={{ color: '#888', fontSize: '12px' }} />} 
                style={{ color: '#333', padding: '0px' }} 
              />
            </Form.Item>
          </div>

          {/* Agreement Checkbox */}
          <Form.Item 
            name="agreement" 
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) => 
                  value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms')) 
              }
            ]}
          >
            <Checkbox style={{ color: '#888', fontSize: '12px' }}>
              I agree to the <span style={{ color: '#2ecc71', cursor: 'pointer' }}>Terms & Privacy Policy</span>.
            </Checkbox>
          </Form.Item>

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} // New: Visual feedback for registration
              style={{ flex: 2, height: '42px', backgroundColor: '#2ecc71', borderColor: '#2ecc71', fontWeight: 'bold' }}
            >
              Create Account
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              icon={<ArrowLeftOutlined />} 
              style={{ flex: 1, height: '42px', color: '#888', borderColor: '#333', fontWeight: 'bold', backgroundColor: 'transparent' }}
            >
              Back
            </Button>
          </div>
        </Form>
      </div>
    </ConfigProvider>
  );
}