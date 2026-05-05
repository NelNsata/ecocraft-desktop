import React, { useState, useEffect } from 'react';

// --- Global CSS ---
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  html, body, #root { 
    max-width: 100% !important; 
    width: 100% !important; 
    margin: 0 !important; 
    padding: 0 !important; 
    text-align: left !important; 
  }

  * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
  body { background: #0b0f19; background-image: radial-gradient(circle at top right, #1e293b 0%, #0b0f19 50%); color: #e2e8f0; min-height: 100vh; overflow-x: hidden; }
  
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #475569; }

  .glass-panel { 
    background: rgba(15, 23, 42, 0.6); 
    backdrop-filter: blur(16px); 
    -webkit-backdrop-filter: blur(16px); 
    border: 1px solid rgba(255, 255, 255, 0.05); 
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); 
    border-radius: 16px; 
    padding: 24px;
  }
  
  .pro-input { 
    background: rgba(0, 0, 0, 0.25); 
    border: 1px solid #334155; 
    color: #f8fafc; 
    padding: 10px 14px; 
    border-radius: 8px; 
    transition: all 0.2s ease; 
    outline: none; 
    width: 100%; 
    font-size: 14px;
  }
  .pro-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); background: rgba(0,0,0,0.4); }
  
  .btn { 
    padding: 10px 16px; 
    border-radius: 8px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.2s ease; 
    border: none; 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    gap: 8px; 
    font-size: 14px;
  }
  .btn:active { transform: scale(0.97); }
  
  .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); }
  .btn-primary:hover { box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4); filter: brightness(1.1); }
  
  .btn-success { background: linear-gradient(135deg, #10b981, #059669); color: white; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
  .btn-success:hover { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); filter: brightness(1.1); }
  
  .btn-danger-ghost { background: transparent; color: #ef4444; padding: 6px 10px; }
  .btn-danger-ghost:hover { background: rgba(239, 68, 68, 0.15); border-radius: 6px;}
  
  .sidebar-item { 
    padding: 12px 16px; 
    border-radius: 10px; 
    cursor: pointer; 
    transition: all 0.2s; 
    margin-bottom: 8px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    border: 1px solid transparent; 
    color: #94a3b8;
  }
  .sidebar-item:hover { background: rgba(255,255,255,0.03); color: #f8fafc; }
  .sidebar-item.active { 
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), transparent); 
    border-left: 3px solid #3b82f6; 
    border-right: 1px solid rgba(255,255,255,0.05); 
    border-top: 1px solid rgba(255,255,255,0.05); 
    border-bottom: 1px solid rgba(255,255,255,0.05); 
    color: #fff; 
    font-weight: 600; 
  }
  
  .table-row { border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
  .table-row:hover { background: rgba(255,255,255,0.02); }
  
  .gradient-text { 
    background: linear-gradient(135deg, #38bdf8, #818cf8); 
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent; 
  }
  
  .stat-card {
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }
  
  .ingredient-badge {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  .dashboard-layout {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .sidebar {
    width: 280px;
    flex-shrink: 0;
    background: rgba(15, 23, 42, 0.8);
    border-right: 1px solid rgba(255,255,255,0.05);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    backdrop-filter: blur(10px);
    overflow-y: auto;
    transition: all 0.3s ease;
  }

  .main-content {
    flex: 1;
    padding: 32px 48px;
    overflow-y: auto;
  }

  .content-wrapper {
    width: 100%;
    max-width: 100%; 
  }

  .top-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr; 
    gap: 32px;
    align-items: flex-start;
  }

  @media (max-width: 1200px) {
    .content-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .dashboard-layout { flex-direction: column; height: auto; min-height: 100vh; }
    .sidebar { width: 100%; height: auto; max-height: 350px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .main-content { padding: 20px; }
    .header-actions { flex-direction: column; align-items: flex-start; gap: 16px; }
    .header-actions button { width: 100%; }
  }
`;

export default function UltimateCraftingDashboard() {
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('craftingProData');
    if (saved) return JSON.parse(saved);
    
    return [{
      id: 1,
      name: 'Freedom Community',
      igRate: 200,    
      bmToCash: 10,   
      materials: [
        { id: 'm1', name: 'ปูน 1 ถุง', cost: 5, unit: 'k_ig' },
        { id: 'm2', name: 'ไข่มุกทะเล', cost: 6, unit: 'k_ig' },
        { id: 'm3', name: 'Event Token', cost: 50, unit: 'k_ig' },
        { id: 'm4', name: 'Weapon Box', cost: 35, unit: 'k_ig' },
        { id: 'm5', name: 'ผลึกทะเล', cost: 32, unit: 'thb' },
        { id: 'm6', name: 'Shark Token (1ชิ้น)', cost: 0.01, unit: 'thb' },
        { id: 'm_cash', name: 'เงิน Cash', cost: 1, unit: 'cash' },
        { id: 'm_bm', name: 'Black Money', cost: 1, unit: 'bm' },
      ],
      recipes: [
        { id: 'r1', name: 'Blueprint (วิธี I)', category: 'Pool Cue', chance: 50, ingredients: [{ matId: 'm1', qty: 2 }, { matId: 'm3', qty: 1 }, { matId: 'm_cash', qty: 250000 }] },
        { id: 'r2', name: 'Blueprint (วิธี II)', category: 'Pool Cue', chance: 100, ingredients: [{ matId: 'm1', qty: 5 }, { matId: 'm3', qty: 2 }, { matId: 'm_cash', qty: 500000 }] },
        { id: 'r3', name: 'อัปเกรดขั้น I', category: 'Pool Cue', chance: 70, ingredients: [{ matId: 'm5', qty: 1 }, { matId: 'm4', qty: 4 }, { matId: 'm6', qty: 100 }, { matId: 'm3', qty: 2 }, { matId: 'm_cash', qty: 100000 }] },
        { id: 'r4', name: 'อัปเกรดขั้น II', category: 'Pool Cue', chance: 50, ingredients: [{ matId: 'm5', qty: 2 }, { matId: 'm4', qty: 8 }, { matId: 'm6', qty: 100 }, { matId: 'm3', qty: 2 }, { matId: 'm_cash', qty: 200000 }] },
        { id: 'r5', name: 'อัปเกรดขั้น III', category: 'Pool Cue', chance: 30, ingredients: [{ matId: 'm5', qty: 3 }, { matId: 'm4', qty: 12 }, { matId: 'm6', qty: 300 }, { matId: 'm3', qty: 4 }, { matId: 'm_cash', qty: 300000 }] },
        { id: 'rk1', name: 'สร้าง Knife', category: 'Knife', chance: 100, ingredients: [{ matId: 'm5', qty: 1 }, { matId: 'm4', qty: 5 }, { matId: 'm6', qty: 200 }, { matId: 'm3', qty: 2 }, { matId: 'm_cash', qty: 50000 }] },
        { id: 'rk2', name: 'อัปเกรดขั้น I', category: 'Knife', chance: 70, ingredients: [{ matId: 'm5', qty: 1 }, { matId: 'm4', qty: 5 }, { matId: 'm6', qty: 100 }, { matId: 'm3', qty: 2 }, { matId: 'm_cash', qty: 100000 }] },
        { id: 'rk3', name: 'อัปเกรดขั้น II', category: 'Knife', chance: 50, ingredients: [{ matId: 'm5', qty: 2 }, { matId: 'm4', qty: 10 }, { matId: 'm6', qty: 200 }, { matId: 'm3', qty: 2 }, { matId: 'm_cash', qty: 300000 }] },
        { id: 'rk4', name: 'อัปเกรดขั้น III', category: 'Knife', chance: 30, ingredients: [{ matId: 'm5', qty: 3 }, { matId: 'm4', qty: 20 }, { matId: 'm6', qty: 500 }, { matId: 'm3', qty: 4 }, { matId: 'm_cash', qty: 500000 }] },
        { id: 'ro1', name: 'คราฟต์ผลึกทะเล', category: 'วัตถุดิบอื่นๆ', chance: 50, ingredients: [{ matId: 'm2', qty: 3 }, { matId: 'm1', qty: 10 }, { matId: 'm6', qty: 25 }, { matId: 'm_bm', qty: 2000 }] },
      ]
    }];
  });

  const [activeCityId, setActiveCityId] = useState(cities[0]?.id || null);
  const [isRecipeEditMode, setIsRecipeEditMode] = useState(false);
  const [editingCityId, setEditingCityId] = useState(null);
  const [editCityName, setEditCityName] = useState('');
  
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // --- State สำหรับเครื่องคิดเลขแปลงเงิน ---
  const [calcTHB, setCalcTHB] = useState('');
  const [calcIG, setCalcIG] = useState('');

  const activeCity = cities.find(c => c.id === activeCityId) || cities[0];

  // รีเซ็ตเครื่องคิดเลขเมื่อเปลี่ยนเมืองหรือมีการแก้เรทเงิน (ป้องกันตัวเลขค้างผิดเรท)
  useEffect(() => {
    setCalcTHB('');
    setCalcIG('');
  }, [activeCityId, activeCity?.igRate]);

  useEffect(() => {
    localStorage.setItem('craftingProData', JSON.stringify(cities));
  }, [cities]);

  // ฟังก์ชันคำนวณเงินบาท -> IG
  const handleTHBChange = (val) => {
    setCalcTHB(val);
    if (!val || Number(val) <= 0) { setCalcIG(''); return; }
    const numTHB = Number(val);
    const numIG = numTHB * (1000000 / activeCity.igRate);
    setCalcIG(numIG > 0 ? numIG.toFixed(0) : '');
  };

  // ฟังก์ชันคำนวณ IG -> เงินบาท
  const handleIGChange = (val) => {
    setCalcIG(val);
    if (!val || Number(val) <= 0) { setCalcTHB(''); return; }
    const numIG = Number(val);
    const numTHB = (numIG / 1000000) * activeCity.igRate;
    setCalcTHB(numTHB > 0 ? numTHB.toFixed(2) : '');
  };

  const handleAddCity = () => {
    const newCity = { ...activeCity, id: Date.now(), name: 'New Server' };
    setCities([...cities, newCity]);
    setActiveCityId(newCity.id);
  };

  const handleDeleteCity = (id, e) => {
    e.stopPropagation();
    if (window.confirm('ยืนยันการลบเซิร์ฟเวอร์นี้?')) {
      const newCities = cities.filter(c => c.id !== id);
      setCities(newCities);
      if (activeCityId === id && newCities.length > 0) setActiveCityId(newCities[0].id);
    }
  };

  const startEditCity = (city, e) => {
    e.stopPropagation();
    setEditingCityId(city.id);
    setEditCityName(city.name);
  };

  const saveEditCity = (id) => {
    setCities(cities.map(c => c.id === id ? { ...c, name: editCityName } : c));
    setEditingCityId(null);
  };

  const getUnitMultiplier = (unit) => {
    const thbPerIg = activeCity.igRate / 1000000;
    const thbPerCash = thbPerIg; 
    switch(unit) {
      case 'k_ig': return thbPerIg * 1000;
      case 'ig': return thbPerIg;
      case 'cash': return thbPerCash;
      case 'bm': return thbPerCash * activeCity.bmToCash;
      case 'afkc': return thbPerIg * 1800;
      case 'thb': return 1;
      default: return 0;
    }
  };

  const getMaterialThb = (material) => material.cost * getUnitMultiplier(material.unit);
  const getRecipeTotal = (recipe) => {
    return recipe.ingredients.reduce((sum, ing) => {
      const mat = activeCity.materials.find(m => m.id === ing.matId);
      return sum + (mat ? getMaterialThb(mat) * ing.qty : 0);
    }, 0);
  };

  const updateCity = (updater) => {
    setCities(cities.map(c => c.id === activeCityId ? updater(c) : c));
  };

  const categories = Array.from(new Set(activeCity.recipes.map(r => r.category)));

  const handleAddNewCategory = () => {
    if(newCatName.trim()) {
      updateCity(c => ({...c, recipes: [...c.recipes, { id: `r_${Date.now()}`, name: 'สูตรใหม่', category: newCatName.trim(), chance: 100, ingredients: [] }]}));
      setNewCatName('');
      setShowNewCatInput(false);
    }
  };

  return (
    <>
      <style>{globalStyle}</style>
      <div className="dashboard-layout">
        
        {/* Sidebar */}
        <div className="sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 12px rgba(56,189,248,0.3)', flexShrink: 0 }}>💎</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>EcoCraft Pro</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Dashboard v3.3</div>
            </div>
          </div>
          
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px', flexShrink: 0 }}>Servers</div>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {cities.map(city => (
              <div key={city.id} className={`sidebar-item ${activeCityId === city.id ? 'active' : ''}`} onClick={() => setActiveCityId(city.id)}>
                {editingCityId === city.id ? (
                  <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
                    <input autoFocus className="pro-input" style={{ padding: '6px' }} value={editCityName} onChange={e => setEditCityName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditCity(city.id)} />
                    <button className="btn btn-primary" style={{ padding: '6px 10px' }} onClick={(e) => { e.stopPropagation(); saveEditCity(city.id); }}>✓</button>
                  </div>
                ) : (
                  <>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{city.name}</span>
                    <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                      <button className="btn btn-danger-ghost" style={{ color: '#94a3b8' }} onClick={(e) => startEditCity(city, e)}>✎</button>
                      {cities.length > 1 && <button className="btn btn-danger-ghost" onClick={(e) => handleDeleteCity(city.id, e)}>✕</button>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <button className="btn btn-success" style={{ flexShrink: 0 }} onClick={handleAddCity}>+ Add Server</button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-wrapper">
            
            {/* Header Area */}
            <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h1 className="gradient-text" style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: '700' }}>{activeCity.name}</h1>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px' }}>Dynamic Economy & Recipe Calculator</p>
              </div>
              <button className={isRecipeEditMode ? "btn btn-success" : "btn btn-primary"} onClick={() => setIsRecipeEditMode(!isRecipeEditMode)}>
                {isRecipeEditMode ? '💾 บันทึกและปิดโหมดแก้ไข' : '⚙️ เปิดโหมดปรับแต่งสูตร'}
              </button>
            </div>

            {/* Economy Rates (Top Row) */}
            <div className="top-stats-grid">
              {/* แผง 1: เรทเงิน */}
              <div className="glass-panel stat-card">
                <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>เรทเงินเซิร์ฟเวอร์ (1M IG)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>฿</span>
                  <input type="number" className="pro-input" style={{ fontSize: '20px', fontWeight: 'bold', padding: '4px 10px' }} value={activeCity.igRate} onChange={e => updateCity(c => ({...c, igRate: Number(e.target.value)}))} />
                </div>
              </div>

              {/* แผง 2: ตลาดมืด */}
              <div className="glass-panel stat-card">
                <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>เรทตลาดมืด (1 BM)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>$</span>
                  <input type="number" className="pro-input" style={{ fontSize: '20px', fontWeight: 'bold', padding: '4px 10px' }} value={activeCity.bmToCash} onChange={e => updateCity(c => ({...c, bmToCash: Number(e.target.value)}))} />
                  <span style={{ color: '#64748b', fontSize: '14px' }}>Cash</span>
                </div>
              </div>

              {/* แผง 3: เครื่องคิดเลขแปลงเงิน (ใหม่!) */}
              <div className="glass-panel stat-card" style={{ gridColumn: 'span 1' }}>
                <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  💱 เครื่องคิดเลขแปลงเงิน
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>เงินจริง (บาท)</div>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid #334155', paddingLeft: '10px' }}>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>฿</span>
                      <input type="number" className="pro-input" style={{ border: 'none', background: 'transparent', padding: '8px' }} value={calcTHB} onChange={e => handleTHBChange(e.target.value)} placeholder="0.00" />
                    </div>
                  </div>
                  <div style={{ color: '#475569', marginTop: '16px', fontWeight: 'bold' }}>=</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>เงินในเกม (IG)</div>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid #334155', paddingRight: '10px' }}>
                      <input type="number" className="pro-input" style={{ border: 'none', background: 'transparent', padding: '8px', textAlign: 'right' }} value={calcIG} onChange={e => handleIGChange(e.target.value)} placeholder="0" />
                      <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '12px', marginLeft: '4px' }}>IG</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Main Layout Grid */}
            <div className="content-grid">
              
              {/* Left Column: Materials */}
              <div className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>📦 ฐานข้อมูลวัตถุดิบ</h3>
                  <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => {
                    const newMat = { id: `m_${Date.now()}`, name: 'ไอเทมใหม่', cost: 0, unit: 'k_ig' };
                    updateCity(c => ({...c, materials: [...c.materials, newMat]}));
                  }}>+ เพิ่ม</button>
                </div>

                <div className="table-container">
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>ชื่อวัตถุดิบ</th>
                        <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>ราคา</th>
                        <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'right', color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>฿/หน่วย</th>
                        <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCity.materials.map(mat => (
                        <tr key={mat.id} className="table-row">
                          <td style={{ padding: '8px' }}>
                            <input className="pro-input" style={{ minWidth: '100px' }} value={mat.name} onChange={e => updateCity(c => ({...c, materials: c.materials.map(m => m.id === mat.id ? {...m, name: e.target.value} : m)}))} />
                          </td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              <input type="number" className="pro-input" style={{ width: '70px', padding: '8px 6px' }} value={mat.cost} onChange={e => updateCity(c => ({...c, materials: c.materials.map(m => m.id === mat.id ? {...m, cost: Number(e.target.value)} : m)}))} />
                              <select className="pro-input" style={{ width: '80px', padding: '8px 4px' }} value={mat.unit} onChange={e => updateCity(c => ({...c, materials: c.materials.map(m => m.id === mat.id ? {...m, unit: e.target.value} : m)}))}>
                                <option value="k_ig">k IG</option><option value="ig">IG</option><option value="cash">Cash</option><option value="bm">BM</option><option value="afkc">AFKc</option><option value="thb">฿</option>
                              </select>
                            </div>
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: '#10b981', fontSize: '14px', whiteSpace: 'nowrap' }}>
                            {getMaterialThb(mat).toFixed(2)}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <button className="btn btn-danger-ghost" onClick={() => updateCity(c => ({...c, materials: c.materials.filter(m => m.id !== mat.id)}))}>🗑</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Recipes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {categories.map(cat => (
                  <div key={cat} className="glass-panel">
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#a855f7', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🛠️ {cat}
                    </div>
                    
                    {activeCity.recipes.filter(r => r.category === cat).map(recipe => (
                      <div key={recipe.id} style={{ padding: '16px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
                        
                        {/* View Mode */}
                        {!isRecipeEditMode && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ flex: '1 1 min-content' }}>
                              <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                {recipe.name} <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>{recipe.chance}% Success</span>
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {recipe.ingredients.map((ing, idx) => {
                                  const mat = activeCity.materials.find(m => m.id === ing.matId);
                                  return mat ? <span key={idx} className="ingredient-badge">{mat.name} x{ing.qty.toLocaleString()}</span> : null;
                                })}
                              </div>
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', whiteSpace: 'nowrap' }}>
                              {getRecipeTotal(recipe).toFixed(2)} ฿
                            </div>
                          </div>
                        )}

                        {/* Edit Mode */}
                        {isRecipeEditMode && (
                          <div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                              <input className="pro-input" style={{ flex: '1 1 150px' }} value={recipe.name} onChange={e => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, name: e.target.value} : r)}))} placeholder="Recipe Name" />
                              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', paddingRight: '12px', border: '1px solid #334155', flex: '0 1 120px' }}>
                                <input type="number" className="pro-input" style={{ flex: 1, border: 'none', background: 'transparent' }} value={recipe.chance} onChange={e => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, chance: Number(e.target.value)} : r)}))} placeholder="Chance" />
                                <span style={{ color: '#94a3b8' }}>%</span>
                              </div>
                              <button className="btn btn-danger-ghost" onClick={() => updateCity(c => ({...c, recipes: c.recipes.filter(r => r.id !== recipe.id)}))}>ลบ</button>
                            </div>
                            
                            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '12px', borderRadius: '8px', border: '1px dashed #334155' }}>
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>Ingredients Setup</div>
                              {recipe.ingredients.map((ing, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                  <select className="pro-input" style={{ flex: '1 1 120px' }} value={ing.matId} onChange={e => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, ingredients: r.ingredients.map((i, iIdx) => iIdx === idx ? {...i, matId: e.target.value} : i)} : r)}))}>
                                    {activeCity.materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                  </select>
                                  <input type="number" className="pro-input" style={{ flex: '0 1 80px' }} value={ing.qty} onChange={e => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, ingredients: r.ingredients.map((i, iIdx) => iIdx === idx ? {...i, qty: Number(e.target.value)} : i)} : r)}))} placeholder="Qty" />
                                  <button className="btn btn-danger-ghost" onClick={() => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, ingredients: r.ingredients.filter((_, iIdx) => iIdx !== idx)} : r)}))}>✕</button>
                                </div>
                              ))}
                              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', marginTop: '4px' }} onClick={() => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, ingredients: [...r.ingredients, {matId: activeCity.materials[0]?.id, qty: 1}]} : r)}))}>+ เพิ่มวัตถุดิบ</button>
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                    
                    {isRecipeEditMode && (
                      <button className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px dashed #475569', padding: '12px' }} onClick={() => {
                        const newRecipe = { id: `r_${Date.now()}`, name: 'สูตรใหม่', category: cat, chance: 100, ingredients: [] };
                        updateCity(c => ({...c, recipes: [...c.recipes, newRecipe]}));
                      }}>+ สร้างสูตรใหม่ในหมวดนี้</button>
                    )}
                  </div>
                ))}

                {isRecipeEditMode && (
                  <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', background: 'rgba(255,255,255,0.02)', padding: '24px' }}>
                    {!showNewCatInput ? (
                      <div style={{ width: '100%', textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowNewCatInput(true)}>
                        <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '16px' }}>+ สร้างหมวดหมู่ใหม่</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '500px' }}>
                        <input 
                          autoFocus 
                          className="pro-input" 
                          placeholder="ชื่อหมวดหมู่ใหม่ (เช่น ปืน, ยา)..." 
                          value={newCatName} 
                          onChange={e => setNewCatName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddNewCategory()}
                        />
                        <button className="btn btn-success" onClick={handleAddNewCategory}>บันทึก</button>
                        <button className="btn btn-danger-ghost" onClick={() => { setShowNewCatInput(false); setNewCatName(''); }}>ยกเลิก</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}