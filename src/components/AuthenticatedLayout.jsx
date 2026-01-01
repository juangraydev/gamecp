import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Tag, Space, ConfigProvider } from 'antd';
import {
  UserOutlined, TeamOutlined, GiftOutlined, IdcardOutlined,
  GlobalOutlined, LogoutOutlined, DashboardOutlined,
  ThunderboltOutlined, HistoryOutlined, KeyOutlined,
  SearchOutlined, SafetyCertificateOutlined, TrophyOutlined,
  InfoCircleOutlined, FileProtectOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export default function AuthenticatedLayout({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard Overview' },
    {
      key: 'sub1',
      icon: <UserOutlined />,
      label: 'Account',
      children: [
        { key: '/account/pin', icon: <KeyOutlined />, label: 'Change Pin' },
        { key: '/account/password', icon: <SafetyCertificateOutlined />, label: 'Change Password' },
        { key: '/account/fireguard', icon: <ThunderboltOutlined />, label: 'Change Fireguard' },
      ],
    },
    {
      key: 'sub2', icon: <TeamOutlined />, label: 'Characters',
      children: [
        { key: '/characters/search', icon: <SearchOutlined />, label: 'Search' },
        { key: '/characters/logs', icon: <HistoryOutlined />, label: 'Logs' },
      ],
    },
    {
      key: 'sub_quest', icon: <IdcardOutlined />, label: 'Quest Ticket',
      children: [
        { key: '/quest/claim', icon: <FileProtectOutlined />, label: 'Claim Ticket' },
      ],
    },
    {
      key: 'sub4', icon: <GlobalOutlined />, label: 'Server Info',
      children: [
        { key: '/server/status', label: 'Server Status' },
        { key: '/server/banned', label: 'Banned Users' },
        { key: '/server/chipwar', label: 'Chip War History' },
        { key: '/server/leaderboard', icon: <TrophyOutlined />, label: 'Leaderboard' },
      ],
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#2ecc71', colorBgBase: '#050505', colorBgContainer: '#0a0a0a' },
      }}
    >
      <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
        {/* FIXED SIDEBAR */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={260}
          style={{ 
            borderRight: '1px solid #1a1a1a', 
            background: '#0a0a0a',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100
          }}
        >
          <div style={{ height: 60, margin: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.jpg" alt="Logo" style={{ maxHeight: '100%', maxWidth: '80%' }} />
          </div>
          <Menu 
            theme="dark" 
            selectedKeys={[location.pathname]} 
            mode="inline" 
            items={menuItems} 
            onClick={({ key }) => navigate(key)}
            style={{ background: 'transparent' }}
          />
        </Sider>

        {/* MAIN AREA */}
        <Layout 
          style={{ 
            marginLeft: collapsed ? 80 : 260, 
            transition: 'all 0.2s', 
            background: '#000',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* STICKY HEADER */}
          <Header style={{ 
            padding: '0 24px', 
            background: '#0a0a0a', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #1a1a1a',
            flexShrink: 0 // Prevents header from shrinking
          }}>
            <Space>
              <Tag color="#123d24" style={{ color: '#2ecc71', border: '1px solid #2ecc71' }}>ONLINE</Tag>
            </Space>
            <Button type="primary" danger ghost icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
          </Header>

          {/* SCROLLABLE CONTENT AREA */}
          <Content 
            style={{ 
              padding: '24px', 
              overflowY: 'auto', // This allows the dashboard to scroll independently
              background: '#000',
              flex: 1
            }}
          >
            <div style={{ 
              background: '#0a0a0a', 
              borderRadius: '8px', 
              border: '1px solid #1a1a1a',
              minHeight: '100%' // Ensures the black box fills the space
            }}>
              <Outlet /> 
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}