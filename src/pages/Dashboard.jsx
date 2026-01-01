import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Tag, 
  Collapse, 
  Divider, 
  Badge 
} from 'antd';
import { 
  WalletOutlined, 
  LineChartOutlined, 
  ClockCircleOutlined, 
  InfoCircleOutlined, 
  ThunderboltOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;

export default function Dashboard() {
  const [warVisible, setWarVisible] = useState(true);
  const [ecoVisible, setEcoVisible] = useState(true);
  const [activeChar, setActiveChar] = useState('BossW');

  const ToggleBtn = ({ isActive, onClick }) => (
    <Tag 
      color={isActive ? "#2ecc71" : "#333"} 
      onClick={onClick}
      style={{ cursor: 'pointer', margin: 0, fontWeight: 'bold', width: '22px', textAlign: 'center' }}
    >
      {isActive ? '-' : '+'}
    </Tag>
  );

  return (
    <div style={{ maxWidth: '1920px', margin: '0 auto', color: '#fff', padding: '20px' }}>
      
      {/* Page Title */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', letterSpacing: '2px', marginBottom: '5px' }}>
          Account Information
        </h1>
        <div style={{ width: '120px', height: '3px', background: '#ff4d4f', margin: '0 auto' }} />
      </div>

      <Row gutter={[20, 20]}>
        
        {/* LEFT COLUMN */}
        <Col xs={24} lg={8}>
          {/* Welcome Card */}
          <Card style={{ background: '#224a70', border: 'none', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', margin: 0 }}>Welcome wulf15!</h2>
            <div style={{ color: '#bae7ff', fontSize: '12px', marginTop: '10px' }}>
              <p style={{ margin: '4px 0' }}><ClockCircleOutlined /> Last login: Thu, 10 Jul 2025 04:27 PM</p>
              <p style={{ margin: '4px 0' }}><InfoCircleOutlined /> IP Address: 172.69.184.135</p>
            </div>
          </Card>

          {/* Billing Information Card - SWAPPED TO LEFT */}
          <Card 
             title={<span style={{ color: '#fff' }}><WalletOutlined style={{ marginRight: '8px' }} />Billing Information</span>}
             style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', marginBottom: '20px' }}
             bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>GP</span>
                  <span style={{ fontSize: '32px', fontWeight: '900', lineHeight: '1' }}>0</span>
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginLeft: '32px' }}>Game Points</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DatabaseOutlined style={{ fontSize: '22px' }} />
                  <span style={{ fontSize: '32px', fontWeight: '900', lineHeight: '1' }}>0</span>
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginLeft: '32px' }}>Cash Coin</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ClockCircleOutlined style={{ fontSize: '20px' }} />
                  <Tag color="#d32f2f" style={{ border: 'none', fontWeight: 'bold', padding: '2px 10px', borderRadius: '4px', margin: 0 }}>
                    Expired
                  </Tag>
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px', marginLeft: '30px' }}>Premium Service</div>
              </div>
            </div>
          </Card>

          {/* Character Management Card */}
          <Card style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }} bodyStyle={{ padding: '0' }}>
            <div style={{ display: 'flex', background: '#050505' }}>
              {['BossW', 'MissW', 'MissM'].map(name => (
                <div 
                  key={name}
                  onClick={() => setActiveChar(name)}
                  style={{ 
                    flex: 1, padding: '12px', textAlign: 'center', cursor: 'pointer',
                    background: activeChar === name ? '#1c3d5a' : 'transparent'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{name}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '20px' }}>
              <Row>
                <Col span={8}>
                  <div style={{ fontSize: '12px', color: '#888' }}>Level</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold' }}>49</div>
                </Col>
                <Col span={16}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>HP <span style={{ color: '#ff4d4f' }}>10612</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>FP <span style={{ color: '#1890ff' }}>444</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>SP <span style={{ color: '#faad14' }}>1654</span></div>
                </Col>
              </Row>
              <Divider style={{ margin: '12px 0', borderColor: '#222' }} />
              <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: '#050505', padding: '8px' }}>
                {[...Array(16)].map((_, i) => (<div key={i} style={{ aspectRatio: '1/1', background: '#111', border: '1px solid #222' }}></div>))}
              </div>
            </div>
          </Card>
        </Col>

        {/* RIGHT COLUMN */}
        <Col xs={24} lg={16}>
          
          {/* War Battle Statistics Card - SWAPPED TO RIGHT */}
          <Card 
            title={<span style={{ color: '#fff' }}><ThunderboltOutlined style={{ marginRight: '8px' }} />War Battle Statistics</span>}
            extra={<ToggleBtn isActive={warVisible} onClick={() => setWarVisible(!warVisible)} />}
            style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', marginBottom: '20px' }}
            bodyStyle={{ display: warVisible ? 'block' : 'none', padding: '24px' }}
          >
            <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ width: '160px', height: '160px', border: '1px dashed #333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#444' }}>Radar Chart</span>
               </div>
            </div>
          </Card>

          {/* Economy History Card */}
          <Card 
             title={<span style={{ color: '#fff' }}><LineChartOutlined style={{ marginRight: '8px' }} />Economy History</span>}
             extra={<ToggleBtn isActive={ecoVisible} onClick={() => setEcoVisible(!ecoVisible)} />}
             style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', marginBottom: '20px' }}
             bodyStyle={{ display: ecoVisible ? 'block' : 'none', padding: '24px' }}
          >
            <div style={{ background: '#141414', padding: '10px', borderRadius: '4px', fontSize: '11px', textAlign: 'center', marginBottom: '15px' }}>
               GOLD EXCHANGE RATES & TAX RATES
            </div>
            <div style={{ height: '180px', border: '1px dashed #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <p style={{ color: '#444' }}>[ Economic Line Chart ]</p>
            </div>
          </Card>

          <Collapse expandIconPosition="right" ghost style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
            <Panel header="UPDATE: Return Of The Lord Master 1/22/25" key="1" style={{ borderBottom: '1px solid #1a1a1a' }} />
            <Panel header="NOTICE [PATCH LOGS] 02/20/2024" key="2" />
          </Collapse>

        </Col>
      </Row>
    </div>
  );
}