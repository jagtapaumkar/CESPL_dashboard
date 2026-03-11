import { MessageCircle, MessagesSquare, UserCheck, UserX, Wrench } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Treemap, XAxis, YAxis } from "recharts";
import { ZONES, complaintSummary, serviceSummary, feedbackSummary, modeData, overallByCategoryData, pendingByCategoryData, wardComplaintStatusData } from "../data";

function SummaryTriplet({ title, cards, icon }: {
  title: string;
  cards: { label: string; value: number; subA: string; subB: string; tone: string }[];
  icon: "complaint" | "service";
}) {
  return (
    <div className="card">
      <div className="card-head"><h3>{title}</h3></div>
      <div className="mini-cards">
        {cards.map((card) => (
          <article key={card.label} className="mini-card">
            <div className="mini-icon" style={{ borderColor: card.tone, color: card.tone }}>
              {icon === "complaint" ? <MessageCircle size={16} /> : <Wrench size={16} />}
            </div>
            <strong>{card.value}</strong>
            <span>{card.label}</span>
            <small>{card.subA}</small>
            <small>{card.subB}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function CheckIcon({ tone }: { tone: string }) {
  if (tone === "#ef4444") return <UserX size={16} />;
  if (tone === "#eab308") return <MessagesSquare size={16} />;
  return <UserCheck size={16} />;
}

export function CitizenGrievanceDashboardPage() {
  return (
    <>
      <div className="card">
        <div className="filters">
          <select>{ZONES.map((z) => <option key={z}>{z}</option>)}</select>
          <select><option>All Wards</option></select>
          <select><option>Today</option></select>
          <button className="primary">Apply Filter</button>
        </div>
      </div>

      <SummaryTriplet title="Complaint Summary" cards={complaintSummary} icon="complaint" />
      <SummaryTriplet title="Service Summary" cards={serviceSummary} icon="service" />

      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3>Feedback Summary</h3></div>
          <div className="feedback-grid">
            {feedbackSummary.map((f) => (
              <article key={f.label}>
                <div className="mini-icon" style={{ borderColor: f.tone, color: f.tone }}>
                  <CheckIcon tone={f.tone} />
                </div>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Mode of Complaints</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={modeData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={4} animationDuration={1000} label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}>
                {modeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px", marginTop: "10px" }}>
            {modeData.map((item) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }} />
                {item.name} <strong>{item.value.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3>Overall Complaint Categories</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <Treemap data={overallByCategoryData} dataKey="value" nameKey="name" stroke="#fff" fill="#84d2d8" aspectRatio={4/3} animationDuration={900}>
              {overallByCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              <Tooltip />
            </Treemap>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-head"><h3>Pending Complaint Categories</h3></div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pendingByCategoryData} layout="vertical" margin={{ top: 10, right: 20, left: 60, bottom: 10 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#334155" }} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="value" radius={[0,8,8,0]} animationDuration={900}>
                {pendingByCategoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Ward Wise Overall Complaints Status</h3></div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={wardComplaintStatusData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="normalBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="highlightBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.95}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="ward" axisLine={false} tickLine={false} tick={{ fill: "#334155", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#334155", fontSize: 12 }} />
            <Tooltip cursor={{ fill: "rgba(148,163,184,0.15)" }} contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }} />
            <Bar dataKey="complaints" radius={[8,8,0,0]} animationDuration={900}>
              {wardComplaintStatusData.map((entry, index) => {
                const maxValue = Math.max(...wardComplaintStatusData.map(d => d.complaints));
                return <Cell key={`cell-${index}`} fill={entry.complaints === maxValue ? "url(#highlightBar)" : "url(#normalBar)"} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
