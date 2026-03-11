export type NavItem = { id: string; label: string; group: string; icon?: any };
export type Row = Record<string, string | number>;

export type CollectionAsset = {
  id: string; name: string; total: number; scanned: number;
  notScanned: number; compliance: number; color: string;
};

export type OpsComplaintStatus = "SLA Breach" | "SLA Risk" | "In Progress" | "Closed" | "Open";
export type ActionFormStatus = "" | "in-progress" | "on-hold" | "closed";

export type ActionFormData = {
  status: ActionFormStatus; revisedWard: string; revisedStreet: string;
  address: string; actionRemarks: string; closingImage: File | null;
};

export type OpsComplaint = {
  id: number; srNo: number; image: string; complaintNo: string;
  complainantContactNo: string; kpiCategory: string; issueType: string;
  description: string; zone: string; wardNo: string; location: string;
  complaintCreatedOn: string; complaintClosureOn: string; actualDuration: string;
  streetName: string; startTime: string; endTime: string; status: OpsComplaintStatus;
  closeTimeLocation: string; closingImage: string; actionRemarks: string;
  timeHint: string; branchTone: "breach" | "risk" | "progress" | "closed" | "open";
};

export type ComplaintMisRow = {
  key: string; srNo: number; slaCategory: string; zone: string; ward: string;
  totalComplaints: number; totalSlaBreachComplaints: number; totalNonSlaBreachComplaints: number;
  totalPendingComplaints: number; totalPendingInProgressComplaints: number;
  totalPendingOnHoldComplaints: number; totalClosedComplaints: number;
  totalClosedComplaintsWithSlaBreach: number; totalClosedComplaintsCompliancePct: number;
};

export type RegisterComplaintFormData = {
  complainantName: string; contactNo: string; zone: string; ward: string;
  streetName: string; kpiCategory: string; issueType: string; description: string;
};

export type AssetStatus = "active" | "maintenance" | "inactive";
export type AssetRecord = {
  id: string; assetCode: string; category: string; subCategory: string;
  imeiNo: string; wardNo: string; zoneNo: string; location: string;
  installedArea: string; chassisNo: string; otherNo: string;
  dateOfInstallation: string; installedBy: string; lastModifiedOn: string; status: AssetStatus;
};
export type AssetFormData = {
  assetCode: string; category: string; subCategory: string; imeiNo: string;
  wardNo: string; zoneNo: string; location: string; installedArea: string;
  chassisNo: string; otherNo: string; dateOfInstallation: string; installedBy: string; status: AssetStatus;
};

export type EmployeeStatus = "active" | "inactive" | "on-leave";
export type EmployeeRecord = {
  id: string; empCode: string; name: string; designation: string; department: string;
  zone: string; ward: string; shift: string; contactNo: string;
  joiningDate: string; status: EmployeeStatus; kpiCategory: string;
};
export type EmployeeFormData = {
  empCode: string; name: string; designation: string; department: string;
  zone: string; ward: string; shift: string; contactNo: string;
  joiningDate: string; status: EmployeeStatus; kpiCategory: string;
};

export type GrievanceStatus = "ACTIVE" | "DE-ACTIVE";
export type GrievanceRecord = {
  id: string; srNo: number; categoryName: string; slaCategory: string;
  categoryType: string; status: GrievanceStatus;
};
export type GrievanceFormData = {
  categoryName: string; slaCategory: string; categoryType: string; status: GrievanceStatus;
};

export type CollectionReportRow = {
  srNo: number; assetCode: string; assetCategory: string; imeiSlMfg: string;
  tagVehicleNo: string; wardNo: string; zoneNo: string; scannedByReader: string;
  readerCategory: string; readerVehicleNo: string; readerZone: string; readerWard: string;
  totalScanned: number; actualShift: "A" | "B" | "C"; lastScannedTime: string;
  inTime: string; outTime: string;
};

export type FieldActivityStatus = "Closed" | "Open" | "Pending";
export type StaffRecord = {
  srNo: number; taskGroup: string; taskName: string; dateOfCreation: string;
  status: FieldActivityStatus; remarks1: string; hhName: string; hhNumber: string;
  image: string; collectionType: string; zone: string; ward: string; location: string;
  bovRouteNo: string; noOfHH: number; noOfHHSegregating: number; contactNumber: string;
};
export type FieldStaffColumn = { key: keyof StaffRecord; label: string };

export type MonitoringDeviceCategory = "RFID Reader" | "Face Detection Machine" | "UHF Handheld Reader";
export type MonitoringDeviceStatus = "Online" | "Offline";
export type MonitoringDevice = {
  id: number; deviceStatus: MonitoringDeviceStatus; assetCode: string;
  assetCategory: MonitoringDeviceCategory; imei: string; ward: string;
};

export type AttendanceStatus = "present" | "absent" | "late" | "leave" | "half-day";
export type AttendanceRecord = {
  srNo: number; sysId: string; empCode: string; empName: string; designation: string;
  department: string; masterShift: string; actualShift: string; zone: string; ward: string;
  deviceId: string; kpiCategory: string; date: string; punchIn: string; punchOut: string;
  totalTime: string; status: AttendanceStatus;
};
export type AttendanceColumn = {
  key: keyof AttendanceRecord; label: string; width: number; sticky?: boolean;
};
export type FaceDevice = {
  id: string; location: string; status: "online" | "offline"; lastSync: string; scans: number;
};
