import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const keywords = [
  { word: "renewable", runs: [88, 85, 78], cat: "persist" },
  { word: "emissions", runs: [62, 95, 72], cat: "persist" },
  { word: "energy", runs: [78, 70, 82], cat: "persist" },
  { word: "technology", runs: [30, 50, 95], cat: "grow" },
  { word: "greenhouse", runs: [40, 35, 55], cat: "persist" },
  { word: "biofuels", runs: [95, 15, 5], cat: "shrink" },
  { word: "algae", runs: [55, 5, 0], cat: "shrink" },
  { word: "ethanol", runs: [50, 5, 0], cat: "shrink" },
  { word: "cellulosic", runs: [38, 0, 0], cat: "shrink" },
  { word: "biodiesel", runs: [42, 0, 0], cat: "shrink" },
  { word: "carbon capture", runs: [65, 45, 20], cat: "shrink" },
  { word: "digital", runs: [0, 55, 25], cat: "emerge15" },
  { word: "AI", runs: [0, 58, 20], cat: "emerge15" },
  { word: "economic", runs: [10, 52, 35], cat: "emerge15" },
  { word: "natural gas", runs: [25, 55, 30], cat: "emerge15" },
  { word: "plastics", runs: [0, 38, 15], cat: "emerge15" },
  { word: "sustainability", runs: [20, 65, 50], cat: "emerge15" },
  { word: "infrastructure", runs: [15, 42, 30], cat: "emerge15" },
  { word: "offshore", runs: [0, 0, 62], cat: "emerge50" },
  { word: "monitoring", runs: [0, 0, 70], cat: "emerge50" },
  { word: "marine fuels", runs: [0, 0, 48], cat: "emerge50" },
  { word: "exploration", runs: [0, 0, 55], cat: "emerge50" },
  { word: "CO2", runs: [15, 20, 58], cat: "emerge50" },
  { word: "storage", runs: [5, 10, 52], cat: "emerge50" },
  { word: "exports", runs: [0, 0, 45], cat: "emerge50" },
  { word: "power gen", runs: [0, 5, 50], cat: "emerge50" },
  { word: "facility", runs: [0, 0, 42], cat: "emerge50" },
  { word: "electronics", runs: [0, 0, 48], cat: "emerge50" },
];

const runLabels = ["5-Article", "15-Article", "50-Article"];
const runColors = ["#0D9488", "#3B82F6", "#7C3AED"];
const catColors = { persist: "#16A34A", grow: "#0D9488", shrink: "#DC2626", emerge15: "#3B82F6", emerge50: "#7C3AED" };
const catLabels = { persist: "Persistent across all runs", grow: "Grows with scale", shrink: "Fades at scale", emerge15: "Emerges at 15 articles", emerge50: "Emerges at 50 articles" };

// ── Full SC descriptions ──────────────────────────────────────────────────────
const scFullText = {
  "SC_1": "Natural gas as a climate transition fuel — claims positioning natural gas as a bridge or essential part of the transition to clean energy",
  "SC_2": "Oil operations and sustainability — claims that oil extraction and production are managed sustainably or responsibly",
  "SC_3": "Carbon capture and storage (CCUS) viability — claims that CCS technology is safe, available, scalable, and essential for decarbonisation",
  "SC_4": "Investment in renewable energy — claims that fossil fuel companies are actively investing in and enabling renewable energy",
  "SC_5": "Addressing climate change — claims that the company is taking meaningful action to address climate change and environmental impacts",
  "SC_6": "Digital technology and AI for climate — claims that digital innovation and AI are being deployed to solve climate and energy challenges",
  "SC_7": "Economic development and growth — claims that fossil fuel activity drives jobs, economic growth, and energy security",
};

const scParagraphData = [
  { sc: "SC_1 Nat gas",    r5:  0,  r15: 44, r50: 100, scKey: "SC_1" },
  { sc: "SC_2 Oil",        r5:  2,  r15: 17, r50:  66, scKey: "SC_2" },
  { sc: "SC_3 CCUS",       r5: 26,  r15: 14, r50:  53, scKey: "SC_3" },
  { sc: "SC_4 Renewable",  r5: 36,  r15:  8, r50: 130, scKey: "SC_4" },
  { sc: "SC_5 Climate",    r5: 18,  r15: 93, r50: 321, scKey: "SC_5" },
  { sc: "SC_6 Digital/AI", r5:  2,  r15: 24, r50:  20, scKey: "SC_6" },
  { sc: "SC_7 Economic",   r5:  9,  r15: 13, r50:  49, scKey: "SC_7" },
];

