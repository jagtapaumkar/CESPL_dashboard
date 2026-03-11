import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Copy, FileSpreadsheet, Search } from "lucide-react";
import { collectionAssetCategories, collectionReaderCategories, generateCollectionReportRows } from "../data";
import { parseOpsDateTime } from "../utils";
import type { CollectionReportRow } from "../types";

export function CollectionReportsPage({ zones, wards }: { zones: string[]; wards: string[] }) {
  const [zoneFilter, setZoneFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [readerCategoryFilter, setReaderCategoryFilter] = useState("all");
  const [readerZoneFilter, setReaderZoneFilter] = useState("all");
  const [readerWardFilter, setReaderWardFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [scanFilter, setScanFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const rows = useMemo(() => generateCollectionReportRows(zones, wards), [zones, wards]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const byZone = zoneFilter === "all" ? true : row.zoneNo === zoneFilter;
      const byWard = wardFilter === "all" ? true : row.wardNo === wardFilter;
      const byReaderCategory = readerCategoryFilter === "all" ? true : row.readerCategory === readerCategoryFilter;
      const byReaderZone = readerZoneFilter === "all" ? true : row.readerZone === readerZoneFilter;
      const byReaderWard = readerWardFilter === "all" ? true : row.readerWard === readerWardFilter;
      const byShift = shiftFilter === "all" ? true : row.actualShift === shiftFilter;
      const byScan = scanFilter === "all" ? true : row.assetCategory === scanFilter;
      const stamp = parseOpsDateTime(row.lastScannedTime);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const q = search.trim().toLowerCase();
      const bySearch = !q || `${row.assetCode} ${row.assetCategory} ${row.zoneNo} ${row.wardNo}`.toLowerCase().includes(q);
      return byZone && byWard && byReaderCategory && byReaderZone && byReaderWard && byShift && byScan && (from && stamp ? stamp >= from : true) && (to && stamp ? stamp <= to : true) && bySearch;
    });
  }, [rows, zoneFilter, wardFilter, readerCategoryFilter, readerZoneFilter, readerWardFilter, shiftFilter, scanFilter, fromDate, toDate, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const start = (safeCurrentPage - 1) * rowsPerPage;
  const visibleRows = filtered.slice(start, start + rowsPerPage);

  const exportCsv = () => {
    const csv = ["Sr. No,Asset Code,Asset Category,IMEI/SL/MFG.,Tag Vehicle No.,Ward No,Zone No,Reader Category,Total Scanned,Actual Shift,Last Scanned Time",
      ...filtered.map((row) => [row.srNo,row.assetCode,row.assetCategory,row.imeiSlMfg,row.tagVehicleNo,row.wardNo,row.zoneNo,row.readerCategory,row.totalScanned,row.actualShift,row.lastScannedTime].map((v) => JSON.stringify(String(v))).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "collection-report.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  const copyTable = () => {
    const text = filtered.map((row) => [row.srNo,row.assetCode,row.assetCategory,row.wardNo,row.zoneNo,row.actualShift].join("\t")).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };

  const openMap = (row: CollectionReportRow) => {
    const q = encodeURIComponent(`${row.zoneNo}, ward ${row.wardNo}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="report-page-layout cr-report-layout">
      <div className="card cr-wrap">
        <div className="cr-head"><div><p>MIS & Reports</p><h3>All Asset Collection Report</h3></div></div>
        <div className="cr-filter-grid">

  <select value={wardFilter} onChange={(e) => { setWardFilter(e.target.value); setCurrentPage(1); }}>
    <option value="all">Ward</option>
    {wards.map((w) => (
      <option key={w} value={w}>{w}</option>
    ))}
  </select>

  <select value={readerCategoryFilter} onChange={(e) => { setReaderCategoryFilter(e.target.value); setCurrentPage(1); }}>
    <option value="all">Reader Category</option>
    {collectionReaderCategories.map((c) => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>

  <select value={readerZoneFilter} onChange={(e) => { setReaderZoneFilter(e.target.value); setCurrentPage(1); }}>
    <option value="all">Reader Zone</option>
    {zones.map((z) => (
      <option key={z} value={z}>{z}</option>
    ))}
  </select>

  <select value={readerWardFilter} onChange={(e) => { setReaderWardFilter(e.target.value); setCurrentPage(1); }}>
    <option value="all">Reader Ward</option>
    {wards.map((w) => (
      <option key={w} value={w}>{w}</option>
    ))}
  </select>

  <select value={scanFilter} onChange={(e) => { setScanFilter(e.target.value); setCurrentPage(1); }}>
    <option value="all">Asset Category</option>
    {collectionAssetCategories.map((c) => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>

  <select value={shiftFilter} onChange={(e) => { setShiftFilter(e.target.value); setCurrentPage(1); }}>
    <option value="all">All Shifts</option>
    <option value="A">Shift A</option>
    <option value="B">Shift B</option>
    <option value="C">Shift C</option>
  </select>

  <div className="report-date-pair">
    <label className="cr-inline-label report-date-field">
      <span>From</span>
      <input
        type="datetime-local"
        className="date-time-input"
        value={fromDate}
        onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
      />
    </label>

    <label className="cr-inline-label report-date-field">
      <span>To</span>
      <input
        type="datetime-local"
        className="date-time-input"
        value={toDate}
        onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
      />
    </label>
  </div>

  <div className="cr-btns">
    <button className="primary">
      <Search size={16} /> Search
    </button>

    <button className="ghost" onClick={exportCsv}>
      <FileSpreadsheet size={16} /> Export
    </button>
  </div>

</div>
      </div>

      <div className="card cr-table-card report-table-card">
        <div className="cr-table-top">
          <div className="searchbox"><Search size={16} /><input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search Records" /></div>
          <div className="cr-table-actions">
            <span>Show</span>
            <select value={String(rowsPerPage)} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value="10">10</option><option value="25">25</option><option value="50">50</option>
            </select>
            <span>entries</span>
            <button className="ghost" onClick={copyTable}><Copy size={14} /> {copied ? "Copied" : "Copy"}</button>
            <button className="ghost" onClick={exportCsv}><FileSpreadsheet size={14} /> CSV</button>
          </div>
        </div>
        <div className="cr-table-wrap report-table-scroll">
          <table className="cr-table">
            <thead>
              <tr>
                <th>Sr. No</th><th>View On Map</th><th>Asset Code</th><th>Asset Category</th>
                <th>IMEI/SL/MFG.</th><th>Tag Vehicle No.</th><th>Ward No</th><th>Zone No</th>
                <th>Scanned By Reader</th><th>Reader Category</th><th>Reader Vehicle No</th>
                <th>Reader Zone</th><th>Reader Ward</th><th>Total Scanned</th>
                <th>Actual Shift</th><th>Last Scanned Time</th><th>In Time</th><th>Out Time</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.srNo}>
                  <td>{row.srNo}</td>
                  <td><button className="cr-map-btn" onClick={() => openMap(row)}>View On Map</button></td>
                  <td>{row.assetCode}</td><td><span className="cr-tag">{row.assetCategory}</span></td>
                  <td>{row.imeiSlMfg}</td><td>{row.tagVehicleNo}</td><td>{row.wardNo}</td><td>{row.zoneNo}</td>
                  <td>{row.scannedByReader}</td><td>{row.readerCategory}</td><td>{row.readerVehicleNo}</td>
                  <td>{row.readerZone}</td><td>{row.readerWard}</td><td><span className="cr-pill">{row.totalScanned}</span></td>
                  <td>{row.actualShift}</td><td>{row.lastScannedTime}</td><td>{row.inTime}</td><td>{row.outTime}</td>
                </tr>
              ))}
              {!visibleRows.length && <tr><td colSpan={18} className="asset-empty">No collection records found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="cr-pagination">
        <p>Showing {filtered.length ? start + 1 : 0} to {Math.min(start + rowsPerPage, filtered.length)} of {filtered.length} entries</p>
        <div className="asset-pages">
          <button className="ghost" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}><ChevronLeft size={14} /></button>
          {Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1).map((page) => (
            <button key={page} className={page === safeCurrentPage ? "asset-page active" : "asset-page"} onClick={() => setCurrentPage(page)}>{page}</button>
          ))}
          <button className="ghost" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
