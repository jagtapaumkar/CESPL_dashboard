import { useRef, useMemo, useState } from "react";
import { Check, ChevronDown, Columns3, Copy, Download, FileSpreadsheet, Filter, Printer, Search } from "lucide-react";
import { attendanceRows, attendanceColumns } from "../data";
import type { AttendanceRecord, AttendanceStatus } from "../types";
import { ManpowerDeploymentReportModal } from "../components/ManpowerDeploymentReportModal";

export function AttendanceReportsPage() {
  const [status, setStatus] = useState("all");
  const [zone, setZone] = useState("all");
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof AttendanceRecord>("srNo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState<(keyof AttendanceRecord)[]>(attendanceColumns.map((c) => c.key));
  const [showColumns, setShowColumns] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const columnMenuRef = useRef<HTMLDivElement | null>(null);

  const filteredRows = useMemo(() => {
    return attendanceRows.filter((row) => {
      const byStatus = status === "all" ? true : row.status === status;
      const byZone = zone === "all" ? true : row.zone.toLowerCase() === zone.toLowerCase();
      const bySearch = query.trim() === "" ? true : `${row.empName} ${row.empCode} ${row.sysId}`.toLowerCase().includes(query.toLowerCase());
      const rowDateTime = new Date(`${row.date}T${row.punchIn || "00:00"}`);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      return byStatus && byZone && bySearch && (from ? rowDateTime >= from : true) && (to ? rowDateTime <= to : true);
    }).sort((a, b) => {
      const av = String(a[sortColumn]);
      const bv = String(b[sortColumn]);
      return sortDirection === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [status, zone, query, fromDate, toDate, sortColumn, sortDirection]);

  const handleSort = (column: keyof AttendanceRecord) => {
    if (sortColumn === column) { setSortDirection((prev) => prev === "asc" ? "desc" : "asc"); return; }
    setSortColumn(column); setSortDirection("asc");
  };

  const stickyLeft = (key: keyof AttendanceRecord) => {
    let left = 0;
    for (const col of attendanceColumns) {
      if (col.key === key) return left;
      if (col.sticky) left += col.width;
    }
    return left;
  };

  const toggleColumn = (key: keyof AttendanceRecord) => {
    const col = attendanceColumns.find((c) => c.key === key);
    if (col?.sticky) return;
    setVisibleColumns((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const exportAttendanceCsv = () => {
    const cols = attendanceColumns.filter((c) => visibleColumns.includes(c.key));
    const keys = cols.map((c) => c.key);
    const csv = [cols.map((c) => c.label).join(","), ...filteredRows.map((r) => keys.map((k) => JSON.stringify(String(r[k]))).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "attendance-report.csv"; a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleCopy = () => {
    const cols = attendanceColumns.filter((c) => visibleColumns.includes(c.key));
    const text = filteredRows.map((row) => cols.map((c) => String(row[c.key])).join("\t")).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };

  const statusBadge = (value: AttendanceStatus) => {
    if (value === "present") return <span className="att-status present">Present</span>;
    if (value === "absent") return <span className="att-status absent">Absent</span>;
    if (value === "late") return <span className="att-status late">Late</span>;
    if (value === "leave") return <span className="att-status leave">Leave</span>;
    return <span className="att-status half">Half Day</span>;
  };

  const reportZone = zone === "all"
    ? "05"
    : String(zone).replace(/\D/g, "").padStart(2, "0");

  const reportDate = fromDate
    ? (() => {
      const parsed = new Date(fromDate);
      if (Number.isNaN(parsed.getTime())) return fromDate;
      return `${parsed.getMonth() + 1}/${parsed.getDate()}/${parsed.getFullYear()}`;
    })()
    : (() => {
      const now = new Date();
      return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    })();

  return (
    <div className="report-page-layout att-report-layout">
      <div className="att-head-actions">
        <button className="primary" onClick={() => setShowReportModal(true)}>
          <FileSpreadsheet size={16} /> Generate Report
        </button>
      </div>
      <div className="card">
        <div className="att-filter-row">
          <div className="att-filter-label"><Filter size={16} /> Filters</div>
          <div className="report-date-pair">
            <label className="att-inline-label report-date-field"><span>From Date</span><input type="datetime-local" step={60} className="filter-input date-time-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></label>
            <label className="att-inline-label report-date-field"><span>To Date</span><input type="datetime-local" step={60} className="filter-input date-time-input" value={toDate} onChange={(e) => setToDate(e.target.value)} /></label>
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="leave">Leave</option>
            <option value="half-day">Half Day</option>
          </select>
          <select value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="all">All Zones</option>
            <option value="Zone 1">Zone 5</option>
            <option value="Zone 2">Zone 6</option>
          </select>
          <select value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="all">Actual Shift</option>
            <option value="Zone 1">A-Shift</option>
            <option value="Zone 2">B-Shift</option>
          </select>
          <div className="searchbox"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or code..." /></div>
          <button className="ghost">More <ChevronDown size={15} /></button>
        </div>
      </div>

      <div className="card att-table-card report-table-card">
        <div className="att-table-top">
          <div>Showing <b>{filteredRows.length}</b> records</div>
          <div className="att-table-actions">
            <div className="column-menu-wrap" ref={columnMenuRef}>
              <button className="ghost" onClick={() => setShowColumns((v) => !v)}><Columns3 size={15} /> Columns</button>
              {showColumns && (
                <div className="column-menu">
                  {attendanceColumns.map((col) => (
                    <label key={col.key} className={col.sticky ? "disabled" : ""}>
                      <input type="checkbox" checked={visibleColumns.includes(col.key)} disabled={Boolean(col.sticky)} onChange={() => toggleColumn(col.key)} />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button className="ghost" onClick={handleCopy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied!" : "Copy"}</button>
            <button className="ghost" onClick={exportAttendanceCsv}><Download size={15} /> Export</button>
            <button className="ghost" onClick={() => window.print()}><Printer size={15} /> Print</button>
          </div>
        </div>
        <div className="att-table-wrap report-table-scroll">
          <table className="att-table">
            <thead>
              <tr>
                {attendanceColumns.filter((col) => visibleColumns.includes(col.key)).map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    className={col.sticky ? "sticky-col" : ""}
                    style={col.sticky ? { left: stickyLeft(col.key), minWidth: col.width, width: col.width } : { minWidth: col.width, width: col.width }}>
                    <span>{col.label}</span>{sortColumn === col.key ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((record) => (
                <tr key={record.sysId}>
                  {attendanceColumns.filter((col) => visibleColumns.includes(col.key)).map((col) => (
                    <td key={col.key} className={col.sticky ? "sticky-col" : ""}
                      style={col.sticky ? { left: stickyLeft(col.key), minWidth: col.width, width: col.width } : { minWidth: col.width, width: col.width }}>
                      {col.key === "status" ? statusBadge(record.status)
                        : col.key === "actualShift" ? <span className="shift-pill">{record.actualShift}</span>
                        : String(record[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showReportModal && (
        <ManpowerDeploymentReportModal
          zone={reportZone || "05"}
          shift="A"
          date={reportDate}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
