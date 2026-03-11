import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, FileSpreadsheet, Plus, Search, X } from "lucide-react";
import { blankGrievanceForm, initialGrievances } from "../data";
import type { GrievanceRecord, GrievanceFormData } from "../types";

export function GrievanceMasterPage() {
  const [grievances, setGrievances] = useState<GrievanceRecord[]>(initialGrievances);
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGrievance, setEditingGrievance] = useState<GrievanceRecord | null>(null);
  const [formData, setFormData] = useState<GrievanceFormData>(blankGrievanceForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof GrievanceFormData, string>>>({});

  const typeOptions = useMemo(() => Array.from(new Set(grievances.map((g) => g.categoryType))).filter(Boolean).sort(), [grievances]);
  const filtered = useMemo(() => grievances.filter((row) => {
    const q = query.trim().toLowerCase();
    const bySearch = !q || `${row.srNo} ${row.categoryName} ${row.slaCategory} ${row.categoryType} ${row.status}`.toLowerCase().includes(q);
    return bySearch && (statusFilter === "all" || row.status === statusFilter) && (typeFilter === "all" || row.categoryType === typeFilter);
  }), [grievances, query, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const start = (safeCurrentPage - 1) * rowsPerPage;
  const visibleRows = filtered.slice(start, start + rowsPerPage);

  const resetForm = () => { setFormData(blankGrievanceForm); setFormErrors({}); setEditingGrievance(null); };
  const openAdd = () => { resetForm(); setModalOpen(true); };
  const openEdit = (row: GrievanceRecord) => {
    setEditingGrievance(row);
    setFormData({ categoryName: row.categoryName, slaCategory: row.slaCategory, categoryType: row.categoryType, status: row.status });
    setFormErrors({}); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); resetForm(); };

  const setField = (field: keyof GrievanceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value as GrievanceFormData[keyof GrievanceFormData] }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errors: Partial<Record<keyof GrievanceFormData, string>> = {};
    if (!formData.categoryName.trim()) errors.categoryName = "Category name is required";
    if (!formData.categoryType.trim()) errors.categoryType = "Category type is required";
    if (!formData.status) errors.status = "Status is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = () => {
    if (!validate()) return;
    if (editingGrievance) {
      setGrievances((prev) => prev.map((item) => item.id === editingGrievance.id ? { ...item, categoryName: formData.categoryName.trim(), slaCategory: formData.slaCategory.trim(), categoryType: formData.categoryType.trim(), status: formData.status } : item));
      closeModal(); return;
    }
    const nextSrNo = grievances.length + 1;
    setGrievances((prev) => [...prev, { id: `GRV-${String(nextSrNo).padStart(3, "0")}`, srNo: nextSrNo, categoryName: formData.categoryName.trim(), slaCategory: formData.slaCategory.trim(), categoryType: formData.categoryType.trim(), status: formData.status }]);
    closeModal();
  };

  const exportCsv = () => {
    const csv = ["Sr. No,Category Name,SLA Category,Category Type,Status",
      ...filtered.map((row) => [row.srNo,row.categoryName,row.slaCategory,row.categoryType,row.status].map((v) => JSON.stringify(String(v))).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "grievance-category-sla.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="asset-head">
        <div><p>Masters / Grievance Category / SLA</p><h3>All Grievance Category Information</h3></div>
        <div className="asset-head-actions">
          <button className="ghost" onClick={() => { navigator.clipboard.writeText(filtered.map(r => [r.srNo,r.categoryName,r.slaCategory,r.categoryType,r.status].join("\t")).join("\n")); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button>
          <button className="ghost" onClick={exportCsv}><FileSpreadsheet size={14} /> CSV</button>
          <button className="primary" onClick={openAdd}><Plus size={14} /> Add Category</button>
        </div>
      </div>

      <div className="card asset-filter-card">
        <div className="asset-filters">
          <div className="searchbox"><Search size={16} /><input value={query} onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }} placeholder="Search category..." /></div>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Category Types</option>{typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Status</option><option value="ACTIVE">ACTIVE</option><option value="DE-ACTIVE">DE-ACTIVE</option>
          </select>
          <select value={String(rowsPerPage)} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value="10">10 rows</option><option value="25">25 rows</option><option value="50">50 rows</option>
          </select>
          <button className="ghost" onClick={() => { setQuery(""); setTypeFilter("all"); setStatusFilter("all"); setCurrentPage(1); }}>Reset</button>
        </div>
      </div>

      <div className="card asset-table-card">
        <div className="asset-table-wrap">
          <table className="asset-table">
            <thead><tr><th>Sr. No</th><th>Category Name</th><th>SLA Category</th><th>Category Type</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.srNo}</td><td>{row.categoryName}</td><td>{row.slaCategory || "-"}</td><td>{row.categoryType}</td>
                  <td><span className={row.status === "ACTIVE" ? "grv-status active" : "grv-status deactive"}>{row.status}</span></td>
                  <td><button className="ghost" onClick={() => openEdit(row)}>Edit</button></td>
                </tr>
              ))}
              {!visibleRows.length && <tr><td colSpan={6} className="asset-empty">No categories found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="asset-pagination">
          <p>Showing {filtered.length ? start + 1 : 0} to {Math.min(start + rowsPerPage, filtered.length)} of {filtered.length} entries</p>
          <div className="asset-pages">
            <button className="ghost" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}><ChevronLeft size={14} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((page) => (
              <button key={page} className={page === safeCurrentPage ? "asset-page active" : "asset-page"} onClick={() => setCurrentPage(page)}>{page}</button>
            ))}
            <button className="ghost" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="asset-modal-backdrop" onClick={closeModal}>
          <section className="asset-modal" onClick={(e) => e.stopPropagation()}>
            <div className="asset-modal-head"><h4>{editingGrievance ? "Edit Grievance Category" : "Add Grievance Category"}</h4><button className="ghost icon-only" onClick={closeModal}><X size={15} /></button></div>
            <div className="asset-modal-body">
              <div className="asset-form-grid">
                <label className="ops-field asset-full-row"><span>Category Name <i>*</i></span><input value={formData.categoryName} onChange={(e) => setField("categoryName", e.target.value)} placeholder="Enter category name" />{formErrors.categoryName && <small className="form-error">{formErrors.categoryName}</small>}</label>
                <label className="ops-field"><span>SLA Category</span><input value={formData.slaCategory} onChange={(e) => setField("slaCategory", e.target.value)} placeholder="Complaint / Service / Infrastructure" /></label>
                <label className="ops-field"><span>Category Type <i>*</i></span>
                  <select value={formData.categoryType} onChange={(e) => setField("categoryType", e.target.value)}>
                    <option value="">Select category type</option>
                    <option value="Complaint">Complaint</option><option value="Services">Services</option><option value="Feedback">Feedback</option>
                  </select>{formErrors.categoryType && <small className="form-error">{formErrors.categoryType}</small>}
                </label>
                <label className="ops-field asset-full-row"><span>Status <i>*</i></span>
                  <select value={formData.status} onChange={(e) => setField("status", e.target.value)}>
                    <option value="ACTIVE">ACTIVE</option><option value="DE-ACTIVE">DE-ACTIVE</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="asset-modal-foot">
              <button className="ghost" onClick={closeModal}>Cancel</button>
              <button className="primary" onClick={handleSubmitForm}>{editingGrievance ? "Update Category" : "Add Category"}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
