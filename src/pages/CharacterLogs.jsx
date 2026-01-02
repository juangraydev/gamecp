import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Collapse, Divider, message, Skeleton } from 'antd';
import { 
  WalletOutlined, LineChartOutlined, ClockCircleOutlined, 
  InfoCircleOutlined, ThunderboltOutlined, DatabaseOutlined 
} from '@ant-design/icons';

const { Panel } = Collapse;

export default function Dashboard() {
  return (
    <div style={{ maxWidth: '1920px', margin: '0 auto', color: '#fff', padding: '20px' }}>
      
      {/* Page Title */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', letterSpacing: '2px', marginBottom: '5px' }}>
          Character History Logs
        </h1>
        <div style={{ width: '120px', height: '3px', background: '#ff4d4f', margin: '0 auto' }} />
      </div>

    </div>
  );
}