import { ChangeEvent, useState } from "react";
import { Camera, Check, Loader2, MapPin, X } from "lucide-react";
import type { RegisterComplaintFormData } from "../types";

export function RegisterComplaintModal({ isOpen, onClose, onSubmit, zones, wards }: {
  isOpen: boolean; onClose: () => void;
  onSubmit: (data: RegisterComplaintFormData & { image?: string }) => void;
  zones: string[]; wards: string[];
}) {
  const initialFormData: RegisterComplaintFormData = { complainantName: "", contactNo: "", zone: "", ward: "", streetName: "", kpiCategory: "", issueType: "", description: "" };
  const [formData, setFormData] = useState<RegisterComplaintFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterComplaintFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (field: keyof RegisterComplaintFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof RegisterComplaintFormData, string>> = {};
    if (formData.complainantName.trim().length < 2) nextErrors.complainantName = "Name must be at least 2 characters";
    if (formData.contactNo.trim().length < 10) nextErrors.contactNo = "Contact number must be at least 10 digits";
    if (!formData.zone) nextErrors.zone = "Please select a zone";
    if (!formData.ward) nextErrors.ward = "Please select a ward";
    if (formData.streetName.trim().length < 2) nextErrors.streetName = "Street name is required";
    if (!formData.kpiCategory) nextErrors.kpiCategory = "Please select a KPI category";
    if (!formData.issueType) nextErrors.issueType = "Please select an issue type";
    if (formData.description.trim().length < 10) nextErrors.description = "Description must be at least 10 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => { setFormData(initialFormData); setErrors({}); setImagePreview(null); setIsSubmitting(false); };
  const handleClose = () => { if (isSubmitting) return; resetForm(); onClose(); };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSubmit({ ...formData, image: imagePreview || undefined });
    resetForm(); onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="register-modal-backdrop" onClick={handleClose}>
      <section className="register-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="register-modal-head"><h3>Register New Complaint</h3><button className="ghost icon-only" onClick={handleClose}><X size={16} /></button></div>
        <div className="register-modal-body">
          <div className="register-section">
            <h4>Complainant Details</h4>
            <div className="register-grid two">
              <label className="ops-field"><span>Name <i>*</i></span><input value={formData.complainantName} onChange={(e) => handleChange("complainantName", e.target.value)} placeholder="Enter complainant name" />{errors.complainantName && <small className="form-error">{errors.complainantName}</small>}</label>
              <label className="ops-field"><span>Contact Number <i>*</i></span><input value={formData.contactNo} onChange={(e) => handleChange("contactNo", e.target.value)} placeholder="+91 98765 43210" />{errors.contactNo && <small className="form-error">{errors.contactNo}</small>}</label>
            </div>
          </div>
          <div className="register-section">
            <h4>Location Details</h4>
            <div className="register-grid two">
              <label className="ops-field"><span>Zone <i>*</i></span>
                <select value={formData.zone} onChange={(e) => handleChange("zone", e.target.value)}>
                  <option value="">Select Zone</option>{zones.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>{errors.zone && <small className="form-error">{errors.zone}</small>}
              </label>
              <label className="ops-field"><span>Ward <i>*</i></span>
                <select value={formData.ward} onChange={(e) => handleChange("ward", e.target.value)}>
                  <option value="">Select Ward</option>{wards.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>{errors.ward && <small className="form-error">{errors.ward}</small>}
              </label>
            </div>
            <label className="ops-field"><span>Street Name / Address <i>*</i></span><input value={formData.streetName} onChange={(e) => handleChange("streetName", e.target.value)} placeholder="Enter street name or address" />{errors.streetName && <small className="form-error">{errors.streetName}</small>}</label>
            <div className="register-map"><MapPin size={20} /><p>Click to set location on map</p></div>
          </div>
          <div className="register-section">
            <h4>Complaint Details</h4>
            <div className="register-grid two">
              <label className="ops-field"><span>KPI Category <i>*</i></span>
                <select value={formData.kpiCategory} onChange={(e) => handleChange("kpiCategory", e.target.value)}>
                  <option value="">Select KPI</option>
                  <option value="6.2 Deployment of Manpower">6.2 Deployment of Manpower</option>
                  <option value="5.1 Deployment of Manpower">5.1 Deployment of Manpower</option>
                  <option value="7.1 Disinfection of Bins">7.1 Disinfection of Bins</option>
                  <option value="5.6 Horticultural Waste">5.6 Horticultural Waste</option>
                </select>{errors.kpiCategory && <small className="form-error">{errors.kpiCategory}</small>}
              </label>
              <label className="ops-field"><span>Issue Type <i>*</i></span>
                <select value={formData.issueType} onChange={(e) => handleChange("issueType", e.target.value)}>
                  <option value="">Select Issue</option>
                  <option value="Garbage Collection">Garbage Collection</option>
                  <option value="Street Sweeping">Street Sweeping</option>
                  <option value="Bin Maintenance">Bin Maintenance</option>
                  <option value="Drainage Issue">Drainage Issue</option>
                  <option value="Illegal Dumping">Illegal Dumping</option>
                </select>{errors.issueType && <small className="form-error">{errors.issueType}</small>}
              </label>
            </div>
            <label className="ops-field"><span>Description <i>*</i></span><textarea value={formData.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Describe the complaint in detail..." rows={4} />{errors.description && <small className="form-error">{errors.description}</small>}<small className="char-counter">{formData.description.length}/1000 characters</small></label>
          </div>
          <div className="register-section">
            <h4>Upload Image</h4>
            <label className="action-upload-box register-upload-box" htmlFor="complaint-image">
              <input id="complaint-image" type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview ? (
                <div className="action-image-wrap">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" className="register-remove-image" onClick={(e) => { e.preventDefault(); setImagePreview(null); }}><X size={14} /></button>
                </div>
              ) : (
                <div className="action-upload-empty">
                  <div className="register-camera-badge"><Camera size={18} /></div>
                  <p>Click to upload image</p><small>PNG, JPG up to 5MB</small>
                </div>
              )}
            </label>
          </div>
        </div>
        <div className="register-modal-foot">
          <button className="ghost" onClick={handleClose} disabled={isSubmitting}>Cancel</button>
          <button className="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 size={15} className="spin" /> Registering...</> : <><Check size={15} /> Register Complaint</>}
          </button>
        </div>
      </section>
    </div>
  );
}
