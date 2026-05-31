import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════
function storageGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ═══════════════════════════════════════════════════════
// DADOS
// ═══════════════════════════════════════════════════════
const PROFILES = ["Felipe", "Maria"];

const LESSONS = [
  { id:1,  title:"LICAO 01", subtitle:"F e J: posicao inicial",           keyboard:true,  description:"Indicador ESQUERDO no F, DIREITO no J.\nSinta os relevos — eles sao sua ancora!", exercises:["fff jjj fff jjj","fj jf fj jf fj","ffj jjf fj fjfj jfjf"] },
  { id:2,  title:"LICAO 02", subtitle:"Mao esquerda: A S D F",            keyboard:true,  description:"Minimo: A | Anelar: S | Medio: D | Indicador: F\nMantenha os dedos curvados.", exercises:["aaaa ssss dddd ffff","asdf fdsa asdf fdsa","asd sdf dfs fds asdf"] },
  { id:3,  title:"LICAO 03", subtitle:"Mao direita: J K L",               keyboard:true,  description:"Indicador: J | Medio: K | Anelar: L\nPolegar sobre a barra de espaco.", exercises:["jjjj kkkk llll","jkl lkj jkl lkj","jk kl lj jkl lkj"] },
  { id:4,  title:"LICAO 04", subtitle:"Linha central completa",            keyboard:true,  description:"As duas maos juntas na linha central.\nRitmo constante vale mais que velocidade!", exercises:["asdf jkl asdf jkl","fj dk sl ak fj dk","asdf jkl fdsa lkj"] },
  { id:5,  title:"LICAO 05", subtitle:"G e H: ao centro",                 keyboard:true,  description:"Indicador ESQUERDO estica ate o G.\nIndicador DIREITO estica ate o H.", exercises:["ffg jjh fg jh","fgh ghj fghj hjk","asdfg hjkl ghjkl"] },
  { id:6,  title:"LICAO 06", subtitle:"Linha superior: Q W E R | U I O P",keyboard:true,  description:"Suba os dedos para a fileira acima da central.\nVolte sempre a posicao base.", exercises:["qwer uiop","qwerty uiop","qrpo wiue tyui qwer"] },
  { id:7,  title:"LICAO 07", subtitle:"Linha inferior: Z X C V | N M",    keyboard:true,  description:"Desça os dedos para a fileira abaixo da central.", exercises:["zxcv nm","zx xc cv vb bn nm","zxcv bnm zxcvb nm"] },
  { id:8,  title:"LICAO 08", subtitle:"Primeiras palavras!",               keyboard:false, description:"Chegou a hora de digitar palavras reais!\nConcentre-se na precisao antes da velocidade.", exercises:["sol lua mar rio","mao pao sal mel flor","amor vida nome hora cor"] },
  { id:9,  title:"LICAO 09", subtitle:"Palavras do cotidiano",             keyboard:false, description:"Mantenha os olhos no texto, nao no teclado!", exercises:["casa gato bola pato","livro porta janela","escola amigo jogo cor"] },
  { id:10, title:"LICAO 10", subtitle:"Frases completas!",                 keyboard:false, description:"Voce chegou nas frases — parabens!", exercises:["o gato dorme na sala","eu gosto de jogar bola","a vida e muito bonita"] },
  { id:11, title:"LICAO 11", subtitle:"Acento til: ã õ",                   keyboard:true,  description:"No ABNT2: tecla ~ (apos o P) + vogal.\nExemplo: ~ depois A = ã", exercises:["mão mão mão","pão não cão","mão pão cão não"] },
  { id:12, title:"LICAO 12", subtitle:"Acento agudo: á é í ó ú",           keyboard:true,  description:"No ABNT2: tecla ' (apos o L) + vogal.\nExemplo: ' depois A = á", exercises:["é bom café","pé sofá céu","café é bom pé sofá"] },
  { id:13, title:"LICAO 13", subtitle:"Cedilha: ç",                        keyboard:true,  description:"No ABNT2: tecla Ç dedicada (apos o L).\nNo US layout: use Alt+Ç ou configure o layout.", exercises:["aço poço","lição cabeça","lição aço cabeça poço"] },
  { id:14, title:"LICAO 14", subtitle:"Circunflexo: â ê ô",               keyboard:true,  description:"No ABNT2: Shift+~ depois da vogal.\nExemplo: Shift+~ depois E = ê", exercises:["você avô","três mês avô","você avô três mês"] },
  { id:15, title:"LICAO 15", subtitle:"Acentuacao completa",               keyboard:true,  description:"Combinando todos os acentos. Voce consegue!", exercises:["não é aço você","café coração pão","lição não é fácil você"] },
  { id:16, title:"LICAO 16", subtitle:"Numeros: 1 2 3 4 5",               keyboard:false, description:"Mao esquerda para 1-5.\nNao perca a posicao base!", exercises:["11111 22222 33333","12345 54321 12345","123 321 12345 54321"] },
  { id:17, title:"LICAO 17", subtitle:"Numeros: 6 7 8 9 0",               keyboard:false, description:"Mao direita para 6-0.", exercises:["66666 77777 88888","67890 09876 67890","678 890 6789 9876 0"] },
  { id:18, title:"LICAO 18", subtitle:"Simbolos: . , ! ?",                keyboard:false, description:"Simbolos essenciais para escrever de verdade!", exercises:["... ,,, !!!","oi! tudo bem? sim.","casa. bola! rua? sim."] },
];

const ACHIEVEMENTS = [
  { id:"first_lesson", icon:"🎯", label:"Primeiro Passo",   desc:"Completou a primeira licao" },
  { id:"all_basic",    icon:"⌨️", label:"Base Solida",       desc:"Concluiu todas as 10 licoes basicas" },
  { id:"all_accent",   icon:"á",  label:"Sem Sotaque",       desc:"Dominou todas as licoes de acentuacao" },
  { id:"all_numbers",  icon:"🔢", label:"Numeros e Simbolos",desc:"Completou lições de números (16-18)" },
  { id:"all_lessons",  icon:"🏆", label:"Mestre Digital",    desc:"Completou todas as 18 licoes!" },
  { id:"wpm_20",       icon:"⚡", label:"Velocidade 20",     desc:"Atingiu 20 WPM" },
  { id:"wpm_40",       icon:"🚀", label:"Velocidade 40",     desc:"Atingiu 40 WPM" },
  { id:"wpm_60",       icon:"🌟", label:"Velocidade 60",     desc:"Atingiu 60 WPM!" },
  { id:"wpm_80",       icon:"🏎️", label:"Velocidade 80",     desc:"Atingiu 80 WPM" },
  { id:"perfect",      icon:"✨", label:"Perfeicao!",        desc:"100% de precisao em um exercicio" },
  { id:"no_errors",    icon:"🎯", label:"Sem Erros!",        desc:"Completou uma lição inteira sem nenhum erro" },
  { id:"streak_3",     icon:"🔥", label:"Tres Dias!",        desc:"3 dias seguidos de pratica" },
  { id:"streak_7",     icon:"💎", label:"Uma Semana!",       desc:"7 dias seguidos praticando" },
  { id:"chuva_50",     icon:"🌧️", label:"Sobrevivente",      desc:"Score 50 na Chuva de Palavras" },
  { id:"chuva_100",    icon:"⛈️", label:"Aguaceiro!",        desc:"Score 100 na Chuva de Palavras" },
];

