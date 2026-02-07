import { useId, useRef, useState } from 'react'
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
  { name: 'Potato Starch', nameJp: '片栗粉', weightPerTbsp: 9 },
  { name: 'Ketchup', nameJp: 'ケチャップ', weightPerTbsp: 17 },
  { name: 'Mayonnaise', nameJp: 'マヨネーズ', weightPerTbsp: 12 },
];

interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

type LastEditedUnit = 'tbsp' | 'tsp' | 'grams' | null;

function isNumericString(value: string) {
  return value !== '' && !isNaN(Number(value));
}

function fromTbsp(tbspValue: string, weightPerTbsp: number) {
  if (!isNumericString(tbspValue)) return { tbsp: tbspValue, tsp: '', grams: '' };
  const num = Number(tbspValue);
  return {
    tbsp: tbspValue,
    tsp: (num * 3).toString(),
    grams: (num * weightPerTbsp).toFixed(1),
  };
}

function fromTsp(tspValue: string, weightPerTbsp: number) {
  if (!isNumericString(tspValue)) return { tbsp: '', tsp: tspValue, grams: '' };
  const num = Number(tspValue);
  const tbspVal = num / 3;
  return {
    tbsp: tbspVal.toFixed(2),
    tsp: tspValue,
    grams: (tbspVal * weightPerTbsp).toFixed(1),
  };
}

function fromGrams(gramsValue: string, weightPerTbsp: number) {
  if (!isNumericString(gramsValue)) return { tbsp: '', tsp: '', grams: gramsValue };
  const num = Number(gramsValue);
  const tbspVal = num / weightPerTbsp;
  return {
    tbsp: tbspVal.toFixed(2),
    tsp: (tbspVal * 3).toFixed(2),
    grams: gramsValue,
  };
}

