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
  const [selectedSeasoning, setSelectedSeasoning] = useState<Seasoning>(seasonings[0]);
  const [tbsp, setTbsp] = useState<string>('');
  const [tsp, setTsp] = useState<string>('');
  const [grams, setGrams] = useState<string>('');

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

  // Recalculate when seasoning changes
  useEffect(() => {
    if (tbsp !== '') handleTbspChange(tbsp);
  }, [selectedSeasoning]);

  return (
    <div className="glass-card">
      <h1>Seasoning Converter</h1>
      <p className="subtitle">調味料の分量を一瞬で変換</p>

      <div className="input-container">
        <label>調味料の種類</label>
        <select
          value={selectedSeasoning.name}
          onChange={(e) => {
            const found = seasonings.find(s => s.name === e.target.value);
            if (found) setSelectedSeasoning(found);
          }}
        >
          {seasonings.map(s => (
            <option key={s.name} value={s.name}>{s.nameJp} ({s.name})</option>
          ))}
        </select>
        <div className="result-badge">
          1大匙 = {selectedSeasoning.weightPerTbsp}g
        </div>
      </div>

      <div className="conversion-grid">
        <div className="input-container">
          <label>大匙 (tbsp)</label>
          <input
            type="number"
            placeholder="0"
            value={tbsp}
            onChange={(e) => handleTbspChange(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label>小匙 (tsp)</label>
          <input
            type="number"
            placeholder="0"
            value={tsp}
            onChange={(e) => handleTspChange(e.target.value)}
          />
        </div>
      </div>

      <div className="input-container">
        <label>重さ (grams)</label>
        <input
          type="number"
          placeholder="0"
          value={grams}
          onChange={(e) => handleGramsChange(e.target.value)}
        />
      </div>

      <div className="footer">
        &copy; 2026 Cooking Helper Pro
      </div>
    </div>
  )
}

export default App
