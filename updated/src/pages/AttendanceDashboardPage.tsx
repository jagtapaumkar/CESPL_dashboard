import { useState } from "react";
import { Fingerprint, UserCheck, UserX } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ZONES, attendanceMachines, employeeSummary, shiftCards, zoneAttendanceData, overallStatusData, attendanceMarkers, hrRows } from "../data";
import { DataGrid } from "../components/DataGrid";

function AttendanceMiniCards({ cards, icon, onCardHover }: {
  cards: { label: string; value: number; tone: string }[];
  icon: "machine" | "employee";
  onCardHover?: (label: string | null) => void;
}) {
  return (
    <div className="mini-cards">
      {cards.map((card) => (
        <div key={card.label} className="mini-card"
          onMouseEnter={() => onCardHover?.(card.label)}
          onMouseLeave={() => onCardHover?.(null)}>
          <div className="mini-icon" style={{ borderColor: card.tone, color: card.tone }}>
            {icon === "machine" ? <Fingerprint size={16} /> : card.label.includes("Absent") ? <UserX size={16} /> : <UserCheck size={16} />}
          </div>
          <strong>{card.value.toLocaleString()}</strong>
          <span>{card.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AttendanceDashboardPage() {
  const [employeeHoverLabel, setEmployeeHoverLabel] = useState<string | null>(null);

  return (
    <>
      <div className="card">
        <div className="filters">
          <select>{ZONES.map((z) => <option key={z}>{z}</option>)}</select>
          <select><option>All Wards</option></select>
          <select><option>Shift: All</option></select>
          <button className="primary">Apply Filter</button>
        </div>
      </div>

      <div className="attendance-grid">
        <div className="card">
          <div className="card-head"><h3>Face Detection Machine Summary</h3></div>
          <AttendanceMiniCards cards={attendanceMachines} icon="machine" />
        </div>

        <div className="card">
          <div className="card-head"><h3>Face Detection Machine Summary (Map)</h3></div>
          <MapContainer center={[13.0827, 80.2707]} zoom={11} style={{ height: 330, borderRadius: 12 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {attendanceMarkers.map(([lat, lng, name]) => (
              <Marker key={name} position={[lat, lng]}><Popup>{name}</Popup></Marker>
            ))}
          </MapContainer>
        </div>

        <div className="card employee-hover-card" onMouseLeave={() => setEmployeeHoverLabel(null)}>
          <div className="card-head"><h3>Overall Employee Summary</h3></div>
          <AttendanceMiniCards cards={employeeSummary} icon="employee" onCardHover={setEmployeeHoverLabel} />
          <div className={`present-hover ${employeeHoverLabel === "Present" ? "is-visible" : ""}`}>
            <h4>Present by Shift</h4>
            {[["A Shift", 0], ["B Shift", 2], ["C Shift", 3]].map(([s, idx]) => (
              <div className="shift-row" key={s as string}>
                <span>{s}</span>
                <strong>{shiftCards[idx as number].metrics.find(m => m.label === "Present")?.value}</strong>
              </div>
            ))}
          </div>
          <div className={`absent-hover ${employeeHoverLabel === "Absent" ? "is-visible" : ""}`}>
            <h4>Absent by Shift</h4>
            {[["A Shift", 0], ["B Shift", 2], ["C Shift", 3]].map(([s, idx]) => (
              <div className="shift-row" key={s as string}>
                <span>{s}</span>
                <strong>{Math.abs((shiftCards[idx as number].metrics.find(m => m.label === "Absent") as { value: number })?.value)}</strong>
              </div>
            ))}
          </div>
        </div>

        {shiftCards.map((shift) => (
          <div className="card" key={shift.title}>
            <div className="card-head">
              <h3>{shift.title} <em>({shift.performance}% Performance)</em></h3>
            </div>
            <AttendanceMiniCards cards={shift.metrics} icon="employee" />
          </div>
        ))}

        <div className="card">
          <div className="card-head"><h3>Overall Status</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={overallStatusData} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={4} animationDuration={1000} label={({ name, value }) => `${name}: ${value}`}>
                {overallStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "10px" }}>
            {overallStatusData.map((item) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500 }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: item.color }} />
                {item.name}: <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card full-width">
          <div className="card-head"><h3>Zone Wise Employee Attendance</h3></div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zone" angle={-25} textAnchor="end" height={70} /><YAxis />
              <Tooltip />
              <Bar dataKey="MIOP" fill="#94a3b8" radius={6} />
              <Bar dataKey="present" fill="#10b981" radius={6} />
              <Bar dataKey="absent" fill="#ef4444" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataGrid title="All HR Details" data={hrRows} searchPlaceholder="Search by employee name, code, zone, department..." />
    </>
  );
}