const WORD_LISTS = {
  geral:    ["sol","lua","mar","rio","casa","gato","bola","pato","livro","porta","mao","pao","sal","mel","flor","amor","vida","nome","hora","cor","agua","fogo","terra","luz","dia","noite","rua","cara","olho","boca","asa","pena","ceu","vento","verde","azul","branco","preto"],
  pokemon:  ["pichu","eevee","vulpix","gengar","mewtwo","jigglypuff","snorlax","charizard","blastoise","venusaur","pikachu","raichu","psyduck","slowpoke","magikarp","gyarados","lapras","ditto","vaporeon","flareon","jolteon","espeon","umbreon","dragonite","arcanine","bulbasaur","squirtle","charmander","alakazam","machamp"],
  jogos:    ["fase","nivel","vida","boss","item","poder","magia","escudo","espada","mapa","portal","missao","heroi","vila","loja","moeda","ponto","combo","pausa","start","over","turno","ataque","defesa","magia","rune","quest","arena","nexus","respawn"],
  ciencia:  ["atomo","celula","energia","oxigenio","planeta","gravidade","molecula","fotossintese","nucleo","eletron","proton","neutron","galaxia","estrela","cometa","orbita","massa","forca","velocidade","reacao","elemento","mineral","fossil","clima","ecossistema","bacteria","virus","genoma","neuronio","enzima"],
  esportes: ["futebol","gol","chute","defesa","arbitro","lateral","escanteio","penalti","cartao","time","torcida","estadio","campo","trave","goleiro","zagueiro","atacante","passe","drible","falta","impedimento","placar","torneio","medalha","corrida","natacao","volei","basquete","tenis","raquete"],
};

// ═══════════════════════════════════════════════════════
// ACHIEVEMENT / STREAK UTILS
// ═══════════════════════════════════════════════════════
function computeAchievements(profile) {
  const lessons = profile.lessons || {};
  const completed = Object.keys(lessons).filter(id => lessons[id]?.status === "completed").map(Number);
  const allWPMs = [...Object.values(lessons).map(l => l.bestWPM || 0), profile.cronometro?.bestWPM || 0];
  const maxWPM = Math.max(...allWPMs, 0);
  const basic = [1,2,3,4,5,6,7,8,9,10];
  const accent = [11,12,13,14,15];
  const numbers = [16,17,18];
  const all = LESSONS.map(l => l.id);
  const unlocked = [];
  if (completed.includes(1))                                         unlocked.push("first_lesson");
  if (basic.every(id => completed.includes(id)))                    unlocked.push("all_basic");
  if (accent.every(id => completed.includes(id)))                   unlocked.push("all_accent");
  if (numbers.every(id => completed.includes(id)))                  unlocked.push("all_numbers");
  if (all.every(id => completed.includes(id)))                      unlocked.push("all_lessons");
  if (maxWPM >= 20)                                                  unlocked.push("wpm_20");
  if (maxWPM >= 40)                                                  unlocked.push("wpm_40");
  if (maxWPM >= 60)                                                  unlocked.push("wpm_60");
  if (maxWPM >= 80)                                                  unlocked.push("wpm_80");
  if (Object.values(lessons).some(l => (l.bestAccuracy || 0) >= 100)) unlocked.push("perfect");
  if (Object.values(lessons).some(l => l.noErrors))                 unlocked.push("no_errors");
  if ((profile.streak?.count || 0) >= 3)                            unlocked.push("streak_3");
  if ((profile.streak?.count || 0) >= 7)                            unlocked.push("streak_7");
  if ((profile.chuva?.bestScore || 0) >= 50)                        unlocked.push("chuva_50");
  if ((profile.chuva?.bestScore || 0) >= 100)                       unlocked.push("chuva_100");
  return unlocked;
}

function updateStreak(profile) {
  const today = new Date().toDateString();
  const streak = profile.streak || { count: 0, lastDate: null };
  if (streak.lastDate === today) return profile;
  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  const newCount = streak.lastDate === yest.toDateString() ? streak.count + 1 : 1;
  return { ...profile, streak: { count: newCount, lastDate: today } };
}

function saveProfileData(profileName, updater) {
  const key = `profile:${profileName.toLowerCase()}`;
  let p = storageGet(key) || { name: profileName, lessons: {} };
  p = updater(p);
  p = updateStreak(p);
  p.achievements = computeAchievements(p);
  storageSet(key, p);
  return p;
}

// ═══════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════
function calcWPM(chars, ms) {
  if (ms < 500 || chars < 3) return 0;
  return Math.round((chars / 5) / (ms / 60000));
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    if (type === "key")   { o.frequency.value = 820; g.gain.value = 0.012; o.start(); o.stop(ctx.currentTime + 0.022); }
    if (type === "error") { o.frequency.value = 140; g.gain.value = 0.09;  o.start(); o.stop(ctx.currentTime + 0.13);  }
    if (type === "done")  {
      g.gain.value = 0.07;
      [[523,0],[659,0.12],[784,0.24]].forEach(([f,t]) => setTimeout(()=>{ o.frequency.value=f; }, t*1000));
      o.start(); o.stop(ctx.currentTime + 0.5);
    }
  } catch(_) {}
}

const C = {
  bg:"#000080", text:"#AAAAAA", white:"#FFFFFF",
  yellow:"#FFFF55", green:"#55FF55", cyan:"#55FFFF",
  red:"#FF5555", gray:"#777777", dark:"#334066",
  bar:{ background:"#AAAAAA", color:"#000080" },
};

// ═══════════════════════════════════════════════════════
// TECLADO VISUAL
// ═══════════════════════════════════════════════════════
const FC = { LP:"#cc4444",LR:"#cc7722",LM:"#aaaa22",LI:"#22aa22",RI:"#22aaaa",RM:"#2244cc",RR:"#8822cc",RP:"#cc4444",TH:"#557788" };
const KF = {
  "`":"LP","1":"LP","2":"LR","3":"LM","4":"LI","5":"LI","6":"RI","7":"RI","8":"RM","9":"RR","0":"RP","-":"RP","=":"RP",
  "q":"LP","w":"LR","e":"LM","r":"LI","t":"LI","y":"RI","u":"RI","i":"RM","o":"RR","p":"RP",
  "a":"LP","s":"LR","d":"LM","f":"LI","g":"LI","h":"RI","j":"RI","k":"RM","l":"RR",";":"RP","'":"RP",
  "z":"LP","x":"LR","c":"LM","v":"LI","b":"LI","n":"RI","m":"RI",",":"RM",".":"RR","/":"RP"," ":"TH",
};
const KB_ROWS = [
  ["`","1","2","3","4","5","6","7","8","9","0","-","="],
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l",";","'"],
  ["z","x","c","v","b","n","m",",",".","/"],
];

