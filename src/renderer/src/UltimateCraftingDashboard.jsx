import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase'; 

// --- Global CSS ---
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  html, body, #root { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }
  * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
  body { background: #0b0f19; background-image: radial-gradient(circle at top right, #1e293b 0%, #0b0f19 50%); color: #e2e8f0; min-height: 100vh; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #475569; }
  .glass-panel { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); border-radius: 16px; padding: 24px; }
  .pro-input { background: rgba(0, 0, 0, 0.25); border: 1px solid #334155; color: #f8fafc; padding: 10px 14px; border-radius: 8px; transition: all 0.2s ease; outline: none; width: 100%; font-size: 14px; }
  .pro-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); background: rgba(0,0,0,0.4); }
  .btn { padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; }
  .btn:active { transform: scale(0.97); }
  .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); }
  .btn-primary:hover { box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4); filter: brightness(1.1); }
  .btn-success { background: linear-gradient(135deg, #10b981, #059669); color: white; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
  .btn-success:hover { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); filter: brightness(1.1); }
  .btn-danger-ghost { background: transparent; color: #ef4444; padding: 6px 10px; }
  .btn-danger-ghost:hover { background: rgba(239, 68, 68, 0.15); border-radius: 6px;}
  .sidebar-item { padding: 12px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid transparent; color: #94a3b8; }
  .sidebar-item:hover { background: rgba(255,255,255,0.03); color: #f8fafc; }
  .sidebar-item.active { background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), transparent); border-left: 3px solid #3b82f6; border-right: 1px solid rgba(255,255,255,0.05); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff; font-weight: 600; }
  .table-row { border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
  .table-row:hover { background: rgba(255,255,255,0.02); }
  .gradient-text { background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-card { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
  .ingredient-badge { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: #93c5fd; padding: 4px 10px; border-radius: 20px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; }
  .dashboard-layout { display: flex; width: 100%; height: 100vh; overflow: hidden; }
  .sidebar { width: 280px; flex-shrink: 0; background: rgba(15, 23, 42, 0.8); border-right: 1px solid rgba(255,255,255,0.05); padding: 24px; display: flex; flex-direction: column; gap: 16px; backdrop-filter: blur(10px); overflow-y: auto; transition: all 0.3s ease; }
  .main-content { flex: 1; padding: 32px 48px; overflow-y: auto; }
  .content-wrapper { width: 100%; max-width: 100%; }
  .top-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px; }
  .content-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 32px; align-items: flex-start; }
`;

const defaultData = [{
  id: 1, name: 'Freedom Community', igRate: 200, bmToCash: 10,   
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
    { id: 'rk1', name: 'สร้าง Knife', category: 'Knife', chance: 100, ingredients: [{ matId: 'm5', qty: 1 }, { matId: 'm4', qty: 5 }, { matId: 'm6', qty: 200 }, { matId: 'm3', qty: 2 }, { matId: 'm_cash', qty: 50000 }] },
  ]
}];

export default function UltimateCraftingDashboard() {
  const [cities, setCities] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCityId, setActiveCityId] = useState(null);
  
  const [isRecipeEditMode, setIsRecipeEditMode] = useState(false);
  const [editingCityId, setEditingCityId] = useState(null);
  const [editCityName, setEditCityName] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [calcTHB, setCalcTHB] = useState('');
  const [calcIG, setCalcIG] = useState('');

  // 1. ดึงและฟังการอัปเดตข้อมูลแบบ Real-time
  useEffect(() => {
    const docRef = doc(db, 'serverData', 'mainConfig');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data().cities;
        setCities(data);
        if (!activeCityId && data.length > 0) setActiveCityId(data[0].id);
      } else {
        setDoc(docRef, { cities: defaultData });
        setCities(defaultData);
        setActiveCityId(defaultData[0].id);
      }
      setIsLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  const activeCity = cities.find(c => c.id === activeCityId) || cities[0];

  useEffect(() => {
    setCalcTHB(''); setCalcIG('');
  }, [activeCityId, activeCity?.igRate]);

  // 2. ฟังก์ชันยิงข้อมูลขึ้น Cloud
  const syncToCloud = (newCitiesData) => {
    setCities(newCitiesData);
    setDoc(doc(db, 'serverData', 'mainConfig'), { cities: newCitiesData }, { merge: true });
  };

  // --- 🆕 ฟังก์ชันดึงข้อมูลเก่าจาก Local Storage ---
  const handleMigrateOldData = () => {
    const saved = localStorage.getItem('craftingProData'); // ดึงข้อมูลที่เคยเซฟไว้ในเครื่อง
    if (saved) {
      const localData = JSON.parse(saved);
      if (window.confirm('พบข้อมูลเก่าในเครื่องนี้! ต้องการอัปโหลดขึ้น Cloud เพื่อทับข้อมูลปัจจุบันและแชร์กับทุกคนไหม?')) {
        syncToCloud(localData);
        alert('✅ ดึงข้อมูลเก่าขึ้น Cloud สำเร็จแล้ว!');
      }
    } else {
      alert('❌ ไม่พบข้อมูลเก่าที่บันทึกไว้ในเครื่องนี้');
    }
  };

  const updateCity = (updater) => {
    const newCities = cities.map(c => c.id === activeCityId ? updater(c) : c);
    syncToCloud(newCities);
  };

  const handleAddCity = () => {
    const newCity = { ...activeCity, id: Date.now(), name: 'New Server' };
    syncToCloud([...cities, newCity]);
    setActiveCityId(newCity.id);
  };

  const handleDeleteCity = (id, e) => {
    e.stopPropagation();
    if (window.confirm('ยืนยันการลบ?')) {
      const newCities = cities.filter(c => c.id !== id);
      syncToCloud(newCities);
      if (activeCityId === id && newCities.length > 0) setActiveCityId(newCities[0].id);
    }
  };

  const saveEditCity = (id) => {
    const newCities = cities.map(c => c.id === id ? { ...c, name: editCityName } : c);
    syncToCloud(newCities);
    setEditingCityId(null);
  };

  const handleAddNewCategory = () => {
    if(newCatName.trim()) {
      updateCity(c => ({...c, recipes: [...c.recipes, { id: `r_${Date.now()}`, name: 'สูตรใหม่', category: newCatName.trim(), chance: 100, ingredients: [] }]}));
      setNewCatName('');
      setShowNewCatInput(false);
    }
  };

  const startEditCity = (city, e) => {
    e.stopPropagation();
    setEditingCityId(city.id);
    setEditCityName(city.name);
  };

  const handleTHBChange = (val) => {
    setCalcTHB(val);
    if (!val || Number(val) <= 0) { setCalcIG(''); return; }
    const numIG = Number(val) * (1000000 / activeCity.igRate);
    setCalcIG(numIG.toFixed(0));
  };

  const handleIGChange = (val) => {
    setCalcIG(val);
    if (!val || Number(val) <= 0) { setCalcTHB(''); return; }
    const numTHB = (Number(val) / 1000000) * activeCity.igRate;
    setCalcTHB(numTHB.toFixed(2));
  };

  const getUnitMultiplier = (unit) => {
    if (!activeCity) return 0;
    const thbPerIg = activeCity.igRate / 1000000;
    switch(unit) {
      case 'k_ig': return thbPerIg * 1000;
      case 'ig': return thbPerIg;
      case 'cash': return thbPerIg;
      case 'bm': return thbPerIg * activeCity.bmToCash;
      case 'afkc': return thbPerIg * 1800;
      case 'thb': return 1;
      default: return 0;
    }
  };

  const getMaterialThb = (material) => material.cost * getUnitMultiplier(material.unit);
  const getRecipeTotal = (recipe) => {
    return recipe.ingredients.reduce((sum, ing) => {
      const mat = activeCity?.materials.find(m => m.id === ing.matId);
      return sum + (mat ? getMaterialThb(mat) * ing.qty : 0);
    }, 0);
  };

  if (!isLoaded) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0b0f19', color: '#fff' }}>Connecting Cloud... ☁️</div>;

  const categories = Array.from(new Set(activeCity.recipes.map(r => r.category)));

  return (
    <>
      <style>{globalStyle}</style>
      <div className="dashboard-layout">
        <div className="sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💎</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>EcoCraft Pro</div>
              <div style={{ fontSize: '11px', color: '#10b981' }}>● Online Sync</div>
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {cities.map(city => (
              <div key={city.id} className={`sidebar-item ${activeCityId === city.id ? 'active' : ''}`} onClick={() => setActiveCityId(city.id)}>
                {editingCityId === city.id ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input autoFocus className="pro-input" style={{ padding: '4px' }} value={editCityName} onChange={e => setEditCityName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditCity(city.id)} />
                    <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); saveEditCity(city.id); }}>✓</button>
                  </div>
                ) : (
                  <>
                    <span style={{ flex: 1 }}>{city.name}</span>
                    <button className="btn btn-danger-ghost" onClick={(e) => startEditCity(city, e)}>✎</button>
                    {cities.length > 1 && <button className="btn btn-danger-ghost" onClick={(e) => handleDeleteCity(city.id, e)}>✕</button>}
                  </>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            <button className="btn btn-success" onClick={handleAddCity}>+ Add Server</button>
            {/* ปุ่มดึงข้อมูลเก่าที่เพิ่มมาให้ */}
            <button className="btn" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)' }} onClick={handleMigrateOldData}>💾 ดึงข้อมูลเก่าจากเครื่อง</button>
          </div>
        </div>

        <div className="main-content">
          <div className="content-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h1 className="gradient-text" style={{ fontSize: '32px', margin: 0 }}>{activeCity?.name}</h1>
              <button className={isRecipeEditMode ? "btn btn-success" : "btn btn-primary"} onClick={() => setIsRecipeEditMode(!isRecipeEditMode)}>
                {isRecipeEditMode ? '💾 บันทึกสูตร' : '⚙️ แก้ไขสูตร'}
              </button>
            </div>

            <div className="top-stats-grid">
              <div className="glass-panel stat-card">
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>เรทเงิน (1M IG)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>฿</span>
                  <input type="number" className="pro-input" value={activeCity?.igRate} onChange={e => updateCity(c => ({...c, igRate: Number(e.target.value)}))} />
                </div>
              </div>
              <div className="glass-panel stat-card">
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>เรทตลาดมืด (1 BM)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>$</span>
                  <input type="number" className="pro-input" value={activeCity?.bmToCash} onChange={e => updateCity(c => ({...c, bmToCash: Number(e.target.value)}))} />
                </div>
              </div>
              <div className="glass-panel stat-card">
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>💱 แปลงเงิน</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" className="pro-input" value={calcTHB} onChange={e => handleTHBChange(e.target.value)} placeholder="บาท" />
                  <span>=</span>
                  <input type="number" className="pro-input" value={calcIG} onChange={e => handleIGChange(e.target.value)} placeholder="IG" />
                </div>
              </div>
            </div>

            <div className="content-grid">
              <div className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0 }}>📦 คลังวัตถุดิบ</h3>
                  <button className="btn btn-primary" style={{ padding: '6px 12px' }} onClick={() => updateCity(c => ({...c, materials: [...c.materials, { id: `m_${Date.now()}`, name: 'ไอเทมใหม่', cost: 0, unit: 'k_ig' }] }))}>+ เพิ่ม</button>
                </div>
                <div className="table-container">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {activeCity?.materials.map(mat => (
                        <tr key={mat.id} className="table-row">
                          <td style={{ padding: '8px' }}><input className="pro-input" value={mat.name} onChange={e => updateCity(c => ({...c, materials: c.materials.map(m => m.id === mat.id ? {...m, name: e.target.value} : m)}))} /></td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <input type="number" className="pro-input" style={{ width: '70px' }} value={mat.cost} onChange={e => updateCity(c => ({...c, materials: c.materials.map(m => m.id === mat.id ? {...m, cost: Number(e.target.value)} : m)}))} />
                              <select className="pro-input" style={{ width: '80px' }} value={mat.unit} onChange={e => updateCity(c => ({...c, materials: c.materials.map(m => m.id === mat.id ? {...m, unit: e.target.value} : m)}))}>
                                <option value="k_ig">k IG</option><option value="ig">IG</option><option value="cash">Cash</option><option value="bm">BM</option><option value="thb">฿</option>
                              </select>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', color: '#10b981' }}>{getMaterialThb(mat).toFixed(2)}</td>
                          <td style={{ textAlign: 'center' }}><button className="btn btn-danger-ghost" onClick={() => updateCity(c => ({...c, materials: c.materials.filter(m => m.id !== mat.id)}))}>🗑</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {categories.map(cat => (
                  <div key={cat} className="glass-panel">
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#a855f7' }}>🛠️ {cat}</div>
                    {activeCity?.recipes.filter(r => r.category === cat).map(recipe => (
                      <div key={recipe.id} style={{ padding: '16px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', marginBottom: '12px' }}>
                        {!isRecipeEditMode ? (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{recipe.name} <small style={{ color: '#fbbf24' }}>{recipe.chance}%</small></div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                                {recipe.ingredients.map((ing, idx) => {
                                  const mat = activeCity.materials.find(m => m.id === ing.matId);
                                  return <span key={idx} className="ingredient-badge">{mat?.name} x{ing.qty}</span>;
                                })}
                              </div>
                            </div>
                            <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 'bold' }}>{getRecipeTotal(recipe).toFixed(2)} ฿</div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                              <input className="pro-input" value={recipe.name} onChange={e => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, name: e.target.value} : r)}))} />
                              <button className="btn btn-danger-ghost" onClick={() => updateCity(c => ({...c, recipes: c.recipes.filter(r => r.id !== recipe.id)}))}>ลบ</button>
                            </div>
                            {recipe.ingredients.map((ing, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                <select className="pro-input" value={ing.matId} onChange={e => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, ingredients: r.ingredients.map((i, iIdx) => iIdx === idx ? {...i, matId: e.target.value} : i)} : r)}))}>
                                  {activeCity.materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <input type="number" className="pro-input" style={{ width: '80px' }} value={ing.qty} onChange={e => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, ingredients: r.ingredients.map((i, iIdx) => iIdx === idx ? {...i, qty: Number(e.target.value)} : i)} : r)}))} />
                              </div>
                            ))}
                            <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px', marginTop: '8px' }} onClick={() => updateCity(c => ({...c, recipes: c.recipes.map(r => r.id === recipe.id ? {...r, ingredients: [...r.ingredients, {matId: activeCity.materials[0].id, qty: 1}]} : r)}))}>+ เพิ่มส่วนผสม</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {isRecipeEditMode && <button className="btn" style={{ width: '100%', border: '1px dashed #334155' }} onClick={() => updateCity(c => ({...c, recipes: [...c.recipes, { id: `r_${Date.now()}`, name: 'สูตรใหม่', category: cat, chance: 100, ingredients: [] }] }))}>+ เพิ่มสูตร</button>}
                  </div>
                ))}
                
                {isRecipeEditMode && (
                   <div className="glass-panel" style={{ borderStyle: 'dashed', cursor: 'pointer', textAlign: 'center' }}>
                    {!showNewCatInput ? (
                      <div onClick={() => setShowNewCatInput(true)}>+ สร้างหมวดหมู่ใหม่</div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input autoFocus className="pro-input" placeholder="ชื่อหมวดหมู่..." value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNewCategory()} />
                        <button className="btn btn-success" onClick={handleAddNewCategory}>OK</button>
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