import { useMemo, useState } from "react";
import { Check, Copy, FileSpreadsheet, Filter, Search } from "lucide-react";
import type { OpsComplaint, ComplaintMisRow } from "../types";
import { parseOpsDateTime } from "../utils";

export function ComplaintMisPage({ complaints }: { complaints: OpsComplaint[] }) {
  const [zone, setZone] = useState("all");
  const [ward, setWard] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const zoneOptions = useMemo(() => Array.from(new Set(complaints.map((item) => item.zone))).sort(), [complaints]);
  const wardOptions = useMemo(() => Array.from(new Set(complaints.map((item) => item.wardNo))).sort((a, b) => Number(a) - Number(b)), [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const byZone = zone === "all" ? true : item.zone === zone;
      const byWard = ward === "all" ? true : item.wardNo === ward;
      const q = query.trim().toLowerCase();
      const bySearch = q === "" ? true : `${item.complaintNo} ${item.kpiCategory} ${item.issueType} ${item.zone} ${item.wardNo}`.toLowerCase().includes(q);
      const createdOn = parseOpsDateTime(item.complaintCreatedOn);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      return byZone && byWard && bySearch && (from && createdOn ? createdOn >= from : true) && (to && createdOn ? createdOn <= to : true);
    });
  }, [complaints, zone, ward, query, fromDate, toDate]);

  const rows = useMemo<ComplaintMisRow[]>(() => {
    const grouped = new Map<string, OpsComplaint[]>();
    filteredComplaints.forEach((item) => {
      const key = `${item.zone}__${item.wardNo}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)?.push(item);
    });
    return Array.from(grouped.entries()).map(([key, list], index) => {
      const totalComplaints = list.length;
      const totalSlaBreachComplaints = list.filter((c) => c.status === "SLA Breach").length;
      const totalClosedComplaints = list.filter((c) => c.status === "Closed").length;
      const totalPendingInProgressComplaints = list.filter((c) => c.status === "In Progress").length;
      const totalPendingOnHoldComplaints = list.filter((c) => c.status === "Open").length;
      const totalPendingComplaints = totalComplaints - totalClosedComplaints;
      const totalNonSlaBreachComplaints = totalComplaints - totalSlaBreachComplaints;
      const totalClosedComplaintsWithSlaBreach = list.filter((c) => c.status === "Closed" && c.branchTone === "breach").length;
      const totalClosedComplaintsCompliancePct = totalComplaints > 0 ? Math.round((totalClosedComplaints / totalComplaints) * 100) : 0;
      return { key, srNo: index + 1, slaCategory: "Complaint", zone: list[0]?.zone ?? "-", ward: list[0]?.wardNo ?? "-", totalComplaints, totalSlaBreachComplaints, totalNonSlaBreachComplaints, totalPendingComplaints, totalPendingInProgressComplaints, totalPendingOnHoldComplaints, totalClosedComplaints, totalClosedComplaintsWithSlaBreach, totalClosedComplaintsCompliancePct };
    }).sort((a, b) => a.zone.localeCompare(b.zone) || Number(a.ward) - Number(b.ward));
  }, [filteredComplaints]);

  const totals = useMemo(() => {
    const totalComplaints = rows.reduce((s, r) => s + r.totalComplaints, 0);
    const totalPendingComplaints = rows.reduce((s, r) => s + r.totalPendingComplaints, 0);
    const totalClosedComplaints = rows.reduce((s, r) => s + r.totalClosedComplaints, 0);
    const totalSlaBreachComplaints = rows.reduce((s, r) => s + r.totalSlaBreachComplaints, 0);
    const compliance = totalComplaints > 0 ? Math.round((totalClosedComplaints / totalComplaints) * 100) : 0;
    return { totalComplaints, totalPendingComplaints, totalClosedComplaints, totalSlaBreachComplaints, compliance };
  }, [rows]);

  const csvHeaders = ["Sr No","SLA Category","Zone","Ward","Total Complaints","Total SLA Breach Complaints","Total Non SLA Breach Complaints","Total Pending Complaints","Total Pending In Progress Complaints","Total Pending On Hold Complaints","Total Closed Complaints","Total Closed Complaints With SLA Breach","Total Closed Complaints % Compliance"];

  const exportCsv = () => {
    const csv = [csvHeaders.join(","), ...rows.map((row) => [row.srNo,row.slaCategory,row.zone,row.ward,row.totalComplaints,row.totalSlaBreachComplaints,row.totalNonSlaBreachComplaints,row.totalPendingComplaints,row.totalPendingInProgressComplaints,row.totalPendingOnHoldComplaints,row.totalClosedComplaints,row.totalClosedComplaintsWithSlaBreach,row.totalClosedComplaintsCompliancePct].map((v) => JSON.stringify(String(v))).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "complaint-mis-report.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  const copyTable = () => {
    const text = [csvHeaders.join("\t"), ...rows.map((row) => [row.srNo,row.slaCategory,row.zone,row.ward,row.totalComplaints,row.totalSlaBreachComplaints,row.totalNonSlaBreachComplaints,row.totalPendingComplaints,row.totalPendingInProgressComplaints,row.totalPendingOnHoldComplaints,row.totalClosedComplaints,row.totalClosedComplaintsWithSlaBreach,row.totalClosedComplaintsCompliancePct].join("\t"))].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="report-page-layout cmis-report-layout">
      <div className="card cmis-wrap">
        <div className="cmis-head">
          <div><p>MIS & Reports</p><h3>Citizen Complaint MIS Report</h3></div>
          <div className="cmis-head-actions">
            <button className="ghost" onClick={copyTable}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy"}</button>
            <button className="ghost" onClick={exportCsv}><FileSpreadsheet size={15} /> Export To Excel</button>
          </div>
        </div>
        <div className="cmis-filter-grid">
          <label><span>Zone</span>
            <select value={zone} onChange={(e) => setZone(e.target.value)}>
              <option value="all">All Zone</option>
              {zoneOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label><span>Ward</span>
            <select value={ward} onChange={(e) => setWard(e.target.value)}>
              <option value="all">Ward</option>
              {wardOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <div className="report-date-pair">
            <label className="report-date-field"><span>From Date</span><input type="datetime-local" step={60} className="date-time-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></label>
            <label className="report-date-field"><span>To Date</span><input type="datetime-local" step={60} className="date-time-input" value={toDate} onChange={(e) => setToDate(e.target.value)} /></label>
          </div>
          <div className="cmis-search"><Search size={10} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search records..." /></div>
          <div className="cmis-filter-actions">
            <button className="primary"><Filter size={15} /> Search</button>
            <button className="ghost" onClick={() => { setZone("all"); setWard("all"); setFromDate(""); setToDate(""); setQuery(""); }}>Reset</button>
          </div>
        </div>
      </div>

      <div className="cmis-kpis">
        <article className="card"><p>Total Complaints</p><strong>{totals.totalComplaints}</strong></article>
        <article className="card"><p>Pending Complaints</p><strong className="warn">{totals.totalPendingComplaints}</strong></article>
        <article className="card"><p>Closed Complaints</p><strong className="good">{totals.totalClosedComplaints}</strong></article>
        <article className="card"><p>SLA Breach</p><strong className="bad">{totals.totalSlaBreachComplaints}</strong></article>
        <article className="card"><p>Compliance</p><strong className="info">{totals.compliance}%</strong></article>
      </div>

      <div className="card cmis-table-card report-table-card">
        <div className="cmis-table-head"><p>Showing <b>{rows.length}</b> ward records</p></div>
        <div className="cmis-table-wrap report-table-scroll">
          <table className="cmis-table">
            <thead>
              <tr>
                <th>Sr No</th><th>SLA Category</th><th>Zone</th><th>Ward</th>
                <th>Total Complaints</th><th>Total SLA Breach Complaints</th><th>Total Non SLA Breach Complaints</th>
                <th>Total Pending Complaints</th><th>Total Pending In Progress Complaints</th><th>Total Pending On Hold Complaints</th>
                <th>Total Closed Complaints</th><th>Total Closed Complaints With SLA Breach</th>
                <th className="compliance-col">Total Closed Complaints % Compliance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>{row.srNo}</td><td>{row.slaCategory}</td><td>{row.zone}</td><td>{row.ward}</td>
                  <td>{row.totalComplaints}</td><td>{row.totalSlaBreachComplaints}</td><td>{row.totalNonSlaBreachComplaints}</td>
                  <td>{row.totalPendingComplaints}</td><td>{row.totalPendingInProgressComplaints}</td><td>{row.totalPendingOnHoldComplaints}</td>
                  <td>{row.totalClosedComplaints}</td><td>{row.totalClosedComplaintsWithSlaBreach}</td>
                  <td className="compliance-col">{row.totalClosedComplaintsCompliancePct}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="cmis-empty">No records found for the selected filters.</div>}
        </div>
      </div>
    </div>
  );
}
