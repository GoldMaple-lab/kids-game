import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import './App.css';

// เพิ่มข้อมูล field 'thai' เพื่อให้อ่านเสียงได้ถูกต้องชัดเจน
const VOCAB_DATA = [
  { word: "แมว (Cat)", thai: "แมว", emoji: "🐱", category: "animal" },
  { word: "หมา (Dog)", thai: "หมา", emoji: "🐶", category: "animal" },
  { word: "หมู (Pig)", thai: "หมู", emoji: "🐷", category: "animal" },
  { word: "ไก่ (Chicken)", thai: "ไก่", emoji: "🐔", category: "animal" },
  { word: "ลิง (Monkey)", thai: "ลิง", emoji: "🐵", category: "animal" },
  { word: "ช้าง (Elephant)", thai: "ช้าง", emoji: "🐘", category: "animal" },
  { word: "กบ (Frog)", thai: "กบ", emoji: "🐸", category: "animal" },
  { word: "นก (Bird)", thai: "นก", emoji: "🐦", category: "animal" },
  { word: "แอปเปิ้ล", thai: "แอปเปิ้ล", emoji: "🍎", category: "fruit" },
  { word: "กล้วย", thai: "กล้วย", emoji: "🍌", category: "fruit" },
  { word: "แตงโม", thai: "แตงโม", emoji: "🍉", category: "fruit" },
  { word: "รถยนต์", thai: "รถยนต์", emoji: "🚗", category: "vehicle" },
  { word: "เครื่องบิน", thai: "เครื่องบิน", emoji: "✈️", category: "vehicle" },
  { word: "ดาว", thai: "ดาว", emoji: "⭐", category: "shape" },
  { word: "หัวใจ", thai: "หัวใจ", emoji: "💖", category: "shape" },
];

// ฟังก์ชันช่วยอ่านเสียงภาษาไทย
const speakThai = (text) => {
  // ยกเลิกเสียงที่กำลังพูดอยู่ (ถ้ามี)
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'th-TH'; // บังคับภาษาไทย
  utterance.rate = 0.8; // พูดช้าลงนิดนึงให้เด็กฟังชัด
  utterance.pitch = 1.1; // เสียงสูงขึ้นเล็กน้อยให้ดูสดใส
  
  window.speechSynthesis.speak(utterance);
};

const ScoreBoard = ({ score }) => (
  <div className="score-board">
    <span>⭐ คะแนน: {score}</span>
  </div>
);

const Menu = ({ onSelectGame }) => {
  return (
    <div className="menu-container">
      <h1 className="title">🎈 เกมเด็กปฐมวัย</h1>
      <p className="subtitle">เลือกเกมที่หนูอยากเล่นเลย!</p>
      
      <div className="menu-grid">
        <button className="menu-card pink" onClick={() => onSelectGame('count')}>
          <div className="icon">🍎</div>
          <span>เกมนับจำนวน</span>
        </button>

        <button className="menu-card blue" onClick={() => onSelectGame('match')}>
          <div className="icon">🧩</div>
          <span>เกมจับคู่ภาพ</span>
        </button>

        <button className="menu-card green" onClick={() => onSelectGame('color')}>
          <div className="icon">🎨</div>
          <span>เกมระบายสี</span>
        </button>

        <button className="menu-card purple" onClick={() => onSelectGame('sound')}>
          <div className="icon">🔊</div>
          <span>ฟังเสียงสัตว์</span>
        </button>

        <button className="menu-card orange" onClick={() => onSelectGame('vocab')}>
          <div className="icon">📖</div>
          <span>เลือกภาพให้ตรงคำ</span>
        </button>

        <button className="menu-card teal" onClick={() => onSelectGame('order')}>
          <div className="icon">1️⃣</div>
          <span>เรียงลำดับตัวเลข</span>
        </button>

        <button className="menu-card rose" onClick={() => onSelectGame('odd')}>
          <div className="icon">👀</div>
          <span>หาตัวต่าง</span>
        </button>

        <button className="menu-card yellow" onClick={() => onSelectGame('math')}>
          <div className="icon">➕</div>
          <span>บวกลบเลขหรรษา</span>
        </button>
      </div>
    </div>
  );
};

