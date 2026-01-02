import React, { useState } from 'react';
import { Input, Button, message, Table, Tabs, Skeleton } from 'antd';

export default function CharacterSearch() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [characterData, setCharacterData] = useState(null);

  const handleSearch = async () => {
    if (!name.trim()) return message.warning("Please enter a character name");
    
    setLoading(true);
    setCharacterData(null);

    try {
      // 1. Call the single modular endpoint
      const response = await axios.post('/api/character-search', { 
        characterName: name.trim() 
      });

      if (response.data.status === 200) {
        const { info, equipment, inventory, bank } = response.data.data;

        // 2. Map API data to your UI structure
        const mappedData = {
          profile: {
            name: info.Name,
            race: info.Race === 0 ? 'Bellato' : info.Race === 1 ? 'Cora' : 'Accretia',
            level: info.Level,
            money: info.Dalant?.toLocaleString(),
            bankMoney: bank?.Dalant?.toLocaleString() || "0",
            cp: info.Gold?.toLocaleString(), // Often used for CP in custom servers
            baseClass: info.BaseClass,
            job1: info.Job1,
            job2: info.Job2,
            gold: info.Gold?.toLocaleString(),
            bankGold: bank?.Gold?.toLocaleString() || "0",
            pvp: info.pvp_point?.toLocaleString() || "0"
          },
          // Mapping Equipment from the module
          equipment: [
            { label: 'Head', item: equipment.Head?.item_name || 'No Item', upgrades: formatUpgrades(equipment.Head?.upgrade) },
            { label: 'Upper', item: equipment.Upper?.item_name || 'No Item', upgrades: formatUpgrades(equipment.Upper?.upgrade) },
            { label: 'Lower', item: equipment.Lower?.item_name || 'No Item', upgrades: formatUpgrades(equipment.Lower?.upgrade) },
            { label: 'Gloves', item: equipment.Gloves?.item_name || 'No Item', upgrades: formatUpgrades(equipment.Gloves?.upgrade) },
            { label: 'Shoes', item: equipment.Shoes?.item_name || 'No Item', upgrades: formatUpgrades(equipment.Shoes?.upgrade) },
            { label: 'Weapon', item: equipment.Weapon?.item_name || 'No Item', upgrades: formatUpgrades(equipment.Weapon?.upgrade) },
            { label: 'Shield', item: equipment.Shield?.item_name || 'No Item', upgrades: formatUpgrades(equipment.Shield?.upgrade) },
            { label: 'Cloak', item: equipment.Cloak?.item_name || 'No Item', upgrades: formatUpgrades(equipment.Cloak?.upgrade) },
          ],
          accessories: [
            { label1: 'Ring', item1: equipment.Ring1?.item_name || 'No Item', label2: 'Ring', item2: equipment.Ring2?.item_name || 'No Item' },
            { label1: 'Amulet', item1: equipment.Amulet1?.item_name || 'No Item', label2: 'Amulet', item2: equipment.Amulet2?.item_name || 'No Item' },
            { label1: 'Ammo', item1: equipment.Ammo1?.item_name || 'No Item', label2: 'Ammo', item2: equipment.Ammo2?.item_name || 'No Item' },
          ],
          inventory: inventory.map((item, idx) => ({
            key: idx,
            slot: item.slot + 1,
            name: item.name,
            amount: item.qty || 1,
            upgrades: formatUpgrades(item.upgrade)
          })),
          bankItems: bank.items ? bank.items.map((item, idx) => ({
            key: idx,
            slot: item.slot + 1,
            name: item.name,
            amount: item.qty || 1,
            upgrades: formatUpgrades(item.upgrade)
          })) : []
        };

        setCharacterData(mappedData);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Character not found";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- 1. Top Character Information Table (Strictly Ordered Left/Right) ---
  const renderProfileTable = () => (
    <div className="game-table-wrapper" style={{ marginBottom: '20px' }}>
      <div className="blue-header-strip" style={{ paddingLeft: '15px', display: 'flex', alignItems: 'center', color: '#fff', fontWeight: 'bold' }}>
        Character Information
      </div>
      <table className="equipment-grid">
        <tbody>
          <tr>
            <td className="cell-label cell-width-fixed">Name</td>
            <td className="cell-content">{characterData.profile.name}</td>
            <td className="cell-label cell-width-fixed">Base Class</td>
            <td className="cell-content">{characterData.profile.baseClass}</td>
          </tr>
          <tr>
            <td className="cell-label">Race</td>
            <td className="cell-content">{characterData.profile.race}</td>
            <td className="cell-label">1st Job Class</td>
            <td className="cell-content">{characterData.profile.job1}</td>
          </tr>
          <tr>
            <td className="cell-label">Level</td>
            <td className="cell-content">{characterData.profile.level}</td>
            <td className="cell-label">2nd Job Class</td>
            <td className="cell-content">{characterData.profile.job2}</td>
          </tr>
          <tr>
            <td className="cell-label">Money</td>
            <td className="cell-content">{characterData.profile.money}</td>
            <td className="cell-label">Gold</td>
            <td className="cell-content">{characterData.profile.gold}</td>
          </tr>
          <tr>
            <td className="cell-label">Bank Money</td>
            <td className="cell-content">{characterData.profile.bankMoney}</td>
            <td className="cell-label">Bank Gold</td>
            <td className="cell-content">{characterData.profile.bankGold}</td>
          </tr>
          <tr>
            <td className="cell-label">Contribute Points</td>
            <td className="cell-content">{characterData.profile.cp}</td>
            <td className="cell-label">PvP Points</td>
            <td className="cell-content">{characterData.profile.pvp}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // --- 2. Equipment Table ---
  const renderEquipmentTable = () => (
    <div className="game-table-wrapper">
      <div className="blue-header-strip" />
      <table className="equipment-grid">
        <tbody>
          {characterData.equipment.map((row, i) => (
            <tr key={i}>
              <td className="cell-label cell-width-fixed">{row.label}</td>
              <td className="cell-content cell-width-main">{row.item}</td>
              <td className="cell-content cell-width-upgrades" colSpan="2">{row.upgrades}</td>
            </tr>
          ))}
          {characterData.accessories.map((row, i) => (
            <tr key={i}>
              <td className="cell-label cell-width-fixed">{row.label1}</td>
              <td className="cell-content cell-width-accessory">{row.item1}</td>
              <td className="cell-label cell-width-fixed">{row.label2}</td>
              <td className="cell-content cell-width-accessory">{row.item2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const inventoryColumns = [
    { title: '#', dataIndex: 'slot', key: 'slot', width: '50px', align: 'center' },
    { title: 'Item Name', dataIndex: 'name', key: 'name' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: '80px', align: 'center' },
    { title: 'Upgrades', dataIndex: 'upgrades', key: 'upgrades', width: '150px', align: 'center' },
  ];

  const tabItems = characterData ? [
    { key: '1', label: 'Equipment', children: renderEquipmentTable() },
    { key: '2', label: 'Inventory', children: (
      <div className="game-table-wrapper">
        <Table dataSource={characterData.inventory} columns={inventoryColumns} pagination={false} size="small" bordered className="inventory-table" />
      </div>
    )},
    { key: '3', label: 'Bank', children: (
        <div className="game-table-wrapper">
          <Table dataSource={characterData.inventory} columns={inventoryColumns} pagination={false} size="small" bordered className="inventory-table" />
        </div>
      )},
  ] : [];

  return (
    <div style={{ padding: '20px 20px', background: '#000', minHeight: '100vh' }}>
      <style>{`
        .ant-tabs-nav::before { border-bottom: 1px solid #333 !important; }
        .ant-tabs-tab { color: #888 !important; padding: 12px 20px !important; margin: 0 !important; }
        .ant-tabs-tab-active .ant-tabs-tab-btn { color: #3498db !important; }
        .ant-tabs-ink-bar { background: #3498db !important; height: 3px !important; }

        .game-table-wrapper { border: 1px solid #333; background: #0a0a0a; overflow: hidden; }
        .blue-header-strip { background: #3498db; height: 35px; width: 100%; border-bottom: 1px solid #333; }

        .equipment-grid { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .equipment-grid td { border: 1px solid #1a1a1a; padding: 10px 15px; font-size: 13px; color: #fff; vertical-align: middle; }
        
        .cell-label { background: #050505; color: #fff !important; font-weight: bold; }
        .cell-content { background: #0a0a0a; }

        .cell-width-fixed { width: 180px; }
        .cell-width-main { width: 400px; }
        .cell-width-upgrades { width: auto; }
        .cell-width-accessory { width: auto; }

        .inventory-table .ant-table { background: transparent !important; }
        .inventory-table .ant-table-thead > tr > th { 
          background: #3498db !important; 
          color: #fff !important; 
          border-radius: 0 !important; 
          border: 1px solid #333 !important;
          font-weight: bold;
        }
        .inventory-table .ant-table-tbody > tr > td { background: #0a0a0a !important; color: #fff !important; border: 1px solid #1a1a1a !important; }
      `}</style>

      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', textTransform: 'uppercase', borderBottom: '2px solid #ff4d4f', display: 'inline-block', padding: '0 10px 5px' }}>
          Character Search
        </h1>
      </div>

      {/* Search Input Box */}
      <div style={{ border: '1px solid #333', background: '#0a0a0a', width: '100%', marginBottom: '20px' }}>
        <div style={{ background: '#3498db', color: '#fff', padding: '10px 15px', fontWeight: 'bold' }}>Search Character Equipment</div>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #333' }}>
          <div style={{ width: '300px', color: '#fff', padding: '12px 15px', borderRight: '1px solid #333', fontWeight: 'bold' }}>Charcter Name:</div>
          <div style={{ flexGrow: 1, padding: '0 15px' }}>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              onPressEnter={handleSearch} 
              style={{ borderRadius: '0', background: '#fff', color: '#000', border: 'none', height: '30px', width: '100%', fontWeight: 'bold' }} 
            />
          </div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '12px 15px' }}>
          <Button onClick={handleSearch} loading={loading} style={{ background: '#2c3e50', color: '#fff', borderColor: '#34495e', borderRadius: '3px', fontWeight: 'bold' }}>Search</Button>
        </div>
      </div>

      {/* Profile Section & Tabs */}
      {loading && <Skeleton active paragraph={{ rows: 10 }} style={{ background: '#0a0a0a', padding: '20px' }} />}
      
      {characterData && !loading && (
        <>
          {renderProfileTable()}
          <Tabs defaultActiveKey="1" items={tabItems} />
        </>
      )}
    </div>
  );
}