function KeyboardVisual({ highlightKey }) {
  const hk = (highlightKey || "").toLowerCase();
  const inMap = !!KF[hk];
  return (
    <div style={{ margin:"8px 0 4px", userSelect:"none" }}>
      {!inMap && hk && <div style={{ color:C.yellow, fontSize:11, marginBottom:4 }}>⌨ Tecla especial: use o layout ABNT2 para digitar "{highlightKey}"</div>}
      {KB_ROWS.map((row, ri) => (
        <div key={ri} style={{ display:"flex", gap:2, marginBottom:2, paddingLeft:ri*8 }}>
          {row.map(k => {
            const finger = KF[k] || "TP";
            const isHl = inMap && k === hk;
            return (
              <div key={k} style={{
                width:26, height:22, display:"flex", alignItems:"center", justifyContent:"center",
                background: isHl ? C.yellow : `${FC[finger]}22`,
                border:`1px solid ${isHl ? C.yellow : FC[finger]}`,
                color: isHl ? "#000" : "#888",
                fontSize:10, fontWeight: isHl ? "bold" : "normal",
                boxShadow: isHl ? `0 0 8px ${C.yellow}` : "none",
              }}>{k.toUpperCase()}</div>
            );
          })}
        </div>
      ))}
      <div style={{ display:"flex", justifyContent:"center", marginTop:2 }}>
        <div style={{
          width:160, height:22, display:"flex", alignItems:"center", justifyContent:"center",
          background: hk===" " ? C.yellow : `${FC.TH}22`,
          border:`1px solid ${hk===" " ? C.yellow : FC.TH}`,
          color: hk===" " ? "#000" : "#888", fontSize:10,
        }}>ESPACO</div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:4, fontSize:9, color:C.gray }}>
        {[["LP","Min.Esq"],["LR","Anel.Esq"],["LM","Med.Esq"],["LI","Ind.Esq"],["RI","Ind.Dir"],["RM","Med.Dir"],["RR","Anel.Dir"],["RP","Min.Dir"]].map(([f,l]) => (
          <span key={f} style={{ color:FC[f] }}>■ {l}</span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPONENTES BASE
// ═══════════════════════════════════════════════════════
function Box({ title, children, borderColor=C.text }) {
  return (
    <div style={{ border:`1px solid ${borderColor}`, padding:"10px 14px", margin:"8px 0", position:"relative" }}>
      {title && <span style={{ position:"absolute", top:-9, left:8, background:C.bg, padding:"0 6px", color:C.yellow, fontSize:12 }}>{title}</span>}
      {children}
    </div>
  );
}

function Btn({ onClick, children }) {
  const [h,setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:"inline-block", border:`1px solid ${h?C.yellow:C.text}`, padding:"7px 28px", cursor:"pointer", color:h?C.yellow:C.text, fontSize:14 }}>
      {children}
    </div>
  );
}

function StatBlock({ label, value, unit }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ color:C.cyan, fontSize:11, marginBottom:4, letterSpacing:1 }}>{label}</div>
      <div style={{ color:C.yellow, fontSize:40, lineHeight:1 }}>{value}</div>
      {unit && <div style={{ color:C.gray, fontSize:11, marginTop:4 }}>{unit}</div>}
    </div>
  );
}

function AchievementBanner({ ids }) {
  if (!ids || ids.length === 0) return null;
  return (
    <Box title="🏆 CONQUISTAS DESBLOQUEADAS!" borderColor={C.yellow}>
      {ids.map(id => {
        const a = ACHIEVEMENTS.find(x => x.id === id);
        return a ? <div key={id} style={{ color:C.yellow, fontSize:14, margin:"3px 0" }}>{a.icon} {a.label} <span style={{ color:C.gray, fontSize:11 }}>— {a.desc}</span></div> : null;
      })}
    </Box>
  );
}

// ═══════════════════════════════════════════════════════
// PROFILE SCREEN
// ═══════════════════════════════════════════════════════
function ProfileScreen({ onSelect }) {
  const [data, setData] = useState({});
  useEffect(() => {
    const d = {};
    for (const n of PROFILES) d[n] = storageGet(`profile:${n.toLowerCase()}`);
    setData(d);
  }, []);

  return (
    <div style={{ textAlign:"center", paddingTop:28 }}>
      <pre style={{ color:C.cyan, fontSize:12, lineHeight:1.25, margin:"0 0 4px", display:"inline-block", textAlign:"left" }}>{
`  ██████╗ ██╗████████╗ █████╗ ██╗      ██████╗  ██████╗
  ██╔══██╗██║╚══██╔══╝██╔══██╗██║     ██╔═══██╗██╔════╝
  ██║  ██║██║   ██║   ███████║██║     ██║   ██║██║  ███╗
  ██║  ██║██║   ██║   ██╔══██║██║     ██║   ██║██║   ██║
  ██████╔╝██║   ██║   ██║  ██║███████╗╚██████╔╝╚██████╔╝
  ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝`
      }</pre>
      <div style={{ color:C.yellow, fontSize:13, letterSpacing:3, marginBottom:2 }}>TURBO v2.0</div>
      <div style={{ color:C.gray, fontSize:11, marginBottom:30 }}>Aprenda a digitar com estilo retro!</div>
      <div style={{ color:C.text, fontSize:13, marginBottom:24 }}>
        ╔══════════════════════════╗<br/>
        ║   SELECIONE O PERFIL:    ║<br/>
        ╚══════════════════════════╝
      </div>
      <div style={{ display:"flex", gap:48, justifyContent:"center", flexWrap:"wrap" }}>
        {PROFILES.map(name => {
          const p = data[name];
          const done = p ? Object.values(p.lessons||{}).filter(l=>l.status==="completed").length : 0;
          return <ProfileCard key={name} name={name} done={done} streak={p?.streak?.count||0} ach={p?.achievements?.length||0} onClick={()=>onSelect(name)} />;
        })}
      </div>
    </div>
  );
}