const GameCount = ({ onBack, addScore }) => {
  const [target, setTarget] = useState(0);
  const [items, setItems] = useState([]);
  const [clickedIndices, setClickedIndices] = useState([]); // เก็บรายการที่ถูกนับแล้ว

  useEffect(() => { startNewRound(); }, []);

  const startNewRound = () => {
    const num = Math.floor(Math.random() * 9) + 1;
    const vocab = VOCAB_DATA[Math.floor(Math.random() * VOCAB_DATA.length)];
    setTarget(num);
    setItems(new Array(num).fill(vocab.emoji));
    setClickedIndices([]); // รีเซ็ตการนับ
  };

  const handleItemClick = (index) => {
    // ถ้านับไปแล้วไม่ต้องทำอะไร
    if (clickedIndices.includes(index)) return;

    // คำนวนลำดับการนับ (เช่น กดครั้งแรกเป็น 1, ครั้งสองเป็น 2)
    const currentCount = clickedIndices.length + 1;
    
    // พูดเลข
    speakThai(currentCount.toString());
    
    // บันทึกว่าตัวนี้ถูกกดแล้ว
    setClickedIndices([...clickedIndices, index]);
  };

  const checkAnswer = (ans) => {
    speakThai(ans.toString()); // พูดเลขที่ตอบด้วย
    if (ans === target) { 
      confetti(); 
      addScore(10); 
      Swal.fire({ icon: 'success', title: 'ถูกต้องจ้า!', timer: 1000, showConfirmButton: false }); 
      startNewRound(); 
    } else {
      Swal.fire({ icon: 'error', title: 'ลองนับใหม่นะ', timer: 1000, showConfirmButton: false });
    }
  };

  return (
    <div className="game-container">
      <h2>🍎 เกมนับจำนวน</h2>
      <p style={{fontSize: '20px', color: '#666'}}>แตะที่รูปภาพเพื่อช่วยกันนับนะ</p>
      
      <div className="count-area">
        {items.map((item, i) => (
          <button 
            key={i} 
            className={`emoji-count-btn ${clickedIndices.includes(i) ? 'counted' : ''} animate-pop`}
            onClick={() => handleItemClick(i)}
          >
            {item}
            {clickedIndices.includes(i) && <span className="count-badge">{clickedIndices.indexOf(i) + 1}</span>}
          </button>
        ))}
      </div>

      <div className="number-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} className="num-btn" onClick={() => checkAnswer(num)}>{num}</button>
        ))}
      </div>
      <button className="back-btn" onClick={onBack}>⬅ กลับเมนู</button>
    </div>
  );
};

const GameMatch = ({ onBack, addScore }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  useEffect(() => { shuffleCards(); }, []);
  const shuffleCards = () => {
    const selected = [...VOCAB_DATA].sort(() => 0.5 - Math.random()).slice(0, 6);
    const shuffled = [...selected, ...selected].sort(() => Math.random() - 0.5).map((item, index) => ({ id: index, emoji: item.emoji }));
    setCards(shuffled); setFlipped([]); setMatched([]);
  };
  const handleCardClick = (id) => {
    if (flipped.length === 2 || matched.includes(id) || flipped.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (cards[a].emoji === cards[b].emoji) {
        setMatched([...matched, a, b]); setFlipped([]); addScore(5);
        speakThai("เก่งมาก");
        if (matched.length + 2 === cards.length) { confetti(); Swal.fire('สุดยอด!', 'ครบแล้ว', 'success'); }
      } else setTimeout(() => setFlipped([]), 1000);
    }
  };
  return (
    <div className="game-container">
      <h2>🧩 เกมจับคู่ภาพ</h2>
      <div className="match-grid">{cards.map(c => <div key={c.id} className={`card ${flipped.includes(c.id) || matched.includes(c.id) ? 'flipped' : ''}`} onClick={() => handleCardClick(c.id)}><div className="card-inner"><div className="card-front">❓</div><div className="card-back">{c.emoji}</div></div></div>)}</div>
      <button className="restart-btn" onClick={shuffleCards}>เริ่มใหม่</button>
      <button className="back-btn" onClick={onBack}>⬅ กลับเมนู</button>
    </div>
  );
};

const GameColor = ({ onBack }) => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#FF0000");
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = 8;
  }, []);
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    canvas.isDrawing = true;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(getPosition(e).x, getPosition(e).y);
  };
  const draw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas.isDrawing) return;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineTo(getPosition(e).x, getPosition(e).y);
    ctx.stroke();
  };
  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };
  const clearCanvas = () => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  };
  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'my-art.png';
    link.href = canvas.toDataURL();
    link.click();
    Swal.fire({ title: 'บันทึกแล้ว!', icon: 'success', timer: 1500, showConfirmButton: false });
  };
  return (
    <div className="game-container">
      <h2>🎨 เกมระบายสี</h2>
      <canvas ref={canvasRef} className="drawing-board"
        onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => canvasRef.current.isDrawing = false}
        onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => canvasRef.current.isDrawing = false}
      />
      <div className="color-palette">
        {['#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF', '#000000', '#FFFFFF'].map(c => (
          <button key={c} style={{ background: c, transform: color === c ? 'scale(1.2)' : 'scale(1)' }} onClick={() => setColor(c)} className={`color-dot ${color === c ? 'selected' : ''}`} />
        ))}
      </div>
      <div className="btn-group">
        <button className="save-btn" onClick={saveImage}>💾 บันทึก</button>
        <button className="restart-btn" onClick={clearCanvas}>ล้าง</button>
        <button className="back-btn" onClick={onBack}>⬅ กลับเมนู</button>
      </div>
    </div>
  );
};

