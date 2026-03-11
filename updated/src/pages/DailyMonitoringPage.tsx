import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, Monitor, Radio, RefreshCw, Search, Wifi, WifiOff } from "lucide-react";
import { generateMonitoringDevices, monitoringSummaryCards } from "../data";

export function DailyMonitoringPage({ wards }: { wards: string[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [summaryView, setSummaryView] = useState("face-detection");
  const [copied, setCopied] = useState(false);

  const devices = useMemo(() => generateMonitoringDevices(wards), [wards]);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch = device.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) || device.imei.toLowerCase().includes(searchQuery.toLowerCase()) || device.ward.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || device.assetCategory === categoryFilter;
      const matchesStatus = statusFilter === "All" || device.deviceStatus === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [devices, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDevices.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedDevices = filteredDevices.slice((safeCurrentPage - 1) * rowsPerPage, safeCurrentPage * rowsPerPage);

  const handleCopyTable = () => {
    const text = [
      ["Sr No","Device Status","Asset Code","Asset Category","Imei/SL/Mfg. No","Ward No"].join("\t"),
      ...filteredDevices.map((device, idx) => [idx + 1, device.deviceStatus, device.assetCode, device.assetCategory, device.imei, device.ward].join("\t"))
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };

  const handleExportCSV = () => {
    const csv = ["Sr No,Device Status,Asset Code,Asset Category,Imei/SL/Mfg. No,Ward No",
      ...filteredDevices.map((device, idx) => [idx + 1, device.deviceStatus, device.assetCode, device.assetCategory, device.imei, device.ward].map((v) => JSON.stringify(String(v))).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "daily-monitoring-live-status.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="dm-head">
        <div><h3><Monitor size={20} /> Hardware - Live Status</h3></div>
        <div className="dm-head-actions">
          <select value={summaryView} onChange={(e) => setSummaryView(e.target.value)}>
            <option value="rfid">RFID Reader Summary</option>
            <option value="face-detection">Face Detection Machine Summary</option>
            <option value="uhf">RFID Reader For RC Compactor</option>
          </select>
          <button className="ghost icon-only"><RefreshCw size={14} /></button>
        </div>
      </div>

      <div className="dm-summary-grid">
        {monitoringSummaryCards.map((device) => {
          const IconComponent = device.icon;
          return (
            <article key={device.id} className="card dm-summary-card">
              <div className={device.total > 0 ? "dm-icon active" : "dm-icon"}><IconComponent size={26} /></div>
              <strong>{device.total}</strong><p>{device.title}</p>
              <div className="dm-mini-stats">
                <div><small>ONLINE</small><span className="ok">{device.online}</span></div>
                <div><small>COMPLIANCE%</small><span className="info">{device.compliance}</span></div>
                <div><small>OFFLINE</small><span className="bad">{device.offline}</span></div>
              </div>
            </article>
          );
        })}
      </div>

      {/* <div className="card dm-section">
        <div className="dm-section-head"><h4>RFID Reader Summary</h4><button className="ghost icon-only"><RefreshCw size={14} /></button></div>
        <div className="dm-empty"><Radio size={28} /><p>No RFID Reader data available</p></div>
      </div> */}

      <div className="card dm-section">
        <div className="dm-section-head"><h4>Face Detection Machine Summary</h4><button className="ghost icon-only"><RefreshCw size={14} /></button></div>
        <div className="dm-table-controls">
          <div className="dm-left-controls">
            <span>Show</span>
            <select value={String(rowsPerPage)} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value="10">10 rows</option><option value="25">25 rows</option><option value="50">50 rows</option>
            </select>
            <span>entries</span>
          </div>
          <div className="dm-right-controls">
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
              <option value="All">All Categories</option>
              <option value="RFID Reader">RFID Reader</option>
              <option value="Face Detection Machine">Face Detection Machine</option>
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="All">All Status</option><option value="Online">Online</option><option value="Offline">Offline</option>
            </select>
            <button className="ghost" onClick={handleCopyTable}><Copy size={14} /> {copied ? "Copied" : "Copy"}</button>
            <button className="ghost" onClick={handleExportCSV}><FileSpreadsheet size={14} /> CSV</button>
          </div>
        </div>
        <div className="dm-search-row">
          <div className="searchbox"><Search size={16} /><input placeholder="Search..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} /></div>
        </div>
        <div className="dm-table-wrap">
          <table className="dm-table">
            <thead><tr><th>Sr No</th><th>Device Status</th><th>Asset Code</th><th>Asset Category</th><th>Imei/SL/Mfg. No</th><th>Ward No</th></tr></thead>
            <tbody>
              {paginatedDevices.map((device, idx) => (
                <tr key={device.id}>
                  <td>{(safeCurrentPage - 1) * rowsPerPage + idx + 1}</td>
                  <td><span className={device.deviceStatus === "Online" ? "dm-badge online" : "dm-badge offline"}>{device.deviceStatus === "Online" ? <Wifi size={12} /> : <WifiOff size={12} />}{device.deviceStatus}</span></td>
                  <td className="mono">{device.assetCode}</td><td>{device.assetCategory}</td>
                  <td className="mono">{device.imei}</td><td>{device.ward}</td>
                </tr>
              ))}
              {!paginatedDevices.length && <tr><td colSpan={6} className="dm-empty-row">No records found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="dm-pagination">
          <div>Showing {filteredDevices.length ? (safeCurrentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(safeCurrentPage * rowsPerPage, filteredDevices.length)} of {filteredDevices.length} entries</div>
          <div className="dm-pagination-controls">
            <button className="ghost" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Previous</button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button key={pageNum} className={pageNum === safeCurrentPage ? "dm-page active" : "dm-page"} onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>
            ))}
            <button className="ghost" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </div>
    </>
  );
}
