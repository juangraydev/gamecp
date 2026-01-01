import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Collapse, Divider, message, Skeleton } from 'antd';
import { 
  WalletOutlined, LineChartOutlined, ClockCircleOutlined, 
  InfoCircleOutlined, ThunderboltOutlined, DatabaseOutlined 
} from '@ant-design/icons';

const { Panel } = Collapse;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeChar, setActiveChar] = useState(null);

  // States for UI toggles
  const [warVisible, setWarVisible] = useState(true);
  const [ecoVisible, setEcoVisible] = useState(true);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      // We get the username from localStorage (set during login)
      const user = JSON.parse(localStorage.getItem('rf_user'));
      if (!user) return;

      const response = await fetch(`/api/auth/account-info/${user.username}`);
      const result = await response.json();

      if (result.status === 200) {
        setData(result.data);
        // Set the first character as active by default if they exist
        if (result.data.characters && result.data.characters.length > 0) {
          setActiveChar(result.data.characters[0]);
        }
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '50px' }}><Skeleton active /></div>;
  if (!data) return <div style={{ color: '#fff' }}>No account data found.</div>;

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
        <Col xs={24} md={24} lg={24} xl={12} xxl={8}>
          
          {/* Welcome Card - Dynamic Data */}
          <Card style={{ background: '#224a70', border: 'none', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', margin: 0 }}>Welcome {data.username}!</h2>
            <div style={{ color: '#bae7ff', fontSize: '12px', marginTop: '10px' }}>
              <p style={{ margin: '4px 0' }}>
                <ClockCircleOutlined /> Last login: {data.last_login ? new Date(data.last_login).toLocaleString() : 'N/A'}
              </p>
              <p style={{ margin: '4px 0' }}>
                <InfoCircleOutlined /> IP Address: {data.ip_address || '0.0.0.0'}
              </p>
            </div>
          </Card>

          {/* Billing Card - Dynamic Data */}
          <Card 
             title={<span style={{ color: '#fff' }}><WalletOutlined style={{ marginRight: '8px' }} />Billing Information</span>}
             style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', marginBottom: '20px' }}
             bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>GP</span>
                  <span style={{ fontSize: '32px', fontWeight: '900', lineHeight: '1' }}>{data.game_point}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginLeft: '32px' }}>Game Points</div>
              </div>

              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DatabaseOutlined style={{ fontSize: '22px' }} />
                  <span style={{ fontSize: '32px', fontWeight: '900', lineHeight: '1' }}>{data.cash_coin}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginLeft: '32px' }}>Cash Coin</div>
              </div>

              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ClockCircleOutlined style={{ fontSize: '20px' }} />
                  <Tag color={data.status === 'Active' ? "#2ecc71" : "#d32f2f"} style={{ border: 'none', fontWeight: 'bold', padding: '2px 10px', borderRadius: '4px', margin: 0 }}>
                    {data.status}
                  </Tag>
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px', marginLeft: '30px' }}>Premium Service</div>
              </div>
            </div>
          </Card>

          {/* Character Management Card - Mapped from tbl_base */}
          <Card style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }} bodyStyle={{ padding: '0' }}>
            <div style={{ display: 'flex', background: '#050505', overflowX: 'auto' }}>
              {data.characters.map(char => (
                <div 
                  key={char.Serial}
                  onClick={() => setActiveChar(char)}
                  style={{ 
                    flex: 1, minWidth: '100px', padding: '12px', textAlign: 'center', cursor: 'pointer',
                    background: activeChar?.Serial === char.Serial ? '#1c3d5a' : 'transparent',
                    borderRight: '1px solid #1a1a1a'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{char.Name}</div>
                </div>
              ))}
            </div>
            
            {activeChar && (
              <div style={{ padding: '20px' }}>
                <Row>
                  <Col span={8}>
                    <div style={{ fontSize: '12px', color: '#888' }}>Level</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{activeChar.Level}</div>
                  </Col>
                  <Col span={16}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>Class <span style={{ color: '#2ecc71' }}>{activeChar.Class}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>Serial <span style={{ color: '#888' }}>#{activeChar.Serial}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>Last Play <span style={{ color: '#faad14' }}>{new Date(activeChar.LastConnTime).toLocaleDateString()}</span></div>
                  </Col>
                </Row>
                <Divider style={{ margin: '12px 0', borderColor: '#222' }} />
                <div style={{ background: '#050505', padding: '10px', borderRadius: '4px' }}>
                    <small style={{ color: '#555' }}>Character is currently <b>{data.status === 'Active' ? 'Online' : 'Offline'}</b></small>
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* RIGHT COLUMN - Stats and Charts */}
        <Col xs={24} md={24} lg={24} xl={12} xxl={16}>
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
            <Panel header="UPDATE: Return Of The Lord Master" key="1" style={{ borderBottom: '1px solid #1a1a1a' }} />
            <Panel header="NOTICE [PATCH LOGS] 2026" key="2" />
          </Collapse>
        </Col>
      </Row>
    </div>
  );
}