const GameSound = ({ onBack, addScore }) => {
  const [current, setCurrent] = useState(null);
  const [choices, setChoices] = useState([]);

  useEffect(() => { newRound(); }, []);

  const newRound = () => {
    // กรองเอาเฉพาะหมวดสัตว์
    const animals = VOCAB_DATA.filter(d => d.category === 'animal');
    const target = animals[Math.floor(Math.random() * animals.length)];
    let options = [target];
    while (options.length < 3) {
      const r = animals[Math.floor(Math.random() * animals.length)];
      if (!options.find(o => o.word === r.word)) options.push(r);
    }
    setChoices(options.sort(() => Math.random() - 0.5));
    setCurrent(target);
  };

  const playSound = () => {
    if (!current) return;
    // ใช้ฟังก์ชัน speakThai อ่านชื่อสัตว์ภาษาไทย
    speakThai(current.thai);
  };

  const check = (item) => {
    if (item.word === current.word) {
      confetti();
      addScore(10);
      Swal.fire({ title: 'ถูกต้อง!', icon: 'success', timer: 1000, showConfirmButton: false })
        .then(newRound);
    } else {
      Swal.fire({ title: 'ผิดจ้า ลองฟังใหม่นะ', icon: 'error', timer: 800, showConfirmButton: false });
    }
  };

  if (!current) return <div>Loading...</div>;

  return (
    <div className="game-container">
      <h2>🔊 ฟังเสียงสัตว์</h2>
      <button className="sound-big-btn" onClick={playSound}>▶️ กดฟังเสียง</button>
      <div className="sound-grid">
        {choices.map((item, index) => (
          <button key={index} className="emoji-card" onClick={() => check(item)}>
            {item.emoji}
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={onBack}>⬅ กลับเมนู</button>
    </div>
  );
};

const GameVocab = ({ onBack, addScore }) => {
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  useEffect(() => { newRound(); }, []);
  const newRound = () => {
    const target = VOCAB_DATA[Math.floor(Math.random() * VOCAB_DATA.length)];
    let distractors = [];
    while (distractors.length < 3) {
      const d = VOCAB_DATA[Math.floor(Math.random() * VOCAB_DATA.length)];
      if (d.word !== target.word && !distractors.includes(d)) distractors.push(d);
    }
    setQuestion(target);
    setChoices([target, ...distractors].sort(() => Math.random() - 0.5));
    // อ่านโจทย์ให้ฟังด้วย
    speakThai("หาภาพ " + target.thai);
  };
  const checkAnswer = (item) => {
    if (item.word === question.word) {
      confetti(); addScore(10);
      speakThai("ถูกต้อง");
      Swal.fire({ title: 'เก่งมาก!', icon: 'success', timer: 1000, showConfirmButton: false });
      newRound();
    } else Swal.fire({ title: 'ผิดจ้า', icon: 'error', timer: 1000, showConfirmButton: false });
  };
  if (!question) return <div>Loading...</div>;
  return (
    <div className="game-container">
      <h2>📖 เลือกภาพให้ตรงคำ</h2>
      <h3 style={{fontSize: '40px', color: '#333', margin: '10px'}} onClick={() => speakThai(question.thai)} style={{cursor:'pointer'}}>
         🔊 {question.thai}
      </h3>
      <div className="vocab-grid">
        {choices.map((item, index) => <button key={index} className="choice-card" onClick={() => checkAnswer(item)}>{item.emoji}</button>)}
      </div>
      <button className="back-btn" onClick={onBack}>⬅ กลับเมนู</button>
    </div>
  );
};

const GameOrder = ({ onBack, addScore }) => {
  const [sequence, setSequence] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(1);
  useEffect(() => { reset(); }, []);
  const reset = () => {
    setSequence([1, 2, 3, 4, 5].sort(() => Math.random() - 0.5));
    setCurrentIdx(1);
  };
  const check = (num) => {
    speakThai(num.toString());
    if (num === currentIdx) {
      if (num === 5) {
        confetti(); addScore(20);
        Swal.fire({ title: 'เก่งมาก!', text: 'เรียงครบแล้ว', icon: 'success' }).then(reset);
      } else {
        setCurrentIdx(currentIdx + 1);
      }
    } else {
      Swal.fire({ title: 'ผิดลำดับ', text: 'ต้องเริ่มจาก 1 นะ', icon: 'error', timer: 1000, showConfirmButton: false });
      reset();
    }
  };
  return (
    <div className="game-container">
      <h2>1️⃣ เรียงลำดับตัวเลข 1-5</h2>
      <p>กดตัวเลขเรียงจากน้อยไปมาก</p>
      <div className="number-grid">
        {sequence.map(n => (
           <button key={n} className="num-btn" 
             style={{opacity: n < currentIdx ? 0 : 1, pointerEvents: n < currentIdx ? 'none' : 'auto'}}
             onClick={() => check(n)}>{n}
           </button>
        ))}
      </div>
      <button className="back-btn" onClick={onBack}>⬅ กลับเมนู</button>
    </div>
  );
};

const GameOddOne = ({ onBack, addScore }) => {
  const [items, setItems] = useState([]);
  useEffect(() => { newRound(); }, []);
  const newRound = () => {
    const main = VOCAB_DATA[Math.floor(Math.random() * VOCAB_DATA.length)];
    let odd = VOCAB_DATA[Math.floor(Math.random() * VOCAB_DATA.length)];
    while (odd.emoji === main.emoji) odd = VOCAB_DATA[Math.floor(Math.random() * VOCAB_DATA.length)];
    setItems([main, main, main, odd].sort(() => Math.random() - 0.5));
  };
  const checkAnswer = (item) => {
    if (items.filter(i => i.emoji === item.emoji).length === 1) {
      confetti(); addScore(5);
      Swal.fire({ title: 'ตาไวมาก!', icon: 'success', timer: 800, showConfirmButton: false });
      newRound();
    } else Swal.fire({ title: 'ยังไม่ใช่', icon: 'info', timer: 800, showConfirmButton: false });
  };
  return (
    <div className="game-container">
      <h2>👀 หาตัวต่าง</h2>
      <div className="odd-grid">{items.map((item, idx) => <button key={idx} className="odd-card" onClick={() => checkAnswer(item)}>{item.emoji}</button>)}</div>
      <button className="back-btn" onClick={onBack}>⬅ กลับเมนู</button>
    </div>
  );
};

const GameMath = ({ onBack, addScore }) => {
  const [quest, setQuest] = useState({a:0, b:0, ans:0, choices:[]});
  useEffect(() => { gen(); }, []);
  const gen = () => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 4) + 1;
    const ans = a + b;
    let choices = [ans, ans+1, ans-1].sort(() => Math.random() - 0.5);
    if(choices[1] === choices[0]) choices[1] += 2; 
    setQuest({a, b, ans, choices});
  };
  const check = (n) => {
    speakThai(n.toString());
    if(n === quest.ans) {
      confetti(); addScore(10);
      Swal.fire({icon: 'success', timer: 800, showConfirmButton: false});
      gen();
    } else Swal.fire({icon: 'error', timer: 800, showConfirmButton: false});
  };
  return (
    <div className="game-container">
      <h2>➕ บวกลบเลขหรรษา</h2>
      <div style={{fontSize: '60px', margin: '20px'}}>
        {Array(quest.a).fill('🍎').join('')} + {Array(quest.b).fill('🍎').join('')}
      </div>
      <div style={{fontSize: '40px', marginBottom: '20px'}}>
        {quest.a} + {quest.b} = ?
      </div>
      <div className="number-grid">
        {quest.choices.map((c, i) => <button key={i} className="num-btn" onClick={()=>check(c)}>{c}</button>)}
      </div>
      <button className="back-btn" onClick={onBack}>⬅ กลับเมนู</button>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('menu');
  const [score, setScore] = useState(0);
  const addScore = (points) => setScore(prev => prev + points);

  const renderPage = () => {
    switch (currentPage) {
      case 'count': return <GameCount onBack={() => setCurrentPage('menu')} addScore={addScore} />;
      case 'match': return <GameMatch onBack={() => setCurrentPage('menu')} addScore={addScore} />;
      case 'color': return <GameColor onBack={() => setCurrentPage('menu')} />;
      case 'sound': return <GameSound onBack={() => setCurrentPage('menu')} addScore={addScore} />;
      case 'vocab': return <GameVocab onBack={() => setCurrentPage('menu')} addScore={addScore} />;
      case 'order': return <GameOrder onBack={() => setCurrentPage('menu')} addScore={addScore} />;
      case 'odd': return <GameOddOne onBack={() => setCurrentPage('menu')} addScore={addScore} />;
      case 'math': return <GameMath onBack={() => setCurrentPage('menu')} addScore={addScore} />;
      default: return <Menu onSelectGame={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <ScoreBoard score={score} />
      {renderPage()}
    </div>
  );
}

export default App;