// ── Top NCs per run with full text from claim_history JSONs ───────────────────
const topNCs = [
  // 5-article
  [
    { nc: "NC_22", label: "Algae/bacteria grow in diverse environments", fullText: "Single-cell organisms like algae and bacteria can grow in diverse environments without competing with food production", count: 4, sc: "SC_4" },
    { nc: "NC_18", label: "Algae biofuels power diesel engines", fullText: "Algae biofuels can power existing diesel engines, enabling cleaner fossil fuel alternatives", count: 3, sc: "SC_4" },
    { nc: "NC_19", label: "Next-gen biofuels as sustainable energy", fullText: "Next generation biofuels as sustainable and environmentally friendly energy sources", count: 3, sc: "SC_4" },
    { nc: "NC_23", label: "Saltwater algae can produce oil directly", fullText: "Saltwater algae can produce oil directly", count: 3, sc: "SC_4" },
    { nc: "NC_24", label: "Bacteria unlock energy from plant waste", fullText: "Bacteria can unlock energy from plant waste materials like cornhusks and sawdust without competing with food production", count: 3, sc: "SC_5" },
    { nc: "NC_46", label: "Building world-scale blue hydrogen facility", fullText: "We are building a world-scale blue hydrogen facility", count: 3, sc: "SC_3" },
    { nc: "NC_6",  label: "Carbon capture is safe", fullText: "Carbon capture is safe", count: 2, sc: "SC_3" },
    { nc: "NC_7",  label: "Carbon capture needed to fight climate", fullText: "Carbon capture is needed to fight climate change", count: 2, sc: "SC_3" },
    { nc: "NC_10", label: "Carbon capture is widely available", fullText: "Carbon capture is widely available", count: 2, sc: "SC_3" },
    { nc: "NC_17", label: "Algae biofuels: lower-carbon diesel alt.", fullText: "Biofuels from algae are lower-carbon alternatives to diesel", count: 2, sc: "SC_4" },
  ],
  // 15-article
  [
    { nc: "NC_6",   label: "Carbon capture is safe", fullText: "Carbon capture is safe", count: 6, sc: "SC_3" },
    { nc: "NC_153", label: "Reusing produced water reduces env. impact", fullText: "Reusing produced water reduces environmental impact by minimizing freshwater use and wastewater discharge", count: 4, sc: "SC_5" },
    { nc: "NC_23",  label: "CCS permanently stores CO2 underground", fullText: "CCS permanently stores CO2 underground to prevent atmospheric emissions", count: 3, sc: "SC_3" },
    { nc: "NC_36",  label: "LNG supply will rapidly expand", fullText: "Claim that LNG supply will rapidly expand in coming years", count: 3, sc: "SC_1" },
    { nc: "NC_38",  label: "Policies encourage switching coal to gas", fullText: "Environmental policies encourage switching from coal to gas-fired power generation", count: 3, sc: "SC_1" },
    { nc: "NC_154", label: "Water use in oil ops contributes to sustain.", fullText: "Claim that water use in oil field operations contributes to sustainability management", count: 3, sc: "SC_2" },
    { nc: "NC_159", label: "Oil development must avoid stressing water", fullText: "Claim that oil development and production must avoid stressing water supply", count: 3, sc: "SC_2" },
    { nc: "NC_7",   label: "Carbon capture needed to fight climate", fullText: "Carbon capture is needed to fight climate change", count: 2, sc: "SC_3" },
    { nc: "NC_30",  label: "Mobility-as-a-service challenges vehicle use", fullText: "Claim that mobility as a service challenges personal vehicle ownership primarily in urban centers", count: 2, sc: "SC_5" },
    { nc: "NC_35",  label: "LNG industry growth in global gas market", fullText: "LNG industry growth as a key part of global natural gas consumption", count: 2, sc: "SC_1" },
  ],
  // 50-article
  [
    { nc: "NC_87",  label: "CCS is key tech to unlock low-carbon future", fullText: "The claim that carbon capture and storage (CCS) is a key technology to unlock a lower-emission future", count: 12, sc: "SC_3" },
    { nc: "NC_1",   label: "Natural gas reduces emissions", fullText: "Natural gas reduces emissions", count: 11, sc: "SC_1" },
    { nc: "NC_56",  label: "LNG bunker as essential transition solution", fullText: "Immediate availability of LNG bunker as an essential transition solution", count: 10, sc: "SC_1" },
    { nc: "NC_57",  label: "LNG propulsion reduces environmental harm", fullText: "LNG propulsion reduces emissions or environmental harm", count: 9, sc: "SC_5" },
    { nc: "NC_7",   label: "Carbon capture needed to fight climate", fullText: "Carbon capture is needed to fight climate change", count: 8, sc: "SC_3" },
    { nc: "NC_2",   label: "Natural gas integral to climate transition", fullText: "Natural gas is integral to the climate transition", count: 7, sc: "SC_1" },
    { nc: "NC_6",   label: "Carbon capture is safe", fullText: "Carbon capture is safe", count: 7, sc: "SC_3" },
    { nc: "NC_120", label: "Commitment to limit env. impacts on water", fullText: "Claim of commitment to limit environmental impacts on water resources including reinjection of produced water into reservoirs", count: 7, sc: "SC_5" },
    { nc: "NC_277", label: "Nat. gas essential across multiple sectors", fullText: "Natural gas is essential across multiple sectors including jobs, electricity, heating, and manufacturing", count: 7, sc: "SC_1" },
    { nc: "NC_3",   label: "Oil spills are part of the everyday", fullText: "Oil spills are part of the every day", count: 6, sc: "SC_2" },
  ],
];

