import React, { useState } from 'react';
import { Button, Input, Select, Form, ConfigProvider, theme, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const result = await response.json();

      // Check against our Standard Return format
      if (response.ok && result.status === 200) {
        message.success(result.message);
        
        // Save user data (excluding sensitive info) to local storage if needed
        localStorage.setItem('rf_user', JSON.stringify(result.data));
        
        onLogin(); // Update parent auth state
        navigate("/dashboard");
      } else {
        // Handle 401 Unauthorized or other errors
        message.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login Error:', error);
      message.error("Connection failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="login-card">
        
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <img 
            src="/logo.jpg" 
            alt="RF Online Logo" 
            style={{ 
              width: '80%', 
              maxWidth: '180px', 
              height: 'auto',
              display: 'block',
              margin: '0 auto' 
            }}
          />
        </div>

        <Form onFinish={handleLogin} layout="vertical" requiredMark={false}>
          {/* Username */}
          <div className="rf-input-wrapper">
            <label className="rf-label">Username</label>
            <Form.Item 
              name="username" 
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input 
                variant="borderless" 
                placeholder="wulf15" 
                prefix={<UserOutlined style={{ color: '#888', fontSize: '12px' }} />}
                style={{ color: '#333', padding: '0px' }} 
              />
            </Form.Item>
          </div>

          {/* Password */}
          <div className="rf-input-wrapper">
            <label className="rf-label">Password</label>
            <Form.Item 
              name="password" 
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password 
                variant="borderless" 
                placeholder="••••••••" 
                prefix={<LockOutlined style={{ color: '#888', fontSize: '12px' }} />}
                style={{ color: '#333', padding: '0px' }} 
              />
            </Form.Item>
          </div>

          {/* Server Selection */}
          <div className="rf-input-wrapper">
            <label className="rf-label">Server Selection</label>
            <Form.Item name="server" initialValue="Nexus" style={{ margin: 0 }}>
              <Select 
                variant="borderless" 
                style={{ width: '100%', height: '24px' }} 
                dropdownStyle={{ backgroundColor: '#fff' }}
              >
                <Select.Option value="Nexus">
                   <span style={{ color: '#333', fontWeight: 'bold', fontSize: '13px' }}>RF Online Nexus</span>
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* Buttons Row */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', marginTop: '20px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                flex: 2, 
                height: '42px', 
                backgroundColor: '#3498db', 
                fontWeight: 'bold' 
              }}
            >
              ➜ Login
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              style={{ 
                flex: 1, 
                height: '42px', 
                color: '#2ecc71', 
                borderColor: '#2ecc71', 
                fontWeight: 'bold',
                backgroundColor: 'transparent'
              }}
            >
              Register
            </Button>
          </div>
        </Form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <a href="#" style={{ color: '#2ecc71', fontSize: '12px' }}>🔒 Recover Password</a>
          <a href="#" style={{ color: '#2ecc71', fontSize: '12px' }}>🔥 Recover FireGuard</a>
        </div>
      </div>
    </ConfigProvider>
  );
}