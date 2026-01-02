import React, { useState } from 'react';
import { Input, Card, Row, Col, Tag, Typography, Empty, Spin, message } from 'antd';
import { SearchOutlined, UserOutlined, EnvironmentOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

export default function CharacterSearch() {
    const [loading, setLoading] = useState(false);
    const [character, setCharacter] = useState(null);

    const onSearch = async (value) => {
        if (!value) return;
        
        setLoading(true);
        setCharacter(null);

        try {
            const response = await fetch(`/api/search/${value}`);
            const result = await response.json();

            if (response.ok && result.data) {
                setCharacter(result.data);
            } else {
                message.warning(result.message || "Character not found");
            }
        } catch (error) {
            message.error("Error searching for character");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Title level={2} style={{ color: '#fff' }}>World Search</Title>
                <Text style={{ color: '#888' }}>Find any character currently residing in the Novus Galaxy</Text>
            </div>

            <Search
                placeholder="Enter character name..."
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
                loading={loading}
                prefix={<SearchOutlined />}
                style={{ marginBottom: '30px' }}
            />

            {loading && <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>}

            {!loading && !character && (
                <Empty description={<span style={{ color: '#555' }}>Search for a player to see their public profile</span>} />
            )}

            {character && (
                <Card 
                    style={{ background: '#141414', border: '1px solid #333', borderRadius: '8px' }}
                    bodyStyle={{ padding: '24px' }}
                >
                    <Row gutter={24} align="middle">
                        <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
                            <div style={{ 
                                width: '100px', height: '100px', background: '#1c3d5a', 
                                borderRadius: '50%', margin: '0 auto', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center' 
                            }}>
                                <UserOutlined style={{ fontSize: '50px', color: '#3498db' }} />
                            </div>
                        </Col>
                        <Col xs={24} sm={18}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <Title level={3} style={{ color: '#fff', margin: 0 }}>{character.Name}</Title>
                                    <Tag color="gold" style={{ marginTop: '5px' }}>Level {character.Level}</Tag>
                                </div>
                                <Tag color={character.DCK === 0 ? "green" : "red"}>
                                    {character.DCK === 0 ? "Active" : "Deleted"}
                                </Tag>
                            </div>

                            <Row style={{ marginTop: '20px' }} gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text style={{ color: '#888', display: 'block' }}><TrophyOutlined /> Race / Class</Text>
                                    <Text style={{ color: '#fff' }}>{character.Race} / {character.Class}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ color: '#888', display: 'block' }}><EnvironmentOutlined /> Current Location</Text>
                                    <Text style={{ color: '#fff' }}>Map ID: {character.MapCode}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
    );
}