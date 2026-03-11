import { useState } from "react";
import { ZONES, kpiHeadline, kpiCore, kpiOperations, kpiAsset, kpiService, kpiCompliance, kpiAwareness } from "../data";

function KpiMetricCard({ item }: { item: { name: string; achieved: number; target: number; score: number } }) {
  const ratio = Math.max(0, Math.min(100, Math.round((item.achieved / item.target) * 100)));
  const tone = ratio >= 85 ? "#10b981" : ratio >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <article className="kpi-metric-card">
      <h4>{item.name}</h4>
      <div className="kpi-score-row"><strong>{item.score.toFixed(1)}</strong><span>{ratio}%</span></div>
      <div className="linear-progress"><div style={{ width: `${ratio}%`, background: tone }} /></div>
      <div className="kpi-meta"><small>Achieved: {item.achieved}</small><small>Target: {item.target}</small></div>
    </article>
  );
}

function KpiSection({ title, items }: { title: string; items: { name: string; achieved: number; target: number; score: number }[] }) {
  const [zone, setZone] = useState<(typeof ZONES)[number]>(ZONES[0]);
  const [search, setSearch] = useState("");
  const visible = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="card">
      <div className="card-head"><h3>{title}</h3><span className="badge-soft">{zone}</span></div>
      <div className="kpi-toolbar">
        <select value={zone} onChange={(e) => setZone(e.target.value as (typeof ZONES)[number])}>
          {ZONES.map((z) => <option key={z}>{z}</option>)}
        </select>
        <input className="filter-input" placeholder="Search KPI..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="ghost">Reset</button>
      </div>
      <div className="kpi-grid">
        {visible.map((item) => <KpiMetricCard key={item.name} item={item} />)}
      </div>
    </div>
  );
}

export function KpiDashboardPage() {
  return (
    <>
      <div className="stats">
        {kpiHeadline.map((s) => (
          <article key={s.title} className="stat-card">
            <p>{s.title}</p><h2>{s.value}</h2>
            <span style={{ background: s.tone }} />
          </article>
        ))}
      </div>
      <KpiSection title="SWM Core KPI Summary" items={kpiCore} />
      <KpiSection title="Operations KPI Summary" items={kpiOperations} />
      <KpiSection title="Asset Deployment KPI Summary" items={kpiAsset} />
      <KpiSection title="Service & Compliance KPI Summary" items={kpiService} />
      <KpiSection title="Regulatory Compliance KPI Summary" items={kpiCompliance} />
      <KpiSection title="Awareness & IEC KPI Summary" items={kpiAwareness} />
    </>
  );
}
