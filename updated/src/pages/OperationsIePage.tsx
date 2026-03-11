import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Eye,
  FileText,
  Fingerprint,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Timer,
  TriangleAlert,
  Upload,
  X
} from "lucide-react";
import type { ActionFormData, OpsComplaint, OpsComplaintStatus } from "../types";
import { opsClosingImage, opsComplaintImage } from "../data";

export function OperationsIePage({
  complaints,
  setComplaints,
  search: globalSearch
}: {
  complaints: OpsComplaint[];
  setComplaints: Dispatch<SetStateAction<OpsComplaint[]>>;
  search?: string;
}) {
  const [tab, setTab] = useState<"citizen" | "ie">("citizen");
  const [selectedComplaint, setSelectedComplaint] = useState<OpsComplaint | null>(null);
  const [actionComplaint, setActionComplaint] = useState<OpsComplaint | null>(null);
  const [actionFormData, setActionFormData] = useState<ActionFormData>({
    status: "",
    revisedWard: "",
    revisedStreet: "",
    address: "",
    actionRemarks: "",
    closingImage: null
  });
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);
  const [closingImagePreview, setClosingImagePreview] = useState<string | null>(null);
  const [copiedComplaintId, setCopiedComplaintId] = useState<number | null>(null);
  const [viewCopied, setViewCopied] = useState(false);
  const [copiedImageType, setCopiedImageType] = useState<"before" | "after" | null>(null);
  const [search, setSearch] = useState(globalSearch ?? "");

  useEffect(() => {
    setSearch(globalSearch ?? "");
  }, [globalSearch]);

  const filtered = useMemo(
    () =>
      complaints.filter((item) => {
        const q = search.toLowerCase();
        return (
          item.complaintNo.toLowerCase().includes(q) ||
          item.kpiCategory.toLowerCase().includes(q) ||
          item.zone.toLowerCase().includes(q) ||
          item.issueType.toLowerCase().includes(q) ||
          item.complainantContactNo.includes(q)
        );
      }),
    [complaints, search]
  );

  const counts = useMemo(() => {
    const total = complaints.length;
    const closed = complaints.filter((c) => c.status === "Closed").length;
    const pending = complaints.filter((c) => c.status === "In Progress" || c.status === "Open").length;
    const breach = complaints.filter((c) => c.status === "SLA Breach").length;
    return { total, closed, pending, breach };
  }, [complaints]);

  const wardOptions = useMemo(
    () => Array.from(new Set(complaints.map((item) => item.wardNo))).sort((a, b) => Number(a) - Number(b)),
    [complaints]
  );

  const streetOptions = useMemo(
    () => Array.from(new Set(complaints.map((item) => item.streetName).filter(Boolean))).sort(),
    [complaints]
  );

  const mapComplaintStatusToAction = (status: OpsComplaintStatus): ActionFormData["status"] => {
    if (status === "Closed") return "closed";
    if (status === "In Progress") return "in-progress";
    return "";
  };

  const mapActionStatusToComplaint = (status: ActionFormData["status"]): OpsComplaintStatus => {
    if (status === "closed") return "Closed";
    if (status === "in-progress") return "In Progress";
    if (status === "on-hold") return "Open";
    return "Open";
  };

  const mapBranchTone = (status: OpsComplaintStatus): OpsComplaint["branchTone"] => {
    if (status === "Closed") return "closed";
    if (status === "SLA Breach") return "breach";
    if (status === "SLA Risk") return "risk";
    if (status === "In Progress") return "progress";
    return "open";
  };

  const closeActionDrawer = () => {
    setActionComplaint(null);
    setActionFormData({
      status: "",
      revisedWard: "",
      revisedStreet: "",
      address: "",
      actionRemarks: "",
      closingImage: null
    });
    setClosingImagePreview(null);
    setIsActionSubmitting(false);
  };

  const openActionDrawer = (item: OpsComplaint) => {
    setActionComplaint(item);
    setActionFormData({
      status: mapComplaintStatusToAction(item.status),
      revisedWard: item.wardNo ? `Ward ${item.wardNo}` : "",
      revisedStreet: item.streetName || "",
      address: item.location || "",
      actionRemarks: item.actionRemarks || "",
      closingImage: null
    });
    setClosingImagePreview(item.closingImage || null);
  };

  const badgeClass = (status: OpsComplaintStatus) => {
    if (status === "Closed") return "ops-status-badge success";
    if (status === "SLA Breach") return "ops-status-badge danger";
    if (status === "SLA Risk" || status === "In Progress") return "ops-status-badge warning";
    return "ops-status-badge neutral";
  };

  const handleClosingImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setActionFormData((prev) => ({ ...prev, closingImage: file }));
    if (!file) {
      setClosingImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setClosingImagePreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const closeComplaint = async () => {
    if (!actionComplaint) return;
    if (!actionFormData.status || !actionFormData.actionRemarks.trim() || !actionFormData.address.trim()) return;
    setIsActionSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const nextStatus = mapActionStatusToComplaint(actionFormData.status);
    const closeOn = new Date();
    const closeDate = `${String(closeOn.getDate()).padStart(2, "0")}-${String(closeOn.getMonth() + 1).padStart(2, "0")}-${closeOn.getFullYear()} ${String(closeOn.getHours()).padStart(2, "0")}:${String(closeOn.getMinutes()).padStart(2, "0")}:${String(closeOn.getSeconds()).padStart(2, "0")}`;
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === actionComplaint.id
          ? {
              ...item,
              status: nextStatus,
              wardNo: actionFormData.revisedWard.replace(/^Ward\s*/i, "") || item.wardNo,
              streetName: actionFormData.revisedStreet || item.streetName,
              location: actionFormData.address || item.location,
              complaintClosureOn: nextStatus === "Closed" ? closeDate : "",
              endTime: nextStatus === "Closed" ? closeDate : item.endTime,
              actionRemarks: actionFormData.actionRemarks || "Complaint Cleared",
              closingImage: closingImagePreview || item.closingImage || (nextStatus === "Closed" ? opsClosingImage : ""),
              closeTimeLocation: actionFormData.address || item.location,
              timeHint: nextStatus === "Closed" ? "Closed" : nextStatus === "In Progress" ? "In progress" : "Pending",
              branchTone: mapBranchTone(nextStatus)
            }
          : item
      )
    );
    closeActionDrawer();
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const copyComplaintInfoWithImage = async (text: string, imageSrc: string) => {
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") return false;
      const absoluteImageUrl = new URL(imageSrc, window.location.origin).href;
      const imageResponse = await fetch(absoluteImageUrl);
      if (!imageResponse.ok) return false;
      const imageBlob = await imageResponse.blob();
      if (!imageBlob.type.startsWith("image/")) return false;

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" }),
          [imageBlob.type]: imageBlob
        })
      ]);
      return true;
    } catch {
      return false;
    }
  };

  const copyImageToClipboard = async (imageSrc: string) => {
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") return false;
      const absoluteImageUrl = new URL(imageSrc, window.location.origin).href;
      const imageResponse = await fetch(absoluteImageUrl);
      if (!imageResponse.ok) return false;
      const imageBlob = await imageResponse.blob();
      if (!imageBlob.type.startsWith("image/")) return false;

      await navigator.clipboard.write([
        new ClipboardItem({
          [imageBlob.type]: imageBlob
        })
      ]);
      return true;
    } catch {
      return false;
    }
  };

  const buildComplaintInfoText = (item: OpsComplaint) => {
    const sla = item.actualDuration || item.timeHint || "-";
    const area = item.streetName || item.location || "-";
    return `🚨 ${item.complaintNo} | 📞 ${item.complainantContactNo}
⚠️ ${item.kpiCategory} – ${item.issueType}
📝 ${item.description || "-"}
📍 ${item.zone} | Ward ${item.wardNo} | ${area}
🕒 ${item.complaintCreatedOn} | SLA ${sla}
`;
  };

  const handleCopyComplaintNo = async (item: OpsComplaint) => {
    const ok = await copyText(item.complaintNo);
    if (!ok) return;
    setCopiedComplaintId(item.id);
    window.setTimeout(() => setCopiedComplaintId((prev) => (prev === item.id ? null : prev)), 1400);
  };

  const handleCopyComplaintInfo = async (item: OpsComplaint) => {
    const complaintText = buildComplaintInfoText(item);
    const ok = item.image
      ? (await copyComplaintInfoWithImage(complaintText, item.image)) || (await copyText(complaintText))
      : await copyText(complaintText);
    if (!ok) return;
    setViewCopied(true);
    window.setTimeout(() => setViewCopied(false), 1400);
  };

  const handleCopyComplaintImage = async (imageSrc: string, type: "before" | "after") => {
    const ok = await copyImageToClipboard(imageSrc);
    if (!ok) return;
    setCopiedImageType(type);
    window.setTimeout(() => {
      setCopiedImageType((prev) => (prev === type ? null : prev));
    }, 1400);
  };

  return (
    <>
      <div className="ops-head-actions standalone">
        <button className="ghost"><Download size={15} /> Export</button>
        <button className="primary"><Plus size={15} /> New Complaint</button>
      </div>

      <div className="ops-tabs">
        <button
          className={tab === "citizen" ? "ops-tab active" : "ops-tab"}
          onClick={() => setTab("citizen")}
        >
          Citizen Complaints <span>{complaints.length}</span>
        </button>
        <button
          className={tab === "ie" ? "ops-tab active" : "ops-tab"}
          onClick={() => setTab("ie")}
        >
          <TriangleAlert size={14} /> IE Complaints <span>{Math.max(1, Math.floor(complaints.length / 2))}</span>
        </button>
      </div>

      <div className="card">
        <div className="ops-filter-grid">
          <select><option>All Zones</option></select>
          <select><option>All Wards</option></select>
          <input type="date" className="filter-input" />
          <input type="date" className="filter-input" />
          <select><option>All KPIs</option></select>
          <select><option>All Issues</option></select>
          <select><option>All Status</option></select>
          <div className="searchbox">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaint no, name, KPI..."
            />
          </div>
        </div>
      </div>

      <div className="ops-summary">
        <article>
          <div className="ops-summary-icon blue"><Fingerprint size={18} /></div>
          <strong>{counts.total}</strong>
          <span>Total Complaints</span>
        </article>
        <article>
          <div className="ops-summary-icon green"><MessageCircle size={18} /></div>
          <strong>{counts.closed}</strong>
          <span>Closed</span>
        </article>
        <article>
          <div className="ops-summary-icon amber"><Clock3 size={18} /></div>
          <strong>{counts.pending}</strong>
          <span>Pending</span>
        </article>
        <article>
          <div className="ops-summary-icon red"><TriangleAlert size={18} /></div>
          <strong>{counts.breach}</strong>
          <span>SLA Breach</span>
        </article>
      </div>

      <div className="card ops-table-card">
        <div className="table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Image</th>
                <th>Complaint No</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={`ops-branch ${item.branchTone}`}>{item.srNo}</div>
                  </td>
                  <td>
                    <img src={item.image || opsComplaintImage} alt={item.complaintNo} className="ops-thumb" />
                  </td>
                  <td>
                    <button className="ops-id-btn" onClick={() => handleCopyComplaintNo(item)}>
                      <strong className="ops-id">{item.complaintNo}</strong>
                      <small>{copiedComplaintId === item.id ? "Copied" : "Click to copy"}</small>
                    </button>
                    <small><Clock3 size={12} /> {item.timeHint}</small>
                  </td>
                  <td><span className={badgeClass(item.status)}>{item.status}</span></td>
                  <td>
                    <div className="ops-row-actions">
                      <button className="ghost" onClick={() => setSelectedComplaint(item)}>
                        <Eye size={15} /> View
                      </button>
                      <button className="primary" onClick={() => openActionDrawer(item)}>Action</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedComplaint && (
        <section className="ops-fullscreen" role="dialog" aria-modal="true">
          <div className="complaint-view-head">
            <div className="complaint-view-title-wrap">
              <button className="ghost icon-only" onClick={() => setSelectedComplaint(null)}><ArrowLeft size={16} /></button>
              <div>
                <div className="complaint-view-title-row">
                  <h3>{selectedComplaint.complaintNo}</h3>
                  <span className={badgeClass(selectedComplaint.status)}>{selectedComplaint.status}</span>
                </div>
                <p>{selectedComplaint.kpiCategory} | {selectedComplaint.issueType}</p>
              </div>
            </div>
            <div className="complaint-view-actions">
              <button className="ghost" onClick={() => handleCopyComplaintInfo(selectedComplaint)}>
                <Copy size={14} /> {viewCopied ? "Copied" : "Copy Info"}
              </button>
              <button className="primary" onClick={() => openActionDrawer(selectedComplaint)}>
                {selectedComplaint.status === "Closed" ? "View Action" : "Take Action"}
              </button>
            </div>
          </div>

          <div className="complaint-view-layout">
            <div className="complaint-main-col">
              <article className="card complaint-card">
                <header className="complaint-card-head">
                  <h4><FileText size={16} /> Complaint Summary</h4>
                </header>
                <div className="complaint-card-body">
                  <div className="complaint-summary-grid">
                    <div>
                      <small>Complaint No</small>
                      <strong>{selectedComplaint.complaintNo}</strong>
                    </div>
                    <div>
                      <small>Status</small>
                      <span className={badgeClass(selectedComplaint.status)}>{selectedComplaint.status}</span>
                    </div>
                    <div>
                      <small>SLA Timer</small>
                      <strong className={selectedComplaint.status === "SLA Breach" ? "tone-breach" : selectedComplaint.status === "SLA Risk" ? "tone-risk" : ""}>
                        {selectedComplaint.status === "Closed" ? "Completed" : selectedComplaint.timeHint}
                      </strong>
                    </div>
                    <div>
                      <small>KPI Category</small>
                      <strong>{selectedComplaint.kpiCategory}</strong>
                    </div>
                  </div>
                  <hr />
                  <div className="complaint-text-block">
                    <small>Issue Type</small>
                    <p>{selectedComplaint.issueType}</p>
                  </div>
                  <div className="complaint-text-block">
                    <small>Description</small>
                    <p>{selectedComplaint.description || "-"}</p>
                  </div>
                </div>
              </article>

              <article className="card complaint-card">
                <header className="complaint-card-head">
                  <h4><Phone size={16} /> Complainant Details</h4>
                </header>
                <div className="complaint-card-body">
                  <div className="complaint-detail-grid">
                    <div>
                      <small>Name</small>
                      <p>Citizen</p>
                    </div>
                    <div>
                      <small>Contact Number</small>
                      <p className="linkish"><Phone size={14} /> {selectedComplaint.complainantContactNo}</p>
                    </div>
                    <div>
                      <small>Zone / Ward</small>
                      <p>{selectedComplaint.zone} / {selectedComplaint.wardNo}</p>
                    </div>
                    <div>
                      <small>Street Name</small>
                      <p>{selectedComplaint.streetName || "-"}</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card complaint-card">
                <header className="complaint-card-head">
                  <h4><ImageIcon size={16} /> Images</h4>
                </header>
                <div className="complaint-card-body">
                  <div className="complaint-images-grid">
                    <div>
                      <small>Before Image</small>
                      <div className="complaint-image-box">
                        <img
                          src={selectedComplaint.image || opsComplaintImage}
                          alt="Complaint"
                          onClick={() => handleCopyComplaintImage(selectedComplaint.image, "before")}
                          title="Click to copy image"
                        />
                        <span className="ops-status-badge neutral before-chip">
                          {copiedImageType === "before" ? "Copied" : "Before"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <small>Closing Image</small>
                      {selectedComplaint.closingImage ? (
                        <div className="complaint-image-box">
                          <img
                            src={selectedComplaint.closingImage}
                            alt="Closing"
                            onClick={() => handleCopyComplaintImage(selectedComplaint.closingImage, "after")}
                            title="Click to copy image"
                          />
                          <span className="ops-status-badge success before-chip">
                            {copiedImageType === "after" ? "Copied" : "After"}
                          </span>
                        </div>
                      ) : (
                        <div className="ops-empty-image small"><ImageIcon size={18} /> No closing image</div>
                      )}
                    </div>
                  </div>
                </div>
              </article>

              <article className="card complaint-card">
                <header className="complaint-card-head">
                  <h4><MapPin size={16} /> Location</h4>
                </header>
                <div className="complaint-card-body">
                  <div className="action-map-placeholder tall">
                    <MapPin size={28} />
                    <p>Map Integration</p>
                    <small>{selectedComplaint.location}</small>
                  </div>
                </div>
              </article>
            </div>

            <div className="complaint-side-col">
              <article className="card complaint-card">
                <header className="complaint-card-head">
                  <h4><Clock3 size={16} /> Timeline</h4>
                </header>
                <div className="complaint-card-body">
                  <div className="complaint-timeline">
                    <div className="line" />
                    <div className="item done">
                      <span><Calendar size={12} /></span>
                      <div>
                        <p>Created</p>
                        <small>{selectedComplaint.complaintCreatedOn}</small>
                      </div>
                    </div>
                    <div className="item done">
                      <span><CheckCircle2 size={12} /></span>
                      <div>
                        <p>Assigned</p>
                        <small>{selectedComplaint.startTime || "Pending"}</small>
                      </div>
                    </div>
                    <div className={`item ${selectedComplaint.startTime ? "done" : ""}`}>
                      <span><Timer size={12} /></span>
                      <div>
                        <p>In Progress</p>
                        <small>{selectedComplaint.startTime || "Pending"}</small>
                      </div>
                    </div>
                    <div className={`item ${selectedComplaint.status === "Closed" ? "done" : ""}`}>
                      <span><Check size={12} /></span>
                      <div>
                        <p>Closed</p>
                        <small>{selectedComplaint.complaintClosureOn || "Pending"}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card complaint-card">
                <header className="complaint-card-head">
                  <h4>Additional Details</h4>
                </header>
                <div className="complaint-card-body">
                  <div className="complaint-meta-list">
                    <div><small>Created On</small><p>{selectedComplaint.complaintCreatedOn}</p></div>
                    <div><small>Closure On</small><p>{selectedComplaint.complaintClosureOn || "-"}</p></div>
                    <div><small>Start Time</small><p>{selectedComplaint.startTime || "-"}</p></div>
                    <div><small>End Time</small><p>{selectedComplaint.endTime || "-"}</p></div>
                    <div><small>Duration</small><p>{selectedComplaint.actualDuration || "-"}</p></div>
                    <div><small>Close Time Location</small><p>{selectedComplaint.closeTimeLocation || "-"}</p></div>
                    {!!selectedComplaint.actionRemarks && <div><small>Action Remarks</small><p>{selectedComplaint.actionRemarks}</p></div>}
                  </div>
                </div>
              </article>
            </div>
          </div>

          <button className="ghost complaint-view-close" onClick={() => setSelectedComplaint(null)}>
            <X size={15} /> Close
          </button>
        </section>
      )}

      {actionComplaint && (
        <div className="ops-drawer-backdrop" onClick={closeActionDrawer}>
          <aside className="ops-drawer action" onClick={(e) => e.stopPropagation()}>
            <div className="ops-drawer-head">
              <div>
                <h3>Citizen Complaint</h3>
                <div className="ops-drawer-subhead modern">
                  <strong>{actionComplaint.complaintNo}</strong>
                  <span className={badgeClass(actionComplaint.status)}>{actionComplaint.status}</span>
                </div>
              </div>
              <button className="ghost icon-only" onClick={closeActionDrawer}><X size={16} /></button>
            </div>

            <div className="action-drawer-content">
              <div className="ops-details-grid compact modern">
                <p><b>KPI Category:</b> {actionComplaint.kpiCategory}</p>
                <p><b>Issue Type:</b> {actionComplaint.issueType}</p>
                <p><b>Zone:</b> {actionComplaint.zone}</p>
                <p><b>Ward:</b> {actionComplaint.wardNo}</p>
              </div>

              <div className="ops-preview before-image">
                <p>BEFORE IMAGE</p>
                <div className="action-image-wrap">
                  <img src={actionComplaint.image || opsComplaintImage} alt="Before" />
                  <span className="ops-status-badge neutral before-chip"><ImageIcon size={12} /> Before</span>
                </div>
              </div>

              <div className="action-section">
                <h4>Revised Location</h4>
                <div className="action-two-col">
                  <label className="ops-field">
                    <span>Revised Ward No</span>
                    <select
                      value={actionFormData.revisedWard}
                      onChange={(e) => setActionFormData((prev) => ({ ...prev, revisedWard: e.target.value }))}
                    >
                      <option value="">Select Ward</option>
                      {wardOptions.map((ward) => (
                        <option key={ward} value={`Ward ${ward}`}>Ward {ward}</option>
                      ))}
                    </select>
                  </label>

                  <label className="ops-field">
                    <span>Revised Street</span>
                    <select
                      value={actionFormData.revisedStreet}
                      onChange={(e) => setActionFormData((prev) => ({ ...prev, revisedStreet: e.target.value }))}
                    >
                      <option value="">Select Street</option>
                      {streetOptions.map((street) => (
                        <option key={street} value={street}>{street}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="action-section">
                <label className="ops-field">
                  <span>Status <i>*</i></span>
                  <select
                    value={actionFormData.status}
                    onChange={(e) => setActionFormData((prev) => ({ ...prev, status: e.target.value as ActionFormData["status"] }))}
                  >
                    <option value="">Select Status</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>

                <label className="ops-field">
                  <span>Action Remarks <i>*</i></span>
                  <textarea
                    value={actionFormData.actionRemarks}
                    onChange={(e) => setActionFormData((prev) => ({ ...prev, actionRemarks: e.target.value }))}
                    placeholder="Enter action remarks..."
                    rows={4}
                  />
                </label>
              </div>

              <label className="ops-field">
                <span>Address <i>*</i></span>
                <input
                  value={actionFormData.address}
                  onChange={(e) => setActionFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address..."
                />
              </label>

              <div className="action-section">
                <label className="ops-field">
                  <span>Upload Closing Image</span>
                </label>
                <label className="action-upload-box" htmlFor="closing-image">
                  <input
                    id="closing-image"
                    type="file"
                    accept="image/*"
                    onChange={handleClosingImageChange}
                  />
                  {closingImagePreview ? (
                    <div className="action-image-wrap">
                      <img src={closingImagePreview} alt="Preview" />
                      <span className="ops-status-badge success before-chip"><Check size={12} /> Uploaded</span>
                    </div>
                  ) : (
                    <div className="action-upload-empty">
                      <Upload size={24} />
                      <p>Drag & drop or click to browse</p>
                      <small>PNG, JPG up to 5MB</small>
                    </div>
                  )}
                </label>
              </div>

              <div className="action-section">
                <label className="ops-field">
                  <span>Close Time Location</span>
                </label>
                <div className="action-map-placeholder">
                  <MapPin size={28} />
                  <p>Map Integration</p>
                  <small>Drag pin to update location</small>
                </div>
              </div>
            </div>
            <div className="ops-drawer-footer">
              <button className="ghost" onClick={closeActionDrawer}>Cancel</button>
              <button
                className="primary"
                onClick={closeComplaint}
                disabled={
                  isActionSubmitting ||
                  !actionFormData.status ||
                  !actionFormData.actionRemarks.trim() ||
                  !actionFormData.address.trim()
                }
              >
                {isActionSubmitting ? (
                  <>
                    <Loader2 size={15} className="spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Check size={15} /> Submit
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
