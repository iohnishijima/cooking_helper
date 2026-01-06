import { useState, useEffect } from 'react'
import './index.css'

interface Seasoning {
  name: string;
  nameJp: string;
  weightPerTbsp: number; // 1 tbsp = 15ml
}

const seasonings: Seasoning[] = [
  { name: 'Sugar', nameJp: '上白糖', weightPerTbsp: 9 },
  { name: 'Salt', nameJp: '食塩', weightPerTbsp: 18 },
  { name: 'Soy Sauce', nameJp: '醤油', weightPerTbsp: 18 },
  { name: 'Sake', nameJp: '酒', weightPerTbsp: 15 },
  { name: 'Mirin', nameJp: 'みりん', weightPerTbsp: 18 },
  { name: 'Miso', nameJp: '味噌', weightPerTbsp: 18 },
  { name: 'Vinegar', nameJp: '酢', weightPerTbsp: 15 },
  { name: 'Flour', nameJp: '小麦粉', weightPerTbsp: 9 },
  { name: 'Soft Flour', nameJp: '薄力粉', weightPerTbsp: 9 },
  { name: 'Milk', nameJp: '牛乳', weightPerTbsp: 15 },
];

function App() {
  const [activeTab, setActiveTab] = useState<'seasoning' | 'microwave'>('seasoning');

  // Seasoning State
  const [selectedSeasoning, setSelectedSeasoning] = useState<Seasoning>(seasonings[0]);
  const [tbsp, setTbsp] = useState<string>('');
  const [tsp, setTsp] = useState<string>('');
  const [grams, setGrams] = useState<string>('');

  // Microwave State
  const [origW, setOrigW] = useState<string>('600');
  const [origMin, setOrigMin] = useState<string>('1');
  const [origSec, setOrigSec] = useState<string>('0');
  const [targetW, setTargetW] = useState<string>('500');
  const [resultTime, setResultTime] = useState<{ min: number, sec: number }>({ min: 0, sec: 0 });

  const handleTbspChange = (value: string) => {
    setTbsp(value);
    if (value === '' || isNaN(Number(value))) {
      setTsp('');
      setGrams('');
      return;
    }
    const num = Number(value);
    setTsp((num * 3).toString());
    setGrams((num * selectedSeasoning.weightPerTbsp).toFixed(1));
  };

  const handleTspChange = (value: string) => {
    setTsp(value);
    if (value === '' || isNaN(Number(value))) {
      setTbsp('');
      setGrams('');
      return;
    }
    const num = Number(value);
    setTbsp((num / 3).toFixed(2));
    setGrams(((num / 3) * selectedSeasoning.weightPerTbsp).toFixed(1));
  };

  const handleGramsChange = (value: string) => {
    setGrams(value);
    if (value === '' || isNaN(Number(value))) {
      setTbsp('');
      setTsp('');
      return;
    }
    const num = Number(value);
    const tbspVal = num / selectedSeasoning.weightPerTbsp;
    setTbsp(tbspVal.toFixed(2));
    setTsp((tbspVal * 3).toFixed(2));
  };

  // Microwave Logic
  useEffect(() => {
    const totalSec = (Number(origMin) * 60) + Number(origSec);
    const calculatedSec = (Number(origW) * totalSec) / Number(targetW);
    setResultTime({
      min: Math.floor(calculatedSec / 60),
      sec: Math.round(calculatedSec % 60)
    });
  }, [origW, origMin, origSec, targetW]);

  // Recalculate seasoning when selection changes
  useEffect(() => {
    if (tbsp !== '') handleTbspChange(tbsp);
  }, [selectedSeasoning]);

  return (
    <div className="glass-card">
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'seasoning' ? 'active' : ''}`}
          onClick={() => setActiveTab('seasoning')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 20s4-2 7-2 7 2 7 2V5s-4 2-7 2-7-2-7-2v15Z" /><path d="M7 5v15" /><path d="M14 7v11" /></svg>
          調味料
        </button>
        <button
          className={`tab-btn ${activeTab === 'microwave' ? 'active' : ''}`}
          onClick={() => setActiveTab('microwave')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="15" x="2" y="4" rx="2" /><path d="M2 11h20" /><path d="M15 15h2" /><path d="M18 15h2" /><path d="M7 8v5" /><path d="M10 8v5" /><path d="M13 8v5" /></svg>
          レンジW
        </button>
      </nav>

      {activeTab === 'seasoning' ? (
        <div className="tab-content animate-in">
          <h1>Seasoning Converter</h1>
          <p className="subtitle">調味料の単位をサクッと変換</p>

          <div className="input-container">
            <label>調味料</label>
            <select
              value={selectedSeasoning.name}
              onChange={(e) => {
                const found = seasonings.find(s => s.name === e.target.value);
                if (found) setSelectedSeasoning(found);
              }}
            >
              {seasonings.map(s => (
                <option key={s.name} value={s.name}>{s.nameJp}</option>
              ))}
            </select>
            <div className="result-badge">1大匙 = {selectedSeasoning.weightPerTbsp}g</div>
          </div>

          <div className="conversion-grid">
            <div className="input-container">
              <label>大匙</label>
              <div className="unit-label">
                <input type="number" placeholder="0" value={tbsp} onChange={(e) => handleTbspChange(e.target.value)} />
                <span className="unit-text">tbsp</span>
              </div>
            </div>
            <div className="input-container">
              <label>小匙</label>
              <div className="unit-label">
                <input type="number" placeholder="0" value={tsp} onChange={(e) => handleTspChange(e.target.value)} />
                <span className="unit-text">tsp</span>
              </div>
            </div>
          </div>

          <div className="input-container">
            <label>重さ</label>
            <div className="unit-label">
              <input type="number" placeholder="0" value={grams} onChange={(e) => handleGramsChange(e.target.value)} />
              <span className="unit-text">grams</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="tab-content animate-in">
          <h1>Wattage Converter</h1>
          <p className="subtitle">レンジの加熱時間をワット数で変換</p>

          <div className="input-container">
            <label>元のワット数</label>
            <select value={origW} onChange={(e) => setOrigW(e.target.value)}>
              {[200, 300, 500, 600, 700, 800, 1000].map(w => (
                <option key={w} value={w.toString()}>{w}W</option>
              ))}
            </select>
          </div>

          <div className="input-container">
            <label>元の加熱時間</label>
            <div className="time-inputs">
              <div className="unit-label">
                <input type="number" value={origMin} onChange={(e) => setOrigMin(e.target.value)} />
                <span className="unit-text">分</span>
              </div>
              <div className="unit-label">
                <input type="number" value={origSec} onChange={(e) => setOrigSec(e.target.value)} />
                <span className="unit-text">秒</span>
              </div>
            </div>
          </div>

          <div className="input-container">
            <label>変えたいワット数</label>
            <select value={targetW} onChange={(e) => setTargetW(e.target.value)}>
              {[200, 300, 500, 600, 700, 800, 1000].map(w => (
                <option key={w} value={w.toString()}>{w}W</option>
              ))}
            </select>
          </div>

          <div className="result-section">
            <span className="result-label">{targetW}W での加熱時間</span>
            <span className="result-value">
              {resultTime.min} <small style={{ fontSize: '1rem' }}>分</small> {resultTime.sec} <small style={{ fontSize: '1rem' }}>秒</small>
            </span>
          </div>
        </div>
      )}

      <div className="footer">
        &copy; 2026 Cooking Helper Pro
      </div>
    </div>
  )
}

export default App