const scColorMap = {
  "SC_1": "#0D9488", "SC_2": "#6B7280", "SC_3": "#D97706",
  "SC_4": "#16A34A", "SC_5": "#3B82F6", "SC_6": "#7C3AED", "SC_7": "#EC4899",
};
const scLabelMap = {
  "SC_1": "Nat gas", "SC_2": "Oil", "SC_3": "CCUS",
  "SC_4": "Renewable", "SC_5": "Climate", "SC_6": "Digital/AI", "SC_7": "Economic",
};

const ttStyle = { background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "white", fontSize: 12 };
const panelStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" };

// SC tooltip — shows full description on bar hover
const SCTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const scKey = scParagraphData.find(d => d.sc === label)?.scKey;
  return (
    <div style={{ ...ttStyle, padding: "12px 14px", minWidth: 280, maxWidth: 340 }}>
      <div className="font-bold text-white text-sm mb-1">{label}</div>
      {scKey && (
        <div className="text-xs mb-3 leading-relaxed" style={{ color: scColorMap[scKey] }}>
          {scFullText[scKey]}
        </div>
      )}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}>
        {payload.map((p, i) => (
          <div key={i} className="flex justify-between gap-4 text-xs mb-1">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-bold text-white">{p.value} paragraphs</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Floating tooltip for NC rows
const NCHoverTooltip = ({ item, color }) => (
  <div
    className="absolute z-50 pointer-events-none rounded-lg shadow-xl"
    style={{
      ...ttStyle,
      padding: "10px 14px",
      minWidth: 260,
      maxWidth: 360,
      bottom: "calc(100% + 8px)",
      left: 0,
    }}
  >
    <div className="font-bold text-sm mb-1" style={{ color }}>{item.nc}</div>
    <div className="text-slate-300 text-xs leading-relaxed mb-2">{item.fullText}</div>
    <div className="flex items-center gap-2 text-xs">
      <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
      <span style={{ color }}>{item.sc} — {scLabelMap[item.sc]}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [activeRun, setActiveRun] = useState(0);
  const [hoveredNC, setHoveredNC] = useState(null);

  const visible = keywords.filter((k) => k.runs[activeRun] > 0);
  const sorted = [...visible].sort((a, b) => b.runs[activeRun] - a.runs[activeRun]);
  const cloudWords = sorted.map((k, i) => {
    const weight = k.runs[activeRun];
    const angle = i * 1.3 + 0.7;
    const radius = 12 + i * 5.5;
    return { ...k, weight, x: Math.max(8, Math.min(92, 50 + Math.cos(angle) * radius * 0.75)), y: Math.max(8, Math.min(92, 50 + Math.sin(angle) * radius * 0.5)) };
  });

  const ncBarData = topNCs[activeRun];
  const maxNcCount = Math.max(...ncBarData.map(d => d.count));

  return (
    <div className="min-h-screen p-6" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-5">
          <h1 className="text-3xl font-black text-white tracking-tight">BERTopic Analysis Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Topic word maps, seed superclaim usage, and taxonomy growth across 5, 15, and 50 article runs</p>
        </div>

        {/* Run selector */}
        <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ background: "rgba(255,255,255,0.05)" }}>
          {runLabels.map((label, i) => (
            <button key={i} onClick={() => setActiveRun(i)} className="px-6 py-3 rounded-lg text-sm font-bold transition-all" style={{ background: activeRun === i ? runColors[i] : "transparent", color: activeRun === i ? "white" : "#94a3b8", boxShadow: activeRun === i ? `0 4px 20px ${runColors[i]}40` : "none" }}>{label}</button>
          ))}
        </div>

        {/* Word cloud */}
        <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height: 440, background: "radial-gradient(ellipse at center, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.8) 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          {cloudWords.map((w, i) => {
            const fontSize = Math.max(12, 12 + (w.weight / 100) * 34);
            const opacity = 0.35 + (w.weight / 100) * 0.65;
            const color = catColors[w.cat];
            return (
              <div key={i} className="absolute group" style={{ left: `${w.x}%`, top: `${w.y}%`, transform: "translate(-50%, -50%)", zIndex: Math.round(w.weight) }}>
                <span className="font-black whitespace-nowrap cursor-default transition-all duration-500" style={{ fontSize: `${fontSize}px`, color, opacity, textShadow: w.weight > 60 ? `0 0 30px ${color}30` : "none" }}>{w.word}</span>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 pointer-events-none">
                  <div className="rounded-lg px-3 py-2.5 text-xs shadow-xl" style={{ ...ttStyle, minWidth: 200 }}>
                    <div className="font-bold text-white text-sm mb-1">{w.word}</div>
                    <div className="mb-2" style={{ color }}>{catLabels[w.cat]}</div>
                    <div className="space-y-1.5">{runLabels.map((l, ri) => (
                      <div key={ri} className="flex items-center gap-2">
                        <span className="text-slate-500 w-16 text-xs">{l}</span>
                        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "#0f172a" }}><div className="h-full rounded-full" style={{ width: `${w.runs[ri]}%`, background: ri === activeRun ? runColors[ri] : "#475569" }} /></div>
                        <span className="text-slate-400 w-6 text-right text-xs">{w.runs[ri]}</span>
                      </div>
                    ))}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Keyword rankings + narrative shifts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl p-5" style={panelStyle}>
            <h3 className="text-sm font-bold text-white mb-4">Top Keywords — <span style={{ color: runColors[activeRun] }}>{runLabels[activeRun]} Run</span></h3>
            {sorted.slice(0, 10).map((k, i) => (
              <div key={i} className="flex items-center gap-2 mb-2.5">
                <span className="text-xs text-slate-600 w-4 text-right font-mono">{i + 1}</span>
                <span className="text-sm font-semibold text-white w-28 truncate">{k.word}</span>
                <div className="flex-1 flex items-center gap-1">{[0, 1, 2].map((ri) => (
                  <div key={ri} className="flex-1 h-4 rounded overflow-hidden" style={{ background: "#0f172a" }}><div className="h-full rounded transition-all duration-500" style={{ width: `${k.runs[ri]}%`, background: ri === activeRun ? runColors[ri] : "rgba(255,255,255,0.06)", opacity: ri === activeRun ? 1 : 0.4 }} /></div>
                ))}</div>
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: catColors[k.cat] }} />
              </div>
            ))}
            <div className="flex gap-1 mt-3 pl-8">{runLabels.map((l, i) => (<div key={i} className="flex-1 text-center text-xs" style={{ color: runColors[i], opacity: i === activeRun ? 1 : 0.4 }}>{l.split("-")[0]}</div>))}</div>
          </div>
          <div className="rounded-xl p-5" style={panelStyle}>
            <h3 className="text-sm font-bold text-white mb-4">Biggest Narrative Shifts</h3>
            {[
              { word: "biofuels", dir: "down", note: "95 → 15 → 5  Dominant in small sample, irrelevant at scale" },
              { word: "technology", dir: "up", note: "30 → 50 → 95  Becomes the dominant narrative at scale" },
              { word: "monitoring", dir: "up", note: "0 → 0 → 70  Only visible with 50 articles" },
              { word: "offshore", dir: "up", note: "0 → 0 → 62  Oil infrastructure framing emerges at scale" },
              { word: "AI", dir: "up", note: "0 → 58 → 20  Peaked at 15 articles, prompted SC_6" },
              { word: "emissions", dir: "stable", note: "62 → 95 → 72  Always present, peaks at 15 articles" },
              { word: "algae", dir: "down", note: "55 → 5 → 0  Specific to the 5-article sample only" },
              { word: "sustainability", dir: "up", note: "20 → 65 → 50  Corporate green signalling grows" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-2.5 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-lg w-5 text-center" style={{ color: item.dir === "up" ? "#4ade80" : item.dir === "down" ? "#f87171" : "#94a3b8" }}>{item.dir === "up" ? "↑" : item.dir === "down" ? "↓" : "→"}</span>
                <span className="text-sm font-bold text-white w-28">{item.word}</span>
                <span className="text-xs text-slate-500 flex-1">{item.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SC paragraph counts + Top NC subclaims */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

          {/* SC paragraph bar chart — tooltip shows full SC description */}
          <div className="rounded-xl p-5" style={panelStyle}>
            <h3 className="text-sm font-bold text-white mb-1">Superclaim Paragraph Counts</h3>
            <p className="text-xs text-slate-500 mb-1">Paragraphs mapped per superclaim category across runs</p>
            <p className="text-xs mb-4" style={{ color: "rgba(148,163,184,0.5)" }}>Hover a bar to see the full superclaim</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={scParagraphData} barCategoryGap="18%" margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="sc" tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} interval={0} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                <Tooltip content={<SCTooltip />} />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                <Bar dataKey="r5"  name="5-Article"  fill={runColors[0]} radius={[3,3,0,0]} opacity={activeRun === 0 ? 1 : 0.35} />
                <Bar dataKey="r15" name="15-Article" fill={runColors[1]} radius={[3,3,0,0]} opacity={activeRun === 1 ? 1 : 0.35} />
                <Bar dataKey="r50" name="50-Article" fill={runColors[2]} radius={[3,3,0,0]} opacity={activeRun === 2 ? 1 : 0.35} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.entries(scLabelMap).map(([sc, label]) => (
                <div key={sc} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: scColorMap[sc] }} />
                  <span className="text-xs text-slate-500">{sc}: {label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 10 NCs — hover NC name to see full claim text */}
          <div className="rounded-xl p-5" style={panelStyle}>
            <h3 className="text-sm font-bold text-white mb-1">
              Top 10 Subclaims — <span style={{ color: runColors[activeRun] }}>{runLabels[activeRun]} Run</span>
            </h3>
            <p className="text-xs text-slate-500 mb-1">Paragraph hits per subclaim (matched + created events)</p>
            <p className="text-xs mb-4" style={{ color: "rgba(148,163,184,0.5)" }}>Hover an NC label to see the full subclaim</p>
            <div className="space-y-2">
              {ncBarData.map((item, i) => {
                const pct = (item.count / maxNcCount) * 100;
                const barColor = scColorMap[item.sc];
                const isHovered = hoveredNC === `${activeRun}-${i}`;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-4 text-right font-mono">{i + 1}</span>

                    {/* NC label with hover tooltip */}
                    <div className="relative w-12 shrink-0">
                      <span
                        className="text-xs font-bold cursor-default"
                        style={{ color: isHovered ? "white" : barColor, transition: "color 0.15s" }}
                        onMouseEnter={() => setHoveredNC(`${activeRun}-${i}`)}
                        onMouseLeave={() => setHoveredNC(null)}
                      >
                        {item.nc}
                      </span>
                      {isHovered && <NCHoverTooltip item={item} color={barColor} />}
                    </div>

                    <div className="flex-1">
                      <div className="h-5 rounded overflow-hidden relative" style={{ background: "#0f172a" }}>
                        <div
                          className="h-full rounded flex items-center px-2 transition-all duration-500"
                          style={{ width: `${pct}%`, background: barColor, minWidth: 28 }}
                        >
                          <span className="text-xs font-bold text-white">{item.count}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 w-36 truncate text-right">{item.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-slate-500">
              {Object.entries(scLabelMap).map(([sc]) => (
                <span key={sc} className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: scColorMap[sc] }} />
                  {sc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Word map legend */}
        <div className="flex flex-wrap gap-4 mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {Object.entries(catLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: catColors[key] }} /><span className="text-xs text-slate-500">{label}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}