function ProfileCard({ name, done, streak, ach, onClick }) {
  const [h,setH] = useState(false);
  const pct = Math.round((done/LESSONS.length)*100);
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ border:`2px solid ${h?C.yellow:C.text}`, padding:"22px 40px", cursor:"pointer", color:h?C.yellow:C.white, minWidth:160 }}>
      <div style={{ fontSize:48, marginBottom:6, lineHeight:1 }}>{name==="Felipe"?"♂":"♀"}</div>
      <div style={{ fontSize:16, fontWeight:"bold", letterSpacing:3, marginBottom:10 }}>{name.toUpperCase()}</div>
      <div style={{ fontSize:12, color:C.green, marginBottom:4 }}>{done}/{LESSONS.length} LICOES</div>
      <div style={{ height:4, background:"#223", width:"100%", marginBottom:6 }}>
        <div style={{ height:"100%", background:C.green, width:`${pct}%` }} />
      </div>
      {streak>0 && <div style={{ fontSize:11, color:"#FF9900" }}>🔥 {streak} dias seguidos</div>}
      {ach>0 && <div style={{ fontSize:11, color:C.yellow }}>🏆 {ach} conquistas</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN NAV
// ═══════════════════════════════════════════════════════
function MainNav({ active, setActive, onLogout, profileName }) {
  const TABS = [["lessons","LICOES"],["cronometro","CRONOMETRO"],["chuva","CHUVA"],["stats","STATS"],["conquistas","CONQUISTAS"]];
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"stretch", borderBottom:`1px solid ${C.text}`, marginBottom:12, flexWrap:"wrap" }}>
      <div style={{ display:"flex" }}>
        {TABS.map(([id,label]) => (
          <div key={id} onClick={()=>setActive(id)} style={{
            padding:"5px 11px", cursor:"pointer", fontSize:12,
            color: active===id?"#000":C.gray,
            background: active===id?C.text:"transparent",
            borderRight:`1px solid ${C.dark}`,
          }}>{label}</div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, alignItems:"center", fontSize:12, paddingBottom:4 }}>
        <span style={{ color:C.cyan }}>{profileName.toUpperCase()}</span>
        <div onClick={onLogout} style={{ border:`1px solid #555`, padding:"2px 8px", cursor:"pointer", color:C.gray, fontSize:11 }}>[SAIR]</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LESSON MENU
// ═══════════════════════════════════════════════════════
function LessonMenu({ profileName, onStart }) {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const saved = storageGet(`profile:${profileName.toLowerCase()}`);
    setProfile(saved || { lessons:{} });
  }, [profileName]);

  if (!profile) return <div style={{ color:C.text }}>Carregando...</div>;

  const getStatus = id => {
    if (profile.lessons?.[id]?.status==="completed") return "done";
    if (id===1) return "open";
    if (profile.lessons?.[id-1]?.status==="completed") return "open";
    return "locked";
  };

  const done = Object.values(profile.lessons||{}).filter(l=>l.status==="completed").length;
  const GROUPS = [
    { label:"BASICO (1-10)",           ids:[1,2,3,4,5,6,7,8,9,10] },
    { label:"ACENTUACAO (11-15)",       ids:[11,12,13,14,15] },
    { label:"NUMEROS E SIMBOLOS (16-18)", ids:[16,17,18] },
  ];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ color:C.gray, fontSize:12 }}>{done}/{LESSONS.length} concluidas</span>
        <div style={{ height:5, background:"#223", width:"60%" }}>
          <div style={{ height:"100%", background:C.green, width:`${(done/LESSONS.length)*100}%` }}/>
        </div>
      </div>
      {GROUPS.map(g => (
        <div key={g.label} style={{ marginBottom:12 }}>
          <div style={{ color:C.cyan, fontSize:11, letterSpacing:2, marginBottom:5 }}>── {g.label}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:4 }}>
            {LESSONS.filter(l=>g.ids.includes(l.id)).map(lesson => {
              const st = getStatus(lesson.id);
              return <LessonCard key={lesson.id} lesson={lesson} status={st} data={profile.lessons?.[lesson.id]} onClick={()=>st!=="locked"&&onStart(lesson.id)} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function LessonCard({ lesson, status, data, onClick }) {
  const [h,setH] = useState(false);
  const locked = status==="locked", done = status==="done";
  return (
    <div onClick={onClick} onMouseEnter={()=>!locked&&setH(true)} onMouseLeave={()=>setH(false)}
      style={{ border:`1px solid ${locked?"#223":done?C.green:h?C.yellow:C.text}`, padding:"8px 12px",
        cursor:locked?"default":"pointer", opacity:locked?0.38:1,
        background:h&&!locked?"#001a99":"transparent",
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <div style={{ color:done?C.green:locked?"#334":h?C.yellow:C.white, fontSize:13 }}>
          {locked?"🔒":done?"✓":"▶"} {lesson.title}
          {lesson.keyboard && <span style={{ color:C.cyan, fontSize:9, marginLeft:5 }}>⌨</span>}
        </div>
        <div style={{ color:C.gray, fontSize:11, marginTop:1 }}>{lesson.subtitle}</div>
      </div>
      {data?.bestWPM>0 && (
        <div style={{ textAlign:"right", fontSize:11, flexShrink:0, marginLeft:8 }}>
          <div style={{ color:C.cyan }}>{data.bestWPM} WPM</div>
          <div style={{ color:C.gray }}>{data.bestAccuracy}%</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// EXERCISE SCREEN
// ═══════════════════════════════════════════════════════
function ExerciseScreen({ profileName, lessonId, onBack }) {
  const lesson = LESSONS.find(l=>l.id===lessonId);
  const [exIdx, setExIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [phase, setPhase] = useState("exercise");
  const [lastResult, setLastResult] = useState(null);
  const [finalStats, setFinalStats] = useState(null);
  const [semOlhar, setSemOlhar] = useState(false);
  const [textHidden, setTextHidden] = useState(false);
  const [newAch, setNewAch] = useState([]);

  const typedRef=useRef(""), errorsRef=useRef(0), startRef=useRef(null);
  const phaseRef=useRef("exercise"), exIdxRef=useRef(0);
  const allResultsRef=useRef([]), keyErrRef=useRef({});
  const hideTimerRef=useRef(null);

  phaseRef.current=phase; exIdxRef.current=exIdx;

  const resetEx = () => {
    typedRef.current=""; errorsRef.current=0; startRef.current=null; keyErrRef.current={};
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setTextHidden(false); setTyped(""); setErrors(0); setWpm(0); setAccuracy(100);
  };

  // M3 — Repetir lição: reinicia tudo e volta ao exercício 0.
  const repeatLesson = () => {
    resetEx();
    allResultsRef.current = [];
    setExIdx(0); exIdxRef.current = 0;
    setLastResult(null); setFinalStats(null); setNewAch([]);
    setPhase("exercise"); phaseRef.current = "exercise";
  };

  useEffect(()=>{
    const handler = e => {
      if (phaseRef.current!=="exercise") return;
      if (e.key==="Escape") { onBack(); return; }
      if (e.key.length!==1 && e.key!==" ") return;
      e.preventDefault();
      const text = lesson.exercises[exIdxRef.current];
      const cur = typedRef.current;
      if (cur.length>=text.length) return;
      if (!startRef.current) {
        startRef.current = Date.now();
        if (semOlhar) hideTimerRef.current = setTimeout(()=>setTextHidden(true), 3000);
      }
      const expected = text[cur.length];
      if (e.key===expected) {
        const nt = cur+e.key; typedRef.current=nt; setTyped(nt); playSound("key");
        const ms=Date.now()-startRef.current;
        const w=calcWPM(nt.length,ms), total=nt.length+errorsRef.current;
        const acc=Math.round((nt.length/Math.max(total,1))*100);
        setWpm(w); setAccuracy(acc);
        if (nt.length===text.length) {
          playSound("done");
          if(hideTimerRef.current) clearTimeout(hideTimerRef.current);
          setTextHidden(false);
          const result={wpm:w,accuracy:acc,errors:errorsRef.current};
          const all=[...allResultsRef.current,result];
          allResultsRef.current=all; setLastResult(result);
          if (exIdxRef.current>=lesson.exercises.length-1) {
            const avgWPM=Math.round(all.reduce((a,b)=>a+b.wpm,0)/all.length);
            const avgAcc=Math.round(all.reduce((a,b)=>a+b.accuracy,0)/all.length);
            const totalErrors=all.reduce((a,b)=>a+b.errors,0);
            const oldP=storageGet(`profile:${profileName.toLowerCase()}`);
            const oldAch=oldP?.achievements||[];
            const newP=saveProfileData(profileName, p => {
              const prev=p.lessons[lessonId]||{};
              const wpmHist=[...(p.wpmHistory||[])].slice(-19);
              wpmHist.push({date:new Date().toLocaleDateString("pt-BR"),wpm:avgWPM,lesson:lessonId});
              const ke={...(p.keyErrors||{})};
              Object.entries(keyErrRef.current).forEach(([k,v])=>{ ke[k]=(ke[k]||0)+v; });
              return {...p,
                lessons:{...p.lessons,[lessonId]:{status:"completed",bestWPM:Math.max(avgWPM,prev.bestWPM||0),bestAccuracy:Math.max(avgAcc,prev.bestAccuracy||0),noErrors:prev.noErrors||totalErrors===0,completedAt:new Date().toISOString()}},
                wpmHistory:wpmHist, keyErrors:ke
              };
            });
            setNewAch((newP.achievements||[]).filter(a=>!oldAch.includes(a)));
            setFinalStats({avgWPM,avgAcc});
            setPhase("done"); phaseRef.current="done";
          } else {
            setPhase("exResult"); phaseRef.current="exResult";
          }
        }
      } else {
        playSound("error"); errorsRef.current++;
        keyErrRef.current[e.key.toLowerCase()]=(keyErrRef.current[e.key.toLowerCase()]||0)+1;
        setErrors(errorsRef.current);
        const total=typedRef.current.length+errorsRef.current;
        setAccuracy(Math.round((typedRef.current.length/Math.max(total,1))*100));
        if (semOlhar&&textHidden) { setTextHidden(false); setTimeout(()=>setTextHidden(true),400); }
      }
    };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[lesson,onBack,semOlhar,textHidden,lessonId,profileName]);

  const goNext = ()=>{ resetEx(); setExIdx(i=>i+1); setPhase("exercise"); phaseRef.current="exercise"; };

  const renderText = ()=>{
    const text=lesson.exercises[exIdx];
    return text.split("").map((ch,i)=>{
      let style;
      if (i<typed.length) style={color:C.green};
      else if (i===typed.length) style={color:"#000080",background:"#AAAAAA"};
      else style={color:"#445"};
      const hidden=textHidden&&i>=typed.length;
      return (
        <span key={i} className={i===typed.length?"dos-cursor":""} style={{...style,opacity:hidden?0.04:1,transition:hidden?"opacity 0.5s":"opacity 0.1s"}}>
          {ch===" "?" ":ch}
        </span>
      );
    });
  };

  const currentChar=lesson.exercises[exIdx]?.[typed.length];

  if (phase==="done"&&finalStats) {
    const stars=Math.min(5,Math.max(1,Math.ceil(finalStats.avgWPM/10)));
    return (
      <div style={{ textAlign:"center", paddingTop:16 }}>
        <div style={{ color:C.green, fontSize:18, letterSpacing:4, marginBottom:4 }}>LICAO CONCLUIDA!</div>
        <div style={{ color:C.gray, fontSize:11, marginBottom:18 }}>Progresso salvo ✓</div>
        <div style={{ display:"flex", gap:40, justifyContent:"center", marginBottom:20 }}>
          <StatBlock label="WPM MEDIO" value={finalStats.avgWPM} unit="wpm"/>
          <StatBlock label="PRECISAO" value={`${finalStats.avgAcc}%`}/>
          <StatBlock label="EXERCICIOS" value={lesson.exercises.length} unit="ok"/>
        </div>
        <div style={{ color:C.yellow, fontSize:28, marginBottom:16, letterSpacing:6 }}>{"★".repeat(stars)}{"☆".repeat(5-stars)}</div>
        <AchievementBanner ids={newAch}/>
        <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:20 }}>
          <Btn onClick={onBack}>[ MENU PRINCIPAL ]</Btn>
          <Btn onClick={repeatLesson}>[ REPETIR LICAO ]</Btn>
        </div>
      </div>
    );
  }

  if (phase==="exResult"&&lastResult) {
    return (
      <div style={{ textAlign:"center", paddingTop:24 }}>
        <div style={{ color:C.green, fontSize:16, letterSpacing:2, marginBottom:4 }}>EXERCICIO {exIdx+1} OK!</div>
        <div style={{ color:C.gray, fontSize:12, marginBottom:24 }}>{lesson.title}</div>
        <div style={{ display:"flex", gap:40, justifyContent:"center", marginBottom:24 }}>
          <StatBlock label="WPM" value={lastResult.wpm}/>
          <StatBlock label="PRECISAO" value={`${lastResult.accuracy}%`}/>
          <StatBlock label="ERROS" value={lastResult.errors}/>
        </div>
        <Btn onClick={goNext}>[ CONTINUAR ]</Btn>
      </div>
    );
  }

  const progress=typed.length/lesson.exercises[exIdx].length;
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, flexWrap:"wrap", gap:6 }}>
        <div>
          <span style={{ color:C.cyan, fontWeight:"bold" }}>{lesson.title}</span>
          <span style={{ color:C.gray, fontSize:12 }}> | Ex.{exIdx+1}/{lesson.exercises.length}</span>
        </div>
        <div style={{ display:"flex", gap:10, fontSize:13, alignItems:"center" }}>
          <span>WPM:<span style={{ color:C.yellow }}> {wpm}</span></span>
          <span>Prec.:<span style={{ color:accuracy>=90?C.green:C.red }}> {accuracy}%</span></span>
          <span>Erros:<span style={{ color:errors>0?C.red:C.green }}> {errors}</span></span>
          {lessonId>=8 && (
            <div onClick={()=>{setSemOlhar(v=>!v);setTextHidden(false);}}
              style={{ border:`1px solid ${semOlhar?C.yellow:"#444"}`, padding:"2px 7px", cursor:"pointer", fontSize:11, color:semOlhar?C.yellow:C.gray }}>
              {semOlhar?"👁 OCULTO":"👁 NORMAL"}
            </div>
          )}
        </div>
      </div>

      <Box title="INSTRUCAO">
        <div style={{ fontSize:12, color:C.text, whiteSpace:"pre-line", lineHeight:1.7 }}>{lesson.description}</div>
      </Box>

      <Box title="TEXTO — COMECE A DIGITAR" borderColor={C.cyan}>
        <div style={{ fontSize:26, letterSpacing:6, padding:"10px 0 8px", lineHeight:1.7 }}>{renderText()}</div>
        {semOlhar&&startRef.current&&!textHidden && <div style={{ color:C.yellow, fontSize:11 }}>⚠ Texto vai sumir em 3s...</div>}
        <div style={{ height:3, background:"#223", marginTop:6 }}>
          <div style={{ height:"100%", background:C.green, width:`${progress*100}%`, transition:"width 0.08s" }}/>
        </div>
      </Box>

      {lesson.keyboard && <KeyboardVisual highlightKey={currentChar}/>}

      <div style={{ color:"#334", fontSize:11, marginTop:6, textAlign:"center" }}>
        {lesson.exercises[exIdx].length-typed.length} chars restantes | ESC = voltar
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CRONÔMETRO
// ═══════════════════════════════════════════════════════
function CronometroScreen({ profileName }) {
  const [theme, setTheme] = useState("geral");
  const [phase, setPhase] = useState("ready");
  const [timeLeft, setTimeLeft] = useState(60);
  const [wordIdx, setWordIdx] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [bestWPM, setBestWPM] = useState(0);
  const [newAch, setNewAch] = useState([]);

  const wordsRef=useRef([]), widxRef=useRef(0), correctCharsRef=useRef(0), errRef=useRef(0);
  const startRef=useRef(null), intervalRef=useRef(null), inputRef=useRef(null);

  useEffect(()=>{
    const p=storageGet(`profile:${profileName.toLowerCase()}`);
    setBestWPM(p?.cronometro?.bestWPM||0);
  },[profileName]);

  const endGame = useCallback(()=>{
    clearInterval(intervalRef.current);
    const ms=Date.now()-startRef.current;
    const finalWPM=calcWPM(correctCharsRef.current, ms);
    setWpm(finalWPM);
    const oldP=storageGet(`profile:${profileName.toLowerCase()}`);
    const oldAch=oldP?.achievements||[];
    const newP=saveProfileData(profileName, p=>({...p,cronometro:{bestWPM:Math.max(finalWPM,p.cronometro?.bestWPM||0)}}));
    setNewAch((newP.achievements||[]).filter(a=>!oldAch.includes(a)));
    setBestWPM(newP.cronometro?.bestWPM||0);
    setPhase("done");
  },[profileName]);

  const startGame = ()=>{
    const pool=[...WORD_LISTS[theme],...WORD_LISTS[theme],...WORD_LISTS[theme]].sort(()=>Math.random()-0.5);
    wordsRef.current=pool; widxRef.current=0; correctCharsRef.current=0; errRef.current=0;
    setWordIdx(0); setErrors(0); setWpm(0); setTimeLeft(60);
    setPhase("running"); setNewAch([]);
    startRef.current=Date.now();
    setTimeout(()=>inputRef.current?.focus(),50);
    intervalRef.current=setInterval(()=>{
      const left=Math.max(0,60-((Date.now()-startRef.current)/1000));
      setTimeLeft(Math.ceil(left));
      if(left<=0) endGame();
    },200);
  };

  const handleInput = e=>{
    const val=e.target.value;
    if(val.endsWith(" ")||val.endsWith("\n")){
      const attempt=val.trim();
      const expected=wordsRef.current[widxRef.current];
      if(attempt===expected){ correctCharsRef.current+=attempt.length+1; playSound("key"); }
      else{ errRef.current++; setErrors(errRef.current); playSound("error"); }
      widxRef.current++; setWordIdx(widxRef.current);
      e.target.value="";
    }
  };

  const visible=wordsRef.current.slice(widxRef.current, widxRef.current+10);

  return (
    <div>
      <div style={{ color:C.cyan, fontSize:15, letterSpacing:2, marginBottom:12 }}>⏱ MODO CRONOMETRO</div>
      {phase==="ready"&&(
        <div style={{ textAlign:"center" }}>
          <Box title="TEMA">
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              {Object.keys(WORD_LISTS).map(t=>(
                <div key={t} onClick={()=>setTheme(t)} style={{ border:`1px solid ${theme===t?C.yellow:C.text}`, padding:"6px 18px", cursor:"pointer", color:theme===t?C.yellow:C.text }}>{t.toUpperCase()}</div>
              ))}
            </div>
          </Box>
          <div style={{ color:C.gray, fontSize:12, margin:"16px 0" }}>
            Digite o maximo de palavras em <span style={{ color:C.yellow }}>60 segundos</span>.<br/>
            Confirme com ESPACO.
          </div>
          {bestWPM>0&&<div style={{ color:C.cyan, fontSize:13, marginBottom:14 }}>Recorde: <span style={{ color:C.yellow }}>{bestWPM} WPM</span></div>}
          <Btn onClick={startGame}>[ INICIAR ]</Btn>
        </div>
      )}
      {phase==="running"&&(
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontSize:34, color:timeLeft<=10?C.red:C.yellow, lineHeight:1 }}>{timeLeft}s</div>
            <div style={{ textAlign:"right", fontSize:13 }}>
              <div style={{ color:C.green }}>Certas: {wordIdx-errors}</div>
              <div style={{ color:C.red }}>Erros: {errors}</div>
            </div>
          </div>
          <Box title="PALAVRAS" borderColor={C.cyan}>
            <div style={{ fontSize:18, letterSpacing:3, lineHeight:2.2, minHeight:76 }}>
              {visible.map((w,i)=>(
                <span key={widxRef.current+i} style={{ color:i===0?C.yellow:C.text, marginRight:14, background:i===0?"#001a99":"transparent", padding:"2px 4px" }}>{w}</span>
              ))}
            </div>
          </Box>
          <input ref={inputRef} onChange={handleInput} autoFocus
            style={{ background:"transparent", border:`1px solid ${C.cyan}`, color:C.yellow, fontFamily:'"Courier New",monospace', fontSize:20, padding:"8px 12px", outline:"none", width:"100%", letterSpacing:3, marginTop:6 }}
            placeholder="Digite aqui..."/>
        </div>
      )}
      {phase==="done"&&(
        <div style={{ textAlign:"center", paddingTop:16 }}>
          <div style={{ color:C.green, fontSize:18, letterSpacing:3, marginBottom:18 }}>TEMPO ESGOTADO!</div>
          <div style={{ display:"flex", gap:40, justifyContent:"center", marginBottom:20 }}>
            <StatBlock label="VELOCIDADE" value={wpm} unit="WPM"/>
            <StatBlock label="PALAVRAS OK" value={wordIdx-errors}/>
            <StatBlock label="RECORDE" value={bestWPM} unit="WPM"/>
          </div>
          <AchievementBanner ids={newAch}/>
          <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:18 }}>
            <Btn onClick={startGame}>[ TENTAR NOVAMENTE ]</Btn>
            <Btn onClick={()=>setPhase("ready")}>[ TROCAR TEMA ]</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CHUVA DE PALAVRAS
// ═══════════════════════════════════════════════════════
function ChuvaScreen({ profileName }) {
  const [theme, setTheme] = useState("geral");
  const [phase, setPhase] = useState("ready");
  const [fallingWords, setFallingWords] = useState([]);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bestScore, setBestScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [newAch, setNewAch] = useState([]);

  const rafRef=useRef(null), fallingRef=useRef([]), scoreRef=useRef(0), livesRef=useRef(3);
  const speedRef=useRef(0.4), poolRef=useRef([]), wIdRef=useRef(0), nextSpawnRef=useRef(0);
  const inputRef=useRef(null), containerRef=useRef(null), phaseRef=useRef("ready"), typedRef=useRef("");

  phaseRef.current=phase;

  useEffect(()=>{
    const p=storageGet(`profile:${profileName.toLowerCase()}`);
    setBestScore(p?.chuva?.bestScore||0);
  },[profileName]);

  const endGame = useCallback(s=>{
    cancelAnimationFrame(rafRef.current);
    setFinalScore(s);
    const oldP=storageGet(`profile:${profileName.toLowerCase()}`);
    const oldAch=oldP?.achievements||[];
    const newP=saveProfileData(profileName, p=>({...p,chuva:{bestScore:Math.max(s,p.chuva?.bestScore||0)}}));
    setNewAch((newP.achievements||[]).filter(a=>!oldAch.includes(a)));
    setBestScore(newP.chuva?.bestScore||0);
    setPhase("done");
  },[profileName]);

  const startGame = ()=>{
    const pool=[...WORD_LISTS[theme],...WORD_LISTS[theme],...WORD_LISTS[theme]].sort(()=>Math.random()-0.5);
    fallingRef.current=[]; scoreRef.current=0; livesRef.current=3; speedRef.current=0.4;
    wIdRef.current=0; nextSpawnRef.current=Date.now()+1200; poolRef.current=pool; typedRef.current="";
    setFallingWords([]); setScore(0); setLives(3); setTyped(""); setPhase("running"); setNewAch([]);
    setTimeout(()=>inputRef.current?.focus(),50);
  };

  useEffect(()=>{
    if (phase!=="running") return;
    const tick = ()=>{
      if (phaseRef.current!=="running") return;
      const now=Date.now();
      const h=containerRef.current?.clientHeight||320;

      if (now>=nextSpawnRef.current && fallingRef.current.length<7) {
        const word=poolRef.current[wIdRef.current%poolRef.current.length];
        wIdRef.current++;
        fallingRef.current=[...fallingRef.current,{id:wIdRef.current,word,x:8+Math.random()*76,y:0}];
        nextSpawnRef.current=now+Math.max(700,2200-scoreRef.current*18);
      }

      let lost=false;
      fallingRef.current=fallingRef.current.map(w=>({...w,y:w.y+speedRef.current})).filter(w=>{
        if(w.y>98){livesRef.current=Math.max(0,livesRef.current-1);lost=true;return false;}
        return true;
      });

      if(lost){
        setLives(livesRef.current); playSound("error");
        if(livesRef.current<=0){ setFallingWords([]); endGame(scoreRef.current); return; }
      }

      setFallingWords([...fallingRef.current]);
      rafRef.current=requestAnimationFrame(tick);
    };
    rafRef.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[phase,endGame]);

  const handleInput = e=>{
    const val=e.target.value;
    typedRef.current=val.trim();
    if(val.endsWith(" ")){
      const attempt=val.trim();
      const idx=fallingRef.current.findIndex(w=>w.word===attempt);
      if(idx!==-1){
        fallingRef.current=fallingRef.current.filter((_,i)=>i!==idx);
        scoreRef.current++; speedRef.current=Math.min(3.5,0.4+scoreRef.current*0.04);
        setScore(scoreRef.current); playSound("done");
      } else { playSound("error"); }
      typedRef.current=""; setTyped(""); e.target.value="";
    } else { setTyped(val.trim()); }
  };

  return (
    <div>
      <div style={{ color:C.cyan, fontSize:15, letterSpacing:2, marginBottom:12 }}>🌧 CHUVA DE PALAVRAS</div>
      {phase==="ready"&&(
        <div style={{ textAlign:"center" }}>
          <Box title="TEMA">
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              {Object.keys(WORD_LISTS).map(t=>(
                <div key={t} onClick={()=>setTheme(t)} style={{ border:`1px solid ${theme===t?C.yellow:C.text}`, padding:"6px 18px", cursor:"pointer", color:theme===t?C.yellow:C.text }}>{t.toUpperCase()}</div>
              ))}
            </div>
          </Box>
          <div style={{ color:C.gray, fontSize:12, margin:"16px 0" }}>
            Palavras caem do ceu. Digite e pressione <span style={{ color:C.yellow }}>ESPACO</span> para eliminar.<br/>
            Voce tem <span style={{ color:C.red }}>3 vidas</span>. Velocidade aumenta com o score!
          </div>
          {bestScore>0&&<div style={{ color:C.cyan, fontSize:13, marginBottom:14 }}>Recorde: <span style={{ color:C.yellow }}>{bestScore} palavras</span></div>}
          <Btn onClick={startGame}>[ INICIAR ]</Btn>
        </div>
      )}
      {phase==="running"&&(
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <div style={{ color:C.yellow }}>Score: {score}</div>
            <div>{"❤️".repeat(lives)}{"🖤".repeat(Math.max(0,3-lives))}</div>
            <div style={{ color:C.gray, fontSize:12 }}>Vel: {speedRef.current.toFixed(1)}x</div>
          </div>
          <div ref={containerRef} style={{ position:"relative", height:300, border:`1px solid ${C.text}`, overflow:"hidden", background:"#000040" }}>
            {fallingWords.map(w=>{
              const isMatch=typedRef.current.length>0&&w.word.startsWith(typedRef.current);
              return (
                <div key={w.id} style={{
                  position:"absolute", left:`${w.x}%`, top:`${w.y}%`,
                  color:w.word===typed?C.yellow:isMatch?C.green:C.cyan,
                  fontSize:15, fontWeight:w.word===typed?"bold":"normal",
                  textShadow:w.word===typed?`0 0 8px ${C.yellow}`:isMatch?`0 0 5px ${C.green}`:"none",
                }}>{w.word}</div>
              );
            })}
          </div>
          <input ref={inputRef} onChange={handleInput} autoFocus
            style={{ background:"transparent", border:`1px solid ${C.cyan}`, color:C.yellow, fontFamily:'"Courier New",monospace', fontSize:20, padding:"7px 12px", outline:"none", width:"100%", letterSpacing:3, marginTop:6 }}
            placeholder="Digite a palavra..."/>
        </div>
      )}
      {phase==="done"&&(
        <div style={{ textAlign:"center", paddingTop:16 }}>
          <div style={{ color:lives<=0?C.red:C.green, fontSize:18, letterSpacing:3, marginBottom:18 }}>{lives<=0?"GAME OVER!":"PARABENS!"}</div>
          <div style={{ display:"flex", gap:40, justifyContent:"center", marginBottom:20 }}>
            <StatBlock label="SCORE FINAL" value={finalScore} unit="palavras"/>
            <StatBlock label="RECORDE" value={bestScore} unit="palavras"/>
          </div>
          <AchievementBanner ids={newAch}/>
          <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:18 }}>
            <Btn onClick={startGame}>[ JOGAR DE NOVO ]</Btn>
            <Btn onClick={()=>setPhase("ready")}>[ TROCAR TEMA ]</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ESTATÍSTICAS
// ═══════════════════════════════════════════════════════
function StatsScreen({ profileName }) {
  const [profile, setProfile] = useState(null);
  useEffect(()=>{ setProfile(storageGet(`profile:${profileName.toLowerCase()}`)||{}); },[profileName]);
  if (!profile) return <div style={{ color:C.text }}>Carregando...</div>;

  const hist=profile.wpmHistory||[], keyErr=profile.keyErrors||{};

  return (
    <div>
      <div style={{ color:C.cyan, fontSize:15, letterSpacing:2, marginBottom:12 }}>📊 ESTATISTICAS</div>
      <div style={{ display:"flex", gap:10, marginBottom:10, flexWrap:"wrap" }}>
        {[
          {title:"STREAK",    val:`🔥 ${profile.streak?.count||0}`, sub:"dias seguidos"},
          {title:"RECORDE",   val:`${profile.cronometro?.bestWPM||0}`, sub:"WPM cronometro"},
          {title:"CHUVA",     val:`${profile.chuva?.bestScore||0}`, sub:"palavras record"},
        ].map(s=>(
          <Box key={s.title} title={s.title}>
            <div style={{ color:C.yellow, fontSize:28, textAlign:"center", lineHeight:1.2 }}>{s.val}</div>
            <div style={{ color:C.gray, fontSize:11, textAlign:"center" }}>{s.sub}</div>
          </Box>
        ))}
      </div>
      {hist.length>1 && <Box title="EVOLUCAO WPM (ultimas sessoes)"><WPMChart data={hist}/></Box>}
      {Object.keys(keyErr).length>0 && <Box title="HEATMAP DE ERROS"><KeyHeatmap errors={keyErr}/></Box>}
      {hist.length===0&&Object.keys(keyErr).length===0&&(
        <div style={{ color:C.gray, textAlign:"center", padding:40 }}>Complete licoes para ver suas estatisticas!</div>
      )}
    </div>
  );
}

function WPMChart({ data }) {
  const pts=data.slice(-20);
  const maxV=Math.max(...pts.map(d=>d.wpm),10);
  const W=480,H=130,PL=34,PR=10,PT=18,PB=24;
  const iW=W-PL-PR, iH=H-PT-PB;
  const tx=i=>PL+(i/(pts.length-1))*iW;
  const ty=v=>PT+iH-(v/maxV)*iH;
  const poly=pts.map((d,i)=>`${tx(i)},${ty(d.wpm)}`).join(" ");
  const gridVals=[0,Math.round(maxV*0.5),maxV];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ fontFamily:"monospace", overflow:"visible" }}>
      {gridVals.map(v=>(
        <g key={v}>
          <line x1={PL} y1={ty(v)} x2={W-PR} y2={ty(v)} stroke="#1a2a44" strokeWidth={1}/>
          <text x={PL-4} y={ty(v)+4} fill={C.gray} fontSize={9} textAnchor="end">{v}</text>
        </g>
      ))}
      {pts.length>1&&<polyline points={poly} fill="none" stroke={C.cyan} strokeWidth={2}/>}
      {pts.map((d,i)=>(
        <g key={i}>
          <circle cx={tx(i)} cy={ty(d.wpm)} r={3} fill={C.yellow}/>
          {(i===0||i===pts.length-1||i%Math.ceil(pts.length/5)===0)&&(
            <text x={tx(i)} y={H-4} fill={C.gray} fontSize={8} textAnchor="middle">{d.date.slice(0,5)}</text>
          )}
        </g>
      ))}
      <text x={W/2} y={12} fill={C.cyan} fontSize={10} textAnchor="middle">WPM por sessao</text>
    </svg>
  );
}

function KeyHeatmap({ errors }) {
  const maxE=Math.max(...Object.values(errors),1);
  const rows=[
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["z","x","c","v","b","n","m"],
  ];
  const kColor=k=>{
    const n=errors[k]||0, t=n/maxE;
    if(n===0) return {bg:"#001",border:"#223",text:"#445"};
    const r=Math.round(t*210), g=Math.round((1-t)*80);
    return {bg:`rgb(${r},${g},0)`,border:`rgb(${Math.min(255,r+40)},${g},0)`,text:"#fff"};
  };

  return (
    <div>
      {rows.map((row,ri)=>(
        <div key={ri} style={{ display:"flex", gap:3, marginBottom:3, paddingLeft:ri*13 }}>
          {row.map(k=>{
            const c=kColor(k), cnt=errors[k]||0;
            return (
              <div key={k} title={`${k.toUpperCase()}: ${cnt} erros`}
                style={{ width:32, height:27, display:"flex", alignItems:"center", justifyContent:"center",
                  background:c.bg, border:`1px solid ${c.border}`, color:c.text, fontSize:11, position:"relative" }}>
                {k.toUpperCase()}
                {cnt>0&&<span style={{ position:"absolute",top:0,right:1,fontSize:7,color:"#fff" }}>{cnt}</span>}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ fontSize:10, color:C.gray, marginTop:6 }}>
        <span style={{ color:"#005500" }}>■ sem erros</span>{" → "}
        <span style={{ color:"#885500" }}>■ alguns</span>{" → "}
        <span style={{ color:"#cc0000" }}>■ muitos erros</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CONQUISTAS
// ═══════════════════════════════════════════════════════
function ConquistasScreen({ profileName }) {
  const [unlocked, setUnlocked] = useState([]);
  const [streak, setStreak] = useState(0);
  useEffect(()=>{
    const p=storageGet(`profile:${profileName.toLowerCase()}`);
    setUnlocked(p?.achievements||[]);
    setStreak(p?.streak?.count||0);
  },[profileName]);

  return (
    <div>
      <div style={{ color:C.cyan, fontSize:15, letterSpacing:2, marginBottom:6 }}>🏆 CONQUISTAS</div>
      <div style={{ color:C.gray, fontSize:12, marginBottom:14 }}>
        {unlocked.length}/{ACHIEVEMENTS.length} desbloqueadas &nbsp;|&nbsp; 🔥 Streak: {streak} dias
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:5 }}>
        {ACHIEVEMENTS.map(a=>{
          const done=unlocked.includes(a.id);
          return (
            <div key={a.id} style={{ border:`1px solid ${done?C.yellow:"#223"}`, padding:"10px 14px", opacity:done?1:0.38, display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ fontSize:26 }}>{a.icon}</div>
              <div>
                <div style={{ color:done?C.yellow:C.gray, fontSize:13 }}>{a.label}</div>
                <div style={{ color:C.gray, fontSize:11 }}>{a.desc}</div>
              </div>
              {done&&<div style={{ marginLeft:"auto", color:C.green, fontSize:16 }}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("profile");
  const [profileName, setProfileName] = useState(null);
  const [activeTab, setActiveTab] = useState("lessons");
  const [lessonId, setLessonId] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(()=>{ const t=setInterval(()=>setTick(i=>i+1),30000); return()=>clearInterval(t); },[]);
  const time=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});

  const logout=()=>{ setProfileName(null); setLessonId(null); setScreen("profile"); setActiveTab("lessons"); };

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes dos-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
        .dos-cursor{animation:dos-blink 1s step-end infinite}
        ::-webkit-scrollbar{width:8px;background:#000050}
        ::-webkit-scrollbar-thumb{background:#334}
        body{margin:0}
      `}</style>
      <div style={{ background:C.bg, color:C.text, fontFamily:'"Courier New","Lucida Console",monospace', minHeight:"100vh", display:"flex", flexDirection:"column", fontSize:14 }}>
        <div style={{ ...C.bar, padding:"3px 14px", fontWeight:"bold", fontSize:13, display:"flex", justifyContent:"space-between", flexShrink:0 }}>
          <span>■ DITALOGRAFO TURBO v2.0</span>
          <span>{profileName?`Aluno: ${profileName.toUpperCase()}`:""}</span>
        </div>
        <div style={{ flex:1, padding:"12px 20px", overflowY:"auto" }}>
          {screen==="profile"&&<ProfileScreen onSelect={n=>{setProfileName(n);setScreen("main");}}/>}
          {screen==="main"&&(
            <div>
              <MainNav active={activeTab} setActive={t=>{setActiveTab(t);setLessonId(null);}} onLogout={logout} profileName={profileName}/>
              {activeTab==="lessons"&&!lessonId&&<LessonMenu profileName={profileName} onStart={id=>setLessonId(id)}/>}
              {activeTab==="lessons"&&lessonId&&<ExerciseScreen profileName={profileName} lessonId={lessonId} onBack={()=>setLessonId(null)}/>}
              {activeTab==="cronometro"&&<CronometroScreen profileName={profileName}/>}
              {activeTab==="chuva"&&<ChuvaScreen profileName={profileName}/>}
              {activeTab==="stats"&&<StatsScreen profileName={profileName}/>}
              {activeTab==="conquistas"&&<ConquistasScreen profileName={profileName}/>}
            </div>
          )}
        </div>
        <div style={{ ...C.bar, padding:"2px 14px", fontSize:11, display:"flex", justifyContent:"space-between", flexShrink:0 }}>
          <span>v2.0 | ESC=Voltar</span>
          <span>■ {time}</span>
        </div>
      </div>
    </>
  );
}
