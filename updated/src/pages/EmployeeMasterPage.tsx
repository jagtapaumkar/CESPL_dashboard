import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Download, Plus, Search, X } from "lucide-react";
import { blankEmployeeForm, initialEmployees, ZONES } from "../data";
import type { EmployeeRecord, EmployeeFormData, EmployeeStatus } from "../types";

export function EmployeeMasterPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>(initialEmployees);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>(blankEmployeeForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  const zones = useMemo(() => Array.from(new Set(employees.map((e) => e.zone))).sort(), [employees]);
  const wards = useMemo(() => Array.from(new Set(employees.map((e) => e.ward))).sort((a, b) => Number(a) - Number(b)), [employees]);
  const departments = useMemo(() => Array.from(new Set(employees.map((e) => e.department))).sort(), [employees]);

  const designationOptions = ["Driver","Sweeper","Helper","Supervisor","Manager"];
  const departmentOptions = departments.length ? departments : ["Transport","Sanitation","Operations","Administration"];
  const zoneOptions = zones.length ? zones : Array.from(ZONES);
  const wardOptions = wards.length ? wards : ["1","2","3","4","5"];
  const shiftOptions = ["Shift A","Shift B","Shift C"];
  const kpiOptions = ["6.2 Deployment","5.1 Sweeping","5.6 Horticultural","7.1 Bins"];

  const filtered = useMemo(() => employees.filter((row) => {
    const q = query.trim().toLowerCase();
    const bySearch = !q || `${row.empCode} ${row.name} ${row.designation} ${row.department} ${row.zone}`.toLowerCase().includes(q);
    return bySearch && (statusFilter === "all" || row.status === statusFilter) && (departmentFilter === "all" || row.department === departmentFilter) && (zoneFilter === "all" || row.zone === zoneFilter);
  }), [employees, query, statusFilter, departmentFilter, zoneFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const start = (safeCurrentPage - 1) * rowsPerPage;
  const visibleRows = filtered.slice(start, start + rowsPerPage);
  const summary = useMemo(() => ({ total: employees.length, active: employees.filter((e) => e.status === "active").length, inactive: employees.filter((e) => e.status === "inactive").length, onLeave: employees.filter((e) => e.status === "on-leave").length }), [employees]);

  const resetForm = () => { setFormData(blankEmployeeForm); setFormErrors({}); setEditingEmployee(null); };
  const openAdd = () => { resetForm(); setModalOpen(true); };
  const openEdit = (employee: EmployeeRecord) => {
    setEditingEmployee(employee);
    setFormData({ empCode: employee.empCode, name: employee.name, designation: employee.designation, department: employee.department, zone: employee.zone, ward: employee.ward, shift: employee.shift, contactNo: employee.contactNo, joiningDate: employee.joiningDate, status: employee.status, kpiCategory: employee.kpiCategory });
    setFormErrors({}); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); resetForm(); };

  const setField = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value as EmployeeFormData[keyof EmployeeFormData] }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errors: Partial<Record<keyof EmployeeFormData, string>> = {};
    if (!formData.empCode.trim()) errors.empCode = "Employee code is required";
    if (formData.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (!formData.designation) errors.designation = "Designation is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.zone) errors.zone = "Zone is required";
    if (!formData.ward) errors.ward = "Ward is required";
    if (!formData.shift) errors.shift = "Shift is required";
    if (formData.contactNo.trim().length < 10) errors.contactNo = "Contact number must be at least 10 digits";
    if (!formData.joiningDate) errors.joiningDate = "Joining date is required";
    if (!formData.kpiCategory) errors.kpiCategory = "KPI category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = () => {
    if (!validate()) return;
    if (editingEmployee) {
      setEmployees((prev) => prev.map((item) => item.id === editingEmployee.id ? { ...item, ...formData } : item));
      closeModal(); return;
    }
    const newId = `EMP-${String((employees.length || 0) + 1).padStart(3, "0")}`;
    setEmployees((prev) => [{ id: newId, ...formData }, ...prev]);
    closeModal();
  };

  const exportCsv = () => {
    const csv = ["Emp Code,Name,Designation,Department,Zone,Ward,Shift,Contact,Status,KPI Category",
      ...filtered.map((row) => [row.empCode,row.name,row.designation,row.department,row.zone,row.ward,row.shift,row.contactNo,row.status,row.kpiCategory].map((v) => JSON.stringify(String(v))).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "employee-master.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  const statusPill = (status: EmployeeStatus) => {
    if (status === "active") return <span className="asset-status active">Present</span>;
    if (status === "inactive") return <span className="asset-status inactive">Absent</span>;
    return <span className="asset-status on-leave">On Leave</span>;
  };

  return (
    <>
      <div className="asset-head">
        <div className="asset-head-actions">
          <button className="ghost" onClick={() => { navigator.clipboard.writeText(filtered.map(r => Object.values(r).join("\t")).join("\n")); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button>
          <button className="ghost" onClick={exportCsv}><Download size={14} /> Export</button>
          <button className="primary" onClick={openAdd}><Plus size={14} /> Add Employee</button>
        </div>
      </div>

      <div className="asset-summary">
        <article className="card"><p>Total Employees</p><strong>{summary.total}</strong></article>
        <article className="card"><p>Present</p><strong className="ok">{summary.active}</strong></article>
        <article className="card"><p>On Leave</p><strong className="warn">{summary.onLeave}</strong></article>
        <article className="card"><p>Absent</p><strong className="bad">{summary.inactive}</strong></article>
      </div>

      <div className="card asset-filter-card">
        <div className="asset-filters">
          <div className="searchbox"><Search size={16} /><input value={query} onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }} placeholder="Search code, name, department..." /></div>
          <select value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Departments</option>{departmentOptions.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Status</option><option value="active">Present</option><option value="on-leave">On Leave</option><option value="inactive">Absent</option>
          </select>
          <select value={zoneFilter} onChange={(e) => { setZoneFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Zones</option>{zoneOptions.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <select value={String(rowsPerPage)} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value="10">10 rows</option><option value="25">25 rows</option><option value="50">50 rows</option>
          </select>
        </div>
      </div>

      <div className="card asset-table-card">
        <div className="asset-table-wrap">
          <table className="asset-table">
            <thead><tr><th>Emp Code</th><th>Name</th><th>Designation</th><th>Department</th><th>Zone</th><th>Ward</th><th>Shift</th><th>Contact</th><th>Status</th><th>KPI Category</th><th>Action</th></tr></thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.empCode}</td><td>{row.name}</td><td>{row.designation}</td><td>{row.department}</td><td>{row.zone}</td><td>{row.ward}</td><td>{row.shift}</td><td>{row.contactNo}</td><td>{statusPill(row.status)}</td><td>{row.kpiCategory}</td>
                  <td><button className="ghost" onClick={() => openEdit(row)}>Edit</button></td>
                </tr>
              ))}
              {!visibleRows.length && <tr><td colSpan={11} className="asset-empty">No employees found</td></tr>}
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
            <div className="asset-modal-head"><h4>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h4><button className="ghost icon-only" onClick={closeModal}><X size={15} /></button></div>
            <div className="asset-modal-body">
              <div className="asset-form-grid">
                <label className="ops-field"><span>Employee Code <i>*</i></span><input value={formData.empCode} onChange={(e) => setField("empCode", e.target.value)} placeholder="EMP001" />{formErrors.empCode && <small className="form-error">{formErrors.empCode}</small>}</label>
                <label className="ops-field"><span>Full Name <i>*</i></span><input value={formData.name} onChange={(e) => setField("name", e.target.value)} placeholder="Enter full name" />{formErrors.name && <small className="form-error">{formErrors.name}</small>}</label>
                <label className="ops-field"><span>Designation <i>*</i></span>
                  <select value={formData.designation} onChange={(e) => setField("designation", e.target.value)}>
                    <option value="">Select designation</option>{designationOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>{formErrors.designation && <small className="form-error">{formErrors.designation}</small>}
                </label>
                <label className="ops-field"><span>Department <i>*</i></span>
                  <select value={formData.department} onChange={(e) => setField("department", e.target.value)}>
                    <option value="">Select department</option>{departmentOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>{formErrors.department && <small className="form-error">{formErrors.department}</small>}
                </label>
                <label className="ops-field"><span>Zone <i>*</i></span>
                  <select value={formData.zone} onChange={(e) => setField("zone", e.target.value)}>
                    <option value="">Select zone</option>{zoneOptions.map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>{formErrors.zone && <small className="form-error">{formErrors.zone}</small>}
                </label>
                <label className="ops-field"><span>Ward <i>*</i></span>
                  <select value={formData.ward} onChange={(e) => setField("ward", e.target.value)}>
                    <option value="">Select ward</option>{wardOptions.map((w) => <option key={w} value={w}>Ward {w}</option>)}
                  </select>{formErrors.ward && <small className="form-error">{formErrors.ward}</small>}
                </label>
                <label className="ops-field"><span>Shift <i>*</i></span>
                  <select value={formData.shift} onChange={(e) => setField("shift", e.target.value)}>
                    <option value="">Select shift</option>{shiftOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>{formErrors.shift && <small className="form-error">{formErrors.shift}</small>}
                </label>
                <label className="ops-field"><span>Contact Number <i>*</i></span><input value={formData.contactNo} onChange={(e) => setField("contactNo", e.target.value)} placeholder="+91 98765 43210" />{formErrors.contactNo && <small className="form-error">{formErrors.contactNo}</small>}</label>
                <label className="ops-field"><span>Joining Date <i>*</i></span><input type="date" value={formData.joiningDate} onChange={(e) => setField("joiningDate", e.target.value)} />{formErrors.joiningDate && <small className="form-error">{formErrors.joiningDate}</small>}</label>
                <label className="ops-field"><span>Status <i>*</i></span>
                  <select value={formData.status} onChange={(e) => setField("status", e.target.value)}>
                    <option value="active">Active</option><option value="inactive">Inactive</option><option value="on-leave">On Leave</option>
                  </select>
                </label>
                <label className="ops-field asset-full-row"><span>KPI Category <i>*</i></span>
                  <select value={formData.kpiCategory} onChange={(e) => setField("kpiCategory", e.target.value)}>
                    <option value="">Select KPI category</option>{kpiOptions.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>{formErrors.kpiCategory && <small className="form-error">{formErrors.kpiCategory}</small>}
                </label>
              </div>
            </div>
            <div className="asset-modal-foot">
              <button className="ghost" onClick={closeModal}>Cancel</button>
              <button className="primary" onClick={handleSubmitForm}>{editingEmployee ? "Update Employee" : "Add Employee"}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
