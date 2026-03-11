import { useRef, useMemo, useState } from "react";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, Clock3, Columns3, Copy, Download, Eye, RefreshCw, Search, TriangleAlert, X } from "lucide-react";
import { ZONES, FIELD_ACTIVITY_TABS, FIELD_STAFF_COLUMNS, generateFieldStaffData } from "../data";
import type { StaffRecord } from "../types";

const FIELD_STAFF_ACTIVITY_COLUMNS = FIELD_STAFF_COLUMNS.filter((column) => column.key !== "remarks1");

export function FieldStaffActivityPage({ zones, wards }: { zones: string[]; wards: string[] }) {
  const [activeTab, setActiveTab] = useState<string>(FIELD_ACTIVITY_TABS[0]);
  const [zone, setZone] = useState("all");
  const [ward, setWard] = useState("all");
  const [activityStatus, setActivityStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<(keyof StaffRecord)[]>(FIELD_STAFF_ACTIVITY_COLUMNS.map((c) => c.key));
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const tabsRef = useRef<HTMLDivElement | null>(null);

  const data = useMemo(() => generateFieldStaffData(activeTab, wards), [activeTab, wards]);

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (activityStatus !== "all" && row.status.toLowerCase() !== activityStatus) return false;
      if (zone !== "all" && row.zone !== zone) return false;
      if (ward !== "all" && row.ward !== ward) return false;
      const rowDateTime = new Date(`${row.dateOfCreation}T00:00`);
      if (fromDate && rowDateTime < new Date(fromDate)) return false;
      if (toDate && rowDateTime > new Date(toDate)) return false;
      const q = tableSearch.trim().toLowerCase();
      if (!q) return true;
      return row.hhName.toLowerCase().includes(q) || row.hhNumber.toLowerCase().includes(q) || row.location.toLowerCase().includes(q);
    });
  }, [data, activityStatus, zone, ward, fromDate, toDate, tableSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const start = (safeCurrentPage - 1) * entriesPerPage;
  const paginatedData = filtered.slice(start, start + entriesPerPage);
  const visibleDefs = FIELD_STAFF_ACTIVITY_COLUMNS.filter((c) => visibleColumns.includes(c.key));

  const summaryStats = useMemo(() => ({
    total: filtered.length,
    closed: filtered.filter((d) => d.status === "Closed").length,
    open: filtered.filter((d) => d.status === "Open").length,
    pending: filtered.filter((d) => d.status === "Pending").length
  }), [filtered]);

  const exportCsv = () => {
    const csv = [visibleDefs.map((c) => c.label).join(","), ...filtered.map((row) => visibleDefs.map((col) => JSON.stringify(String(row[col.key]))).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "field-staff-activity.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  const handleCopy = () => {
    const text = [visibleDefs.map((c) => c.label).join("\t"), ...filtered.map((row) => visibleDefs.map((col) => String(row[col.key])).join("\t"))].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };

  const scrollTabs = (dir: "left" | "right") => tabsRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  const toggleColumn = (key: keyof StaffRecord) => setVisibleColumns((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const getStatusBadge = (status: StaffRecord["status"]) => {
    if (status === "Closed") return <span className="fsa-status closed">Closed</span>;
    if (status === "Open") return <span className="fsa-status open">Open</span>;
    return <span className="fsa-status pending">Pending</span>;
  };

  return (
    <div className="report-page-layout fsa-report-layout">
      <div className="fsa-head"><button className="ghost icon-only"><RefreshCw size={15} /></button></div>

      <div className="fsa-header">
        <div className="fsa-tabs-wrap">
          <button className="ghost icon-only fsa-tab-scroll" onClick={() => scrollTabs("left")}><ChevronLeft size={15} /></button>
          <div ref={tabsRef} className="fsa-tabs-track">
            {FIELD_ACTIVITY_TABS.map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }} className={activeTab === tab ? "fsa-tab active" : "fsa-tab"}>{tab}</button>
            ))}
          </div>
          <button className="ghost icon-only fsa-tab-scroll" onClick={() => scrollTabs("right")}><ChevronRight size={15} /></button>
        </div>

        <div className="card fsa-filter-card">
          <div className="fsa-filter-row">
            <label><span>Zone</span><select value={zone} onChange={(e) => { setZone(e.target.value); setCurrentPage(1); }}><option value="all">All Zones</option>{zones.map((z) => <option key={z} value={z}>{z}</option>)}</select></label>
            <label><span>Ward</span><select value={ward} onChange={(e) => { setWard(e.target.value); setCurrentPage(1); }}><option value="all">All Wards</option>{wards.map((w) => <option key={w} value={w}>{w}</option>)}</select></label>
            <label><span>Activity Status</span>
              <select value={activityStatus} onChange={(e) => { setActivityStatus(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Status</option><option value="closed">Closed</option><option value="open">Open</option><option value="pending">Pending</option>
              </select>
            </label>
            <div className="report-date-pair">
              <label className="report-date-field"><span>From Date</span><input type="datetime-local" step={60} className="date-time-input" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }} /></label>
              <label className="report-date-field"><span>To Date</span><input type="datetime-local" step={60} className="date-time-input" value={toDate} onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }} /></label>
            </div>
            <div className="fsa-filter-actions">
              <button className="primary" onClick={() => setCurrentPage(1)}><Search size={14} /> Search</button>
              <button className="ghost" onClick={exportCsv}><Download size={14} /> Export</button>
            </div>
          </div>
        </div>
      </div>

      <div className="fsa-summary">
        <article className="card"><div className="icon blue"><ClipboardList size={16} /></div><strong>{summaryStats.total}</strong><span>Total Activities</span></article>
        <article className="card"><div className="icon green"><CheckCircle2 size={16} /></div><strong>{summaryStats.closed}</strong><span>Closed</span></article>
        <article className="card"><div className="icon indigo"><TriangleAlert size={16} /></div><strong>{summaryStats.open}</strong><span>Open</span></article>
        <article className="card"><div className="icon amber"><Clock3 size={16} /></div><strong>{summaryStats.pending}</strong><span>Pending</span></article>
      </div>

      <div className="fsa-table-controls">
        <div className="searchbox"><Search size={16} /><input placeholder="Search records..." value={tableSearch} onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }} /></div>
        <div className="fsa-table-actions">
          <select value={String(entriesPerPage)} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value="10">10 entries</option><option value="25">25 entries</option><option value="50">50 entries</option>
          </select>
          <button className="ghost" onClick={handleCopy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button>
          <button className="ghost" onClick={exportCsv}><Download size={14} /> Export</button>
          <div className="fsa-col-menu-wrap">
            <button className="ghost" onClick={() => setShowColumnToggle((v) => !v)}><Columns3 size={14} /> Columns</button>
            {showColumnToggle && (
              <div className="fsa-col-menu">
                {FIELD_STAFF_ACTIVITY_COLUMNS.map((col) => (
                  <label key={col.key}><input type="checkbox" checked={visibleColumns.includes(col.key)} onChange={() => toggleColumn(col.key)} /><span>{col.label}</span></label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card fsa-table-card report-table-card">
        <div className="fsa-table-wrap report-table-scroll">
          <table className="fsa-table">
            <thead><tr>{visibleDefs.map((col) => <th key={col.key}>{col.label}</th>)}</tr></thead>
            <tbody>
              {paginatedData.length === 0 && <tr><td colSpan={visibleDefs.length} className="fsa-empty">No records found</td></tr>}
              {paginatedData.map((row, idx) => (
                <tr key={row.srNo} className={idx % 2 ? "strip" : ""}>
                  {visibleColumns.includes("srNo") && <td>{row.srNo}</td>}
                  {visibleColumns.includes("taskGroup") && <td>{row.taskGroup}</td>}
                  {visibleColumns.includes("taskName") && <td className="truncate">{row.taskName}</td>}
                  {visibleColumns.includes("dateOfCreation") && <td>{row.dateOfCreation}</td>}
                  {visibleColumns.includes("status") && <td>{getStatusBadge(row.status)}</td>}
                  {visibleColumns.includes("hhName") && <td>{row.hhName}</td>}
                  {visibleColumns.includes("hhNumber") && <td>{row.hhNumber}</td>}
                  {visibleColumns.includes("image") && <td><button className="fsa-view-image" onClick={() => setPreviewImage(row.image)}><Eye size={14} /></button></td>}
                  {visibleColumns.includes("collectionType") && <td>{row.collectionType}</td>}
                  {visibleColumns.includes("zone") && <td>{row.zone}</td>}
                  {visibleColumns.includes("ward") && <td>{row.ward}</td>}
                  {visibleColumns.includes("location") && <td>{row.location}</td>}
                  {visibleColumns.includes("bovRouteNo") && <td>{row.bovRouteNo}</td>}
                  {visibleColumns.includes("noOfHH") && <td>{row.noOfHH}</td>}
                  {visibleColumns.includes("noOfHHSegregating") && <td>{row.noOfHHSegregating}</td>}
                  {visibleColumns.includes("contactNumber") && <td>{row.contactNumber}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fsa-pagination">
        <p>Showing {filtered.length ? start + 1 : 0} to {Math.min(start + entriesPerPage, filtered.length)} of {filtered.length} entries</p>
        <div className="fsa-pages">
          <button className="ghost" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}><ChevronLeft size={14} /></button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = safeCurrentPage <= 3 ? i + 1 : safeCurrentPage + i - 2;
            if (page < 1 || page > totalPages) return null;
            return <button key={page} className={page === safeCurrentPage ? "fsa-page active" : "fsa-page"} onClick={() => setCurrentPage(page)}>{page}</button>;
          })}
          <button className="ghost" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}><ChevronRight size={14} /></button>
        </div>
      </div>

      {previewImage && (
        <div className="fsa-preview-backdrop" onClick={() => setPreviewImage(null)}>
          <div className="fsa-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fsa-preview-head"><h4>Image Preview</h4><button className="ghost icon-only" onClick={() => setPreviewImage(null)}><X size={15} /></button></div>
            <div className="fsa-preview-body"><img src={previewImage} alt="Activity" /></div>
          </div>
        </div>
      )}
    </div>
  );
}