function App() {
  const [activeTab, setActiveTab] = useState<'seasoning' | 'microwave' | 'scaler'>('seasoning');
  const appInstanceId = useId();
  const ingredientIdSeq = useRef(0);
  const [lastEditedUnit, setLastEditedUnit] = useState<LastEditedUnit>(null);

  // Scaler Logic
  const addIngredient = () => {
    const newId = `${appInstanceId}-${ingredientIdSeq.current++}`;
    setIngredients((prev) => [...prev, { id: newId, name: '', amount: '' }]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id: string, field: 'name' | 'amount', value: string) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, [field]: value } : ing));
  };

  const getScaledAmount = (amount: string) => {
    if (amount === '' || isNaN(Number(amount))) return '';
    const ratio = Number(targetServings) / Number(baseServings);
    const scaled = Number(amount) * ratio;
    // 小数点以下を適切にフォーマット（整数ならそのまま、小数があれば最大2桁）
    return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(2).replace(/\.?0+$/, '');
  };

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

  // Scaler State
  const [baseServings, setBaseServings] = useState<string>('2');
  const [targetServings, setTargetServings] = useState<string>('3');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '鶏もも肉', amount: '300' },
    { id: '2', name: '醤油', amount: '2' },
  ]);

  const handleTbspChange = (value: string) => {
    setLastEditedUnit('tbsp');
    const next = fromTbsp(value, selectedSeasoning.weightPerTbsp);
    setTbsp(next.tbsp);
    setTsp(next.tsp);
    setGrams(next.grams);
  };

  const handleTspChange = (value: string) => {
    setLastEditedUnit('tsp');
    const next = fromTsp(value, selectedSeasoning.weightPerTbsp);
    setTbsp(next.tbsp);
    setTsp(next.tsp);
    setGrams(next.grams);
  };

  const handleGramsChange = (value: string) => {
    setLastEditedUnit('grams');
    const next = fromGrams(value, selectedSeasoning.weightPerTbsp);
    setTbsp(next.tbsp);
    setTsp(next.tsp);
    setGrams(next.grams);
  };

  const origWNum = isNaN(Number(origW)) ? 0 : Number(origW);
  const targetWNum = isNaN(Number(targetW)) ? 0 : Number(targetW);
  const origMinNum = isNaN(Number(origMin)) ? 0 : Number(origMin);
  const origSecNum = isNaN(Number(origSec)) ? 0 : Number(origSec);

  const microwaveTotalSec = (origMinNum * 60) + origSecNum;
  const microwaveCalculatedSec = targetWNum === 0
    ? 0
    : (origWNum * microwaveTotalSec) / targetWNum;
  const resultTime = {
    min: Math.floor(microwaveCalculatedSec / 60),
    sec: Math.round(microwaveCalculatedSec % 60),
  };

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
        <button
          className={`tab-btn ${activeTab === 'scaler' ? 'active' : ''}`}
          onClick={() => setActiveTab('scaler')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 2H8C6.9 2 6 2.9 6 4V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V4C18 2.9 17.1 2 16 2Z" /><path d="M9 18h6" /><path d="M9 14h6" /><path d="M9 10h6" /></svg>
          人数変更
        </button>
      </nav>

      {activeTab === 'seasoning' && (
        <div className="tab-content animate-in">
          <h1>Seasoning Converter</h1>
          <p className="subtitle">調味料の単位をサクッと変換</p>

          <div className="input-container">
            <label>調味料</label>
            <select
              value={selectedSeasoning.name}
              onChange={(e) => {
                const found = seasonings.find(s => s.name === e.target.value);
                if (!found) return;
                setSelectedSeasoning(found);

                // 選択変更時は、直近で編集していた値をベースに再計算
                const weight = found.weightPerTbsp;
                if (lastEditedUnit === 'tsp' && isNumericString(tsp)) {
                  const next = fromTsp(tsp, weight);
                  setTbsp(next.tbsp);
                  setTsp(next.tsp);
                  setGrams(next.grams);
                  return;
                }
                if (lastEditedUnit === 'grams' && isNumericString(grams)) {
                  const next = fromGrams(grams, weight);
                  setTbsp(next.tbsp);
                  setTsp(next.tsp);
                  setGrams(next.grams);
                  return;
                }
                if (isNumericString(tbsp)) {
                  const next = fromTbsp(tbsp, weight);
                  setTbsp(next.tbsp);
                  setTsp(next.tsp);
                  setGrams(next.grams);
                  return;
                }
                if (isNumericString(tsp)) {
                  const next = fromTsp(tsp, weight);
                  setTbsp(next.tbsp);
                  setTsp(next.tsp);
                  setGrams(next.grams);
                  return;
                }
                if (isNumericString(grams)) {
                  const next = fromGrams(grams, weight);
                  setTbsp(next.tbsp);
                  setTsp(next.tsp);
                  setGrams(next.grams);
                }
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
      )}

      {activeTab === 'microwave' && (
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

      {activeTab === 'scaler' && (
        <div className="tab-content animate-in">
          <h1>Recipe Scaler</h1>
          <p className="subtitle">人数に合わせて分量を自動計算</p>

          <div className="servings-grid">
            <div className="input-container">
              <label>元の人数</label>
              <div className="unit-label">
                <input type="number" value={baseServings} onChange={(e) => setBaseServings(e.target.value)} />
                <span className="unit-text">人分</span>
              </div>
            </div>
            <div className="input-container">
              <label>作りたい人数</label>
              <div className="unit-label">
                <input type="number" value={targetServings} onChange={(e) => setTargetServings(e.target.value)} />
                <span className="unit-text">人分</span>
              </div>
            </div>
          </div>

          <div className="ingredient-list">
            <label>材料と分量 (元の分量を入れると横に計算結果が出ます)</label>
            {ingredients.map((ing) => (
              <div key={ing.id} className="ingredient-row">
                <input
                  type="text"
                  placeholder="材料名 (例: 醤油)"
                  value={ing.name}
                  onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                />
                <div className="unit-label">
                  <input
                    type="number"
                    placeholder="分量"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(ing.id, 'amount', e.target.value)}
                  />
                  <span className="unit-text">→ {getScaledAmount(ing.amount)}</span>
                </div>
                <button className="btn-delete" onClick={() => removeIngredient(ing.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                </button>
              </div>
            ))}
            <button className="btn-add" onClick={addIngredient}>+ 材料を追加</button>
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
