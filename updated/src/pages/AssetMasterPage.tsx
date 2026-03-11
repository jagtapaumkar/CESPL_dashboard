import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Download, Plus, Search, X } from "lucide-react";
import { assetSubCategories, blankAssetForm, initialAssets, ZONES } from "../data";
import { nowStamp } from "../utils";
import type { AssetRecord, AssetFormData, AssetStatus } from "../types";

export function AssetMasterPage() {
  const [assets, setAssets] = useState<AssetRecord[]>(initialAssets);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
  const [formData, setFormData] = useState<AssetFormData>(blankAssetForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AssetFormData, string>>>({});

  const zones = useMemo(() => Array.from(new Set(assets.map((a) => a.zoneNo))).sort(), [assets]);
  const wards = useMemo(() => Array.from(new Set(assets.map((a) => a.wardNo))).sort((a, b) => Number(a) - Number(b)), [assets]);
  const categories = Object.keys(assetSubCategories);
  const formZoneOptions = zones.length ? zones : Array.from(ZONES);
  const formWardOptions = wards.length ? wards : ["1","2","3","4","5"];

  const filtered = useMemo(() => assets.filter((row) => {
    const q = query.trim().toLowerCase();
    const bySearch = !q || `${row.assetCode} ${row.category} ${row.subCategory} ${row.zoneNo} ${row.wardNo}`.toLowerCase().includes(q);
    return bySearch && (statusFilter === "all" || row.status === statusFilter) && (categoryFilter === "all" || row.category === categoryFilter) && (zoneFilter === "all" || row.zoneNo === zoneFilter);
  }), [assets, query, statusFilter, categoryFilter, zoneFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const start = (safeCurrentPage - 1) * rowsPerPage;
  const visibleRows = filtered.slice(start, start + rowsPerPage);
  const summary = useMemo(() => ({ total: assets.length, active: assets.filter((a) => a.status === "active").length, maintenance: assets.filter((a) => a.status === "maintenance").length, inactive: assets.filter((a) => a.status === "inactive").length }), [assets]);

  const resetForm = () => { setFormData(blankAssetForm); setFormErrors({}); setEditingAsset(null); };
  const openAdd = () => { resetForm(); setModalOpen(true); };
  const openEdit = (asset: AssetRecord) => {
    setEditingAsset(asset);
    setFormData({ assetCode: asset.assetCode, category: asset.category, subCategory: asset.subCategory, imeiNo: asset.imeiNo, wardNo: asset.wardNo, zoneNo: asset.zoneNo, location: asset.location, installedArea: asset.installedArea, chassisNo: asset.chassisNo, otherNo: asset.otherNo, dateOfInstallation: asset.dateOfInstallation, installedBy: asset.installedBy, status: asset.status });
    setFormErrors({}); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); resetForm(); };

  const setField = (field: keyof AssetFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value as AssetFormData[keyof AssetFormData] }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "category") setFormData((prev) => ({ ...prev, subCategory: "" }));
  };

  const validate = () => {
    const errors: Partial<Record<keyof AssetFormData, string>> = {};
    if (!formData.assetCode.trim()) errors.assetCode = "Asset code is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.subCategory) errors.subCategory = "Sub-category is required";
    if (!formData.wardNo) errors.wardNo = "Ward is required";
    if (!formData.zoneNo) errors.zoneNo = "Zone is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.installedArea.trim()) errors.installedArea = "Installed area is required";
    if (!formData.dateOfInstallation) errors.dateOfInstallation = "Installation date is required";
    if (!formData.installedBy.trim()) errors.installedBy = "Installer name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = () => {
    if (!validate()) return;
    if (editingAsset) {
      setAssets((prev) => prev.map((item) => item.id === editingAsset.id ? { ...item, ...formData, lastModifiedOn: nowStamp() } : item));
      closeModal(); return;
    }
    const newId = `AST-${String((assets.length || 0) + 1).padStart(3, "0")}`;
    setAssets((prev) => [{ id: newId, ...formData, lastModifiedOn: nowStamp() }, ...prev]);
    closeModal();
  };

  const exportCsv = () => {
    const csv = ["Asset Code,Category,Sub Category,Zone,Ward,Location,Installed By,Date,Status",
      ...filtered.map((row) => [row.assetCode,row.category,row.subCategory,row.zoneNo,row.wardNo,row.location,row.installedBy,row.dateOfInstallation,row.status].map((v) => JSON.stringify(String(v))).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "asset-master.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  const statusPill = (status: AssetStatus) => {
    if (status === "active") return <span className="asset-status active">Active</span>;
    if (status === "maintenance") return <span className="asset-status maintenance">Maintenance</span>;
    return <span className="asset-status inactive">Inactive</span>;
  };

  return (
    <>
      <div className="asset-head">
        <div className="asset-head-actions">
          <button className="ghost" onClick={() => { navigator.clipboard.writeText(filtered.map(r => Object.values(r).join("\t")).join("\n")); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button>
          <button className="ghost" onClick={exportCsv}><Download size={14} /> Export</button>
          <button className="primary" onClick={openAdd}><Plus size={14} /> Add Asset</button>
        </div>
      </div>

      <div className="asset-summary">
        <article className="card"><p>Total Assets</p><strong>{summary.total}</strong></article>
        <article className="card"><p>Active</p><strong className="ok">{summary.active}</strong></article>
        <article className="card"><p>Maintenance</p><strong className="warn">{summary.maintenance}</strong></article>
        <article className="card"><p>Inactive</p><strong className="bad">{summary.inactive}</strong></article>
      </div>

      <div className="card asset-filter-card">
        <div className="asset-filters">
          <div className="searchbox"><Search size={16} /><input value={query} onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }} placeholder="Search asset code, category, location..." /></div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Status</option><option value="active">Active</option><option value="maintenance">Maintenance</option><option value="inactive">Inactive</option>
          </select>
          <select value={zoneFilter} onChange={(e) => { setZoneFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Zones</option>{formZoneOptions.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <select value={String(rowsPerPage)} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value="10">10 rows</option><option value="25">25 rows</option><option value="50">50 rows</option>
          </select>
        </div>
      </div>

      <div className="card asset-table-card">
        <div className="asset-table-wrap">
          <table className="asset-table">
            <thead><tr><th>Asset Code</th><th>Category</th><th>Sub Category</th><th>Zone</th><th>Ward</th><th>Location</th><th>Installed By</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.assetCode}</td><td>{row.category}</td><td>{row.subCategory}</td><td>{row.zoneNo}</td><td>{row.wardNo}</td><td>{row.location}</td><td>{row.installedBy}</td><td>{row.dateOfInstallation}</td><td>{statusPill(row.status)}</td>
                  <td><button className="ghost" onClick={() => openEdit(row)}>Edit</button></td>
                </tr>
              ))}
              {!visibleRows.length && <tr><td colSpan={10} className="asset-empty">No assets found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="asset-pagination">
          <p>Showing {filtered.length ? start + 1 : 0} to {Math.min(start + rowsPerPage, filtered.length)} of {filtered.length}</p>
          <div className="asset-pages">
            <button className="ghost" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}><ChevronLeft size={14} /></button>
            <button className="asset-page active">{safeCurrentPage}</button>
            <button className="ghost" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="asset-modal-backdrop" onClick={closeModal}>
          <section className="asset-modal" onClick={(e) => e.stopPropagation()}>
            <div className="asset-modal-head"><h4>{editingAsset ? "Edit Asset" : "Add New Asset"}</h4><button className="ghost icon-only" onClick={closeModal}><X size={15} /></button></div>
            <div className="asset-modal-body">
              <div className="asset-form-grid">
                <label className="ops-field"><span>Asset Code <i>*</i></span><input value={formData.assetCode} onChange={(e) => setField("assetCode", e.target.value)} placeholder="VEH001" />{formErrors.assetCode && <small className="form-error">{formErrors.assetCode}</small>}</label>
                <label className="ops-field"><span>Category <i>*</i></span>
                  <select value={formData.category} onChange={(e) => setField("category", e.target.value)}>
                    <option value="">Select category</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>{formErrors.category && <small className="form-error">{formErrors.category}</small>}
                </label>
                <label className="ops-field"><span>Sub-Category <i>*</i></span>
                  <select value={formData.subCategory} onChange={(e) => setField("subCategory", e.target.value)} disabled={!formData.category}>
                    <option value="">Select sub-category</option>{(assetSubCategories[formData.category] || []).map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                  </select>{formErrors.subCategory && <small className="form-error">{formErrors.subCategory}</small>}
                </label>
                <label className="ops-field"><span>IMEI/SL No.</span><input value={formData.imeiNo} onChange={(e) => setField("imeiNo", e.target.value)} placeholder="Enter IMEI or Serial" /></label>
                <label className="ops-field"><span>Zone <i>*</i></span>
                  <select value={formData.zoneNo} onChange={(e) => setField("zoneNo", e.target.value)}>
                    <option value="">Select zone</option>{formZoneOptions.map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>{formErrors.zoneNo && <small className="form-error">{formErrors.zoneNo}</small>}
                </label>
                <label className="ops-field"><span>Ward <i>*</i></span>
                  <select value={formData.wardNo} onChange={(e) => setField("wardNo", e.target.value)}>
                    <option value="">Select ward</option>{formWardOptions.map((w) => <option key={w} value={w}>Ward {w}</option>)}
                  </select>{formErrors.wardNo && <small className="form-error">{formErrors.wardNo}</small>}
                </label>
                <label className="ops-field"><span>Location <i>*</i></span><input value={formData.location} onChange={(e) => setField("location", e.target.value)} placeholder="Enter location" />{formErrors.location && <small className="form-error">{formErrors.location}</small>}</label>
                <label className="ops-field"><span>Installed Area <i>*</i></span><input value={formData.installedArea} onChange={(e) => setField("installedArea", e.target.value)} placeholder="Enter installed area" />{formErrors.installedArea && <small className="form-error">{formErrors.installedArea}</small>}</label>
                <label className="ops-field"><span>Chassis No.</span><input value={formData.chassisNo} onChange={(e) => setField("chassisNo", e.target.value)} placeholder="Enter chassis number" /></label>
                <label className="ops-field"><span>Other No.</span><input value={formData.otherNo} onChange={(e) => setField("otherNo", e.target.value)} placeholder="Registration, etc." /></label>
                <label className="ops-field"><span>Installation Date <i>*</i></span><input type="date" value={formData.dateOfInstallation} onChange={(e) => setField("dateOfInstallation", e.target.value)} />{formErrors.dateOfInstallation && <small className="form-error">{formErrors.dateOfInstallation}</small>}</label>
                <label className="ops-field"><span>Installed By <i>*</i></span><input value={formData.installedBy} onChange={(e) => setField("installedBy", e.target.value)} placeholder="Enter installer name" />{formErrors.installedBy && <small className="form-error">{formErrors.installedBy}</small>}</label>
                <label className="ops-field asset-full-row"><span>Status <i>*</i></span>
                  <select value={formData.status} onChange={(e) => setField("status", e.target.value)}>
                    <option value="active">Active</option><option value="maintenance">Maintenance</option><option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="asset-modal-foot">
              <button className="ghost" onClick={closeModal}>Cancel</button>
              <button className="primary" onClick={handleSubmitForm}>{editingAsset ? "Update Asset" : "Add Asset"}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
