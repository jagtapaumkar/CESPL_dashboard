import { Radio, ScanFace, Truck } from "lucide-react";
import type {
  NavItem, Row, CollectionAsset, OpsComplaint, AssetRecord,
  EmployeeRecord, GrievanceRecord, AttendanceRecord, AttendanceColumn,
  FaceDevice, StaffRecord, FieldStaffColumn, MonitoringDevice, CollectionReportRow
} from "./types";

export const ZONES = ["Royapuram-5", "Thiru Vi Ka Nagar-6", "Beach"] as const;

export const navItems: NavItem[] = [
  { id: "dashboard-overview", label: "Dashboard Overview", group: "Dashboard" },
  { id: "dashboard-attendance", label: "Attendance Dashboard", group: "Dashboard" },
  { id: "dashboard-grievances", label: "Grievances Dashboard", group: "Dashboard" },
  { id: "dashboard-collection", label: "Waste Collection Dashboard", group: "Dashboard" },
  { id: "dashboard-kpi", label: "KPI Dashboard", group: "Dashboard" },
  { id: "ops-complaints", label: "Citizen Grievances", group: "Operations" },
  { id: "ops-ie", label: "IE Complaints", group: "Operations" },
  { id: "reports-attendance", label: "Attendance Reports", group: "MIS & Reports" },
  { id: "reports-complaint", label: "Complaint MIS", group: "MIS & Reports" },
  { id: "reports-collection", label: "Collection Reports", group: "MIS & Reports" },
  { id: "reports-field", label: "Field Activity Reports", group: "MIS & Reports" },
  { id: "master-asset", label: "Asset Master", group: "Masters" },
  { id: "master-employee", label: "Employee Master", group: "Masters" },
  { id: "master-grievance", label: "Grievance Category / SLA", group: "Masters" },
];

export const stats = [
  { label: "Total Complaints", value: 12462, color: "#2563EB" },
  { label: "Pending", value: 1841, color: "#F59E0B" },
  { label: "Closed", value: 10621, color: "#10B981" },
  { label: "SLA Breach", value: 392, color: "#EF4444" }
];

export const modeData = [
  { name: "App", value: 100, color: "#3B82F6" },
  { name: "Call", value: 500, color: "#10B981" },
  { name: "Web", value: 1500, color: "#F59E0B" },
  { name: "GCC", value: 3435, color: "#8B5CF6" }
];

export const trendData = [
  { day: "Mon", complaints: 260, services: 420 },
  { day: "Tue", complaints: 392, services: 280 },
  { day: "Wed", complaints: 210, services: 310 },
  { day: "Thu", complaints: 369, services: 498 },
  { day: "Fri", complaints: 388, services: 255 },
  { day: "Sat", complaints: 351, services: 230 },
  { day: "Sun", complaints: 302, services: 210 }
];

export const queueRows: Row[] = Array.from({ length: 64 }).map((_, i) => ({
  ID: 10000 + i,
  Zone: ZONES[i % ZONES.length],
  Ward: `Ward ${(i % 200) + 1}`,
  Type: i % 2 ? "Complaint" : "Service",
  Status: ["Pending", "In Progress", "Closed", "On Hold"][i % 4],
  SLA: i % 5 ? "Within SLA" : "Breached",
  Updated: `2026-03-${String((i % 28) + 1).padStart(2, "0")}`
}));

export const attendanceMachines = [
  { label: "Total Machines", value: 70, tone: "#0ea5a4" },
  { label: "Active Machines", value: 61, tone: "#16a34a" },
  { label: "Offline Machines", value: 9, tone: "#ef4444" }
];

export const employeeSummary = [
  { label: "Total Employees", value: 6136, tone: "#0ea5a4" },
  { label: "Present", value: 3112, tone: "#16a34a" },
  { label: "Absent", value: 3024, tone: "#ef4444" }
];

export const shiftCards = [
  { title: "A Shift Summary", performance: 120, metrics: [
    { label: "Planned", value: 1819, tone: "#0ea5a4" },
    { label: "Present", value: 2345, tone: "#16a34a" },
    { label: "Absent", value: -526, tone: "#ef4444" }
  ]},
  { title: "General Shift Summary", performance: 0, metrics: [
    { label: "Planned", value: 0, tone: "#0ea5a4" },
    { label: "Present", value: 4, tone: "#16a34a" },
    { label: "Absent", value: 0, tone: "#ef4444" }
  ]},
  { title: "B Shift Summary", performance: 174, metrics: [
    { label: "Planned", value: 193, tone: "#0ea5a4" },
    { label: "Present", value: 285, tone: "#16a34a" },
    { label: "Absent", value: -92, tone: "#ef4444" }
  ]},
  { title: "C Shift Summary", performance: 0, metrics: [
    { label: "Planned", value: 455, tone: "#0ea5a4" },
    { label: "Present", value: 430, tone: "#16a34a" },
    { label: "Absent", value: 25, tone: "#ef4444" }
  ]}
];

export const zoneAttendanceData = [
  { zone: "Royapuram-5", MIOP: 2450, present: 1348, absent: 1102 },
  { zone: "Thiru Vi Ka Nagar-6", MIOP: 1210, present: 850, absent: 360 },
  { zone: "Beach", MIOP: 530, present: 400, absent: 130 }
];

export const overallStatusData = [
  { name: "Present", value: 3112, color: "#10B981" },
  { name: "Absent", value: 3024, color: "#EF4444" }
];

export const complaintSummary = [
  { label: "Total Complaints", value: 30, subA: "SLA Breach: 2", subB: "Non-SLA Breach: 28", tone: "#0ea5a4" },
  { label: "Closed Complaints", value: 28, subA: "SLA Breach: 2", subB: "Compliance: 86%", tone: "#22c55e" },
  { label: "Pending Complaints", value: 2, subA: "In Progress: 2", subB: "On Hold: 0", tone: "#ef4444" }
];

export const serviceSummary = [
  { label: "Total Services", value: 0, subA: "SLA Breach: 0", subB: "Non-SLA Breach: 0", tone: "#0ea5a4" },
  { label: "Closed Services", value: 0, subA: "SLA Breach: 0", subB: "Compliance: 0%", tone: "#22c55e" },
  { label: "Pending Services", value: 0, subA: "In Progress: 0", subB: "On Hold: 0", tone: "#ef4444" }
];

export const feedbackSummary = [
  { label: "Total Feedback", value: 0, tone: "#0ea5a4" },
  { label: "Excellent", value: 0, tone: "#16a34a" },
  { label: "Satisfied", value: 0, tone: "#22c55e" },
  { label: "Average", value: 0, tone: "#eab308" },
  { label: "Poor", value: 0, tone: "#ef4444" }
];

export const overallByCategoryData = [
  { name: "Street Signage", value: 17, color: "#c4b5fd" },
  { name: "Manual Sweeping", value: 14, color: "#fdba74" },
  { name: "Bin Deployment", value: 11, color: "#67e8f9" },
  { name: "Canal Waste", value: 9, color: "#f9a8d4" },
  { name: "Bin Clearing", value: 13, color: "#93c5fd" },
  { name: "Closed Bins", value: 8, color: "#a7f3d0" },
  { name: "Bin Replacement", value: 6, color: "#fcd34d" },
  { name: "PPE Compliance", value: 10, color: "#fca5a5" },
  { name: "Waste Segregation", value: 7, color: "#86efac" }
];

export const pendingByCategoryData = [
  { name: "Street Signage", value: 4, color: "#c4b5fd" },
  { name: "Manual Sweeping", value: 3, color: "#fdba74" },
  { name: "Bin Deployment", value: 2, color: "#67e8f9" },
  { name: "Canal Waste", value: 2, color: "#f9a8d4" },
  { name: "Bin Clearing", value: 3, color: "#93c5fd" },
  { name: "Closed Bins", value: 2, color: "#a7f3d0" },
  { name: "Bin Replacement", value: 2, color: "#fcd34d" },
  { name: "PPE Compliance", value: 1, color: "#fca5a5" },
  { name: "Waste Segregation", value: 1, color: "#86efac" }
];

export const wardComplaintStatusData = [
  { ward: "51", complaints: 2 }, { ward: "45", complaints: 1 },
  { ward: "76", complaints: 2 }, { ward: "64", complaints: 1 },
  { ward: "74", complaints: 1 }, { ward: "77", complaints: 2 },
  { ward: "88", complaints: 4 }, { ward: "95", complaints: 1 },
  { ward: "24", complaints: 1 }, { ward: "62", complaints: 1 },
  { ward: "56", complaints: 2 }, { ward: "42", complaints: 1 }
];

import opsComplaintImage from "./assets/opsComplaintImage.jpg";
import opsClosingImage from "./assets/opsComplaintClosed.png";

export { opsComplaintImage, opsClosingImage };

export const initialOpsComplaints: OpsComplaint[] = [
  { id: 1, srNo: 1, image: opsComplaintImage, complaintNo: "COMP/0000002919", complainantContactNo: "9880755838", kpiCategory: "10.2(b) EHS Compliances - Firefighting Equipment", issueType: "EHS - Fire Fighting Equipment Missing", description: "BOV vehicle fire kit missing", zone: "Thiru Vi Ka Nagar-6", wardNo: "72", location: "No 81, 3rd St, JJ Nagar, Pulianthope, Chennai", complaintCreatedOn: "06-03-2026 12:34:48", complaintClosureOn: "", actualDuration: "", streetName: "3rd Street", startTime: "06-03-2026 12:45:00", endTime: "", status: "In Progress", closeTimeLocation: "", closingImage: "", actionRemarks: "", timeHint: "3h remaining", branchTone: "progress" },
  { id: 2, srNo: 2, image: opsComplaintImage, complaintNo: "COMP/0000002918", complainantContactNo: "9632330642", kpiCategory: "10.2(b) EHS Compliances - Firefighting Equipment", issueType: "Fire Kit Missing", description: "Fire kit missing pay attention to clear this immediately", zone: "Royapuram-5", wardNo: "51", location: "11/3, NN Garden, Washermanpet, Chennai", complaintCreatedOn: "06-03-2026 12:33:15", complaintClosureOn: "", actualDuration: "", streetName: "NN Garden", startTime: "", endTime: "", status: "Open", closeTimeLocation: "", closingImage: "", actionRemarks: "", timeHint: "5h remaining", branchTone: "open" },
  { id: 3, srNo: 3, image: opsComplaintImage, complaintNo: "COMP/0000002917", complainantContactNo: "9880755838", kpiCategory: "10.2(b) EHS Compliances - Firefighting Equipment", issueType: "Fire Kit Missing", description: "BOV vehicle fire kit missing", zone: "Thiru Vi Ka Nagar-6", wardNo: "72", location: "2nd St, Nehru Nagar, VOC Nagar, Pulianthope, Chennai", complaintCreatedOn: "06-03-2026 12:33:08", complaintClosureOn: "", actualDuration: "", streetName: "2nd Street", startTime: "", endTime: "", status: "SLA Risk", closeTimeLocation: "", closingImage: "", actionRemarks: "", timeHint: "1h remaining", branchTone: "risk" },
  { id: 4, srNo: 4, image: opsComplaintImage, complaintNo: "COMP/0000002916", complainantContactNo: "9632330642", kpiCategory: "10.2(b) EHS Compliances - Firefighting Equipment", issueType: "Fire Kit Missing", description: "Fire kit missing pay attention to clear this immediately", zone: "Royapuram-5", wardNo: "51", location: "Manikandan St, Washermanpet, Chennai", complaintCreatedOn: "06-03-2026 10:32:51", complaintClosureOn: "", actualDuration: "", streetName: "Manikandan Street", startTime: "", endTime: "", status: "SLA Breach", closeTimeLocation: "", closingImage: "", actionRemarks: "", timeHint: "Overdue by 2h", branchTone: "breach" },
  { id: 5, srNo: 5, image: opsComplaintImage, complaintNo: "COMP/0000002915", complainantContactNo: "9345678901", kpiCategory: "6.1(a) Timely Street Sweeping", issueType: "Improper Sweeping", description: "Street not swept properly", zone: "Royapuram-5", wardNo: "56", location: "Savari Muthu St, George Town, Chennai", complaintCreatedOn: "06-03-2026 08:50:39", complaintClosureOn: "06-03-2026 10:15:03", actualDuration: "1:25", streetName: "Savari Muthu Street", startTime: "06-03-2026 09:00:00", endTime: "06-03-2026 10:12:00", status: "Closed", closeTimeLocation: "Savari Muthu St, Chennai", closingImage: opsClosingImage, actionRemarks: "Street cleaned and verified", timeHint: "Closed in 1h 25m", branchTone: "closed" },
  { id: 6, srNo: 6, image: opsComplaintImage, complaintNo: "COMP/0000002914", complainantContactNo: "9384512345", kpiCategory: "7.1(a) Clearing of Bins", issueType: "Overflowing Bin", description: "Market lane bin overflowing", zone: "Beach", wardNo: "77", location: "North Market Lane, Chennai", complaintCreatedOn: "06-03-2026 11:05:22", complaintClosureOn: "", actualDuration: "", streetName: "North Market Lane", startTime: "06-03-2026 11:20:00", endTime: "", status: "In Progress", closeTimeLocation: "", closingImage: "", actionRemarks: "", timeHint: "2h remaining", branchTone: "progress" }
];

export const hrRows: Row[] = Array.from({ length: 48 }).map((_, i) => ({
  "Sr No": i + 1,
  Name: `Employee ${i + 1}`,
  "Emp Code": `EMP${2000 + i}`,
  Department: i % 2 ? "SWM" : "Operations",
  Designation: i % 3 ? "Sanitary Worker" : "Supervisor",
  Zone: ZONES[i % ZONES.length],
  Ward: `Ward ${(i % 200) + 1}`,
  "Emp Id": 50000 + i,
  PunchIn: i % 4 ? "Present" : "AbsentS"
}));

export const kpiHeadline = [
  { title: "KPI Parameters", value: 29, tone: "#2563eb" },
  { title: "On Target", value: 18, tone: "#10b981" },
  { title: "Need Attention", value: 8, tone: "#f59e0b" },
  { title: "Critical", value: 3, tone: "#ef4444" }
];

export const kpiCore = [
  { name: "5.1 Manpower Deployment for Primary Collection", achieved: 83, target: 100, score: 8.3 },
  { name: "5.2 Deployment of BOVs as per MIOP", achieved: 76, target: 100, score: 7.6 },
  { name: "5.3A Household Coverage (Non TNUHDB)", achieved: 91, target: 100, score: 9.1 },
  { name: "5.3B Waste Collection from TNUHDB Area", achieved: 74, target: 100, score: 7.4 },
  { name: "5.4 Waste Collection from Market Areas", achieved: 79, target: 100, score: 7.9 },
  { name: "5.5 Supply of Segregated Waste to Decentralized Units", achieved: 68, target: 100, score: 6.8 },
  { name: "5.6 Horticultural Waste Collection", achieved: 85, target: 100, score: 8.5 },
  { name: "5.7 Domestic Hazardous Waste Deposition", achieved: 72, target: 100, score: 7.2 },
  { name: "5.8 Segregated Functional Bins in BoVs", achieved: 77, target: 100, score: 7.7 },
  { name: "5.9 Installation of Street Signage Boards", achieved: 66, target: 100, score: 6.6 }
];

export const kpiOperations = [
  { name: "6.1A Manual Street Sweeping Daily", achieved: 88, target: 100, score: 8.8 },
  { name: "6.1B Mechanical Street Sweeping Daily", achieved: 71, target: 100, score: 7.1 },
  { name: "6.2 Minimum Manpower Deployment", achieved: 81, target: 100, score: 8.1 },
  { name: "6.3A Mechanical Sweeper Deployment", achieved: 63, target: 100, score: 6.3 },
  { name: "6.3B Other Vehicle Deployment", achieved: 74, target: 100, score: 7.4 },
  { name: "6.4 Deployment of Wheeled Bins & Equipment", achieved: 69, target: 100, score: 6.9 },
  { name: "6.5 Canal/Riverbank Waste Collection", achieved: 58, target: 100, score: 5.8 }
];

export const kpiAsset = [
  { name: "7.1A Clearing of Bins as per MIOP", achieved: 90, target: 100, score: 9.0 },
  { name: "7.1B Bin Disinfection as per MIOP", achieved: 67, target: 100, score: 6.7 },
  { name: "7.2 Segregated Waste Transportation", achieved: 82, target: 100, score: 8.2 },
  { name: "7.3 Minimum Manpower Deployment", achieved: 76, target: 100, score: 7.6 },
  { name: "7.4 Functional Closed Bins Availability", achieved: 71, target: 100, score: 7.1 },
  { name: "7.5 Bin Replacement within 24h", achieved: 62, target: 100, score: 6.2 },
  { name: "7.6 Bin Washing as per MIOP", achieved: 65, target: 100, score: 6.5 },
  { name: "7.7 Top Cover for Secondary Vehicles", achieved: 78, target: 100, score: 7.8 },
  { name: "7.8 O&M of Static Compactors", achieved: 73, target: 100, score: 7.3 },
  { name: "7.9A Waste Supply to Centralized Facility", achieved: 84, target: 100, score: 8.4 },
  { name: "7.9B Waste Disposal to Dumpsite / SLF", achieved: 79, target: 100, score: 7.9 }
];

export const kpiCompliance = [
  { name: "8.1 Submission of Reports as per MIOP", achieved: 92, target: 100, score: 9.2 },
  { name: "8.2A Minimum Manpower Provision", achieved: 86, target: 100, score: 8.6 },
  { name: "8.2B Minimum Infrastructure Provision", achieved: 81, target: 100, score: 8.1 },
  { name: "10.1 Legal Compliance", achieved: 95, target: 100, score: 9.5 },
  { name: "10.2A PPE Compliance for Manpower", achieved: 74, target: 100, score: 7.4 },
  { name: "10.2B PPE Safety Compliance", achieved: 77, target: 100, score: 7.7 },
  { name: "10.3 Non-Mixing of Waste Streams", achieved: 83, target: 100, score: 8.3 },
  { name: "10.4 Facility & System Inspections", achieved: 88, target: 100, score: 8.8 }
];

export const kpiService = [
  { name: "9.1 Complaint Redressal within 6 Hours", achieved: 87, target: 100, score: 8.7 },
  { name: "9.2 Asset Complaint Resolution within 24 Hours", achieved: 79, target: 100, score: 7.9 },
  { name: "9.3 24x7 Call Centre (IVRS)", achieved: 93, target: 100, score: 9.3 }
];

export const kpiAwareness = [
  { name: "11.1 IEC Activities as per Schedule", achieved: 72, target: 100, score: 7.2 },
  { name: "11.2 Door-to-Door Campaign Coverage", achieved: 68, target: 100, score: 6.8 },
  { name: "11.3 Household Segregation Achievement", achieved: 75, target: 100, score: 7.5 }
];

export const attendanceMarkers: [number, number, string][] = [
  [13.082, 80.270, "Machine M-21"], [13.098, 80.284, "Machine M-08"],
  [13.065, 80.245, "Machine M-33"], [13.11, 80.295, "Machine M-44"],
  [13.05, 80.29, "Machine M-60"], [13.1078, 80.2895, "Machine M-71"],
  [13.1123, 80.3012, "Machine M-72"], [13.1014, 80.2768, "Machine M-73"],
  [13.0956, 80.2684, "Machine M-74"], [13.1182, 80.2927, "Machine M-75"],
  [13.0897, 80.2813, "Machine M-76"], [13.1059, 80.3041, "Machine M-77"],
  [13.0971, 80.2965, "Machine M-78"], [13.1106, 80.2739, "Machine M-79"],
  [13.0928, 80.2876, "Machine M-80"]
];

export const faceDetectionDevices: FaceDevice[] = [
  { id: "FD-001", location: "Main Gate", status: "online", lastSync: "2 min ago", scans: 156 },
  { id: "FD-002", location: "Zone 1 Office", status: "online", lastSync: "5 min ago", scans: 89 },
  { id: "FD-003", location: "Zone 2 Office", status: "offline", lastSync: "45 min ago", scans: 0 },
  { id: "FD-004", location: "Workshop", status: "online", lastSync: "1 min ago", scans: 45 }
];

export const attendanceRows: AttendanceRecord[] = Array.from({ length: 50 }, (_, i) => ({
  srNo: i + 1, sysId: `SYS${1000 + i}`, empCode: `EMP${100 + i}`,
  empName: ["Rajesh Kumar","Amit Singh","Suresh Patel","Mohammed Khan","Ravi Sharma","Priya Verma","Ankit Gupta","Vikram Yadav"][i % 8],
  designation: ["Supervisor","Driver","Sweeper","Loader"][i % 4],
  department: ["Collection","Sweeping","Transportation","Processing"][i % 4],
  masterShift: ["General","A Shift","B Shift","C Shift"][i % 4],
  actualShift: ["General","A Shift","B Shift","C Shift"][i % 4],
  zone: `Zone ${(i % 2) + 1}`, ward: `Ward ${(i % 20) + 1}`,
  deviceId: `FD-00${(i % 4) + 1}`, kpiCategory: ["5.1","6.2","6.3","7.1"][i % 4],
  date: "2026-03-05",
  punchIn: `0${6 + (i % 3)}:${String((i * 7) % 60).padStart(2, "0")}`,
  punchOut: `${14 + (i % 4)}:${String((i * 11) % 60).padStart(2, "0")}`,
  totalTime: `${8 + (i % 2)}:${String((i * 13) % 60).padStart(2, "0")}`,
  status: (["present","present","present","present","present","late","absent","leave"] as const)[i % 8]
}));

export const attendanceColumns: AttendanceColumn[] = [
  { key: "srNo", label: "Sr. No", width: 80, sticky: true },
  { key: "sysId", label: "Sys Id", width: 120, sticky: true },
  { key: "empCode", label: "Emp Code", width: 130, sticky: true },
  { key: "empName", label: "Emp Name", width: 170, sticky: true },
  { key: "designation", label: "Designation", width: 150 },
  { key: "department", label: "Department", width: 165 },
  { key: "masterShift", label: "Master Shift", width: 145 },
  { key: "actualShift", label: "Actual Shift", width: 145 },
  { key: "zone", label: "Zone", width: 120 },
  { key: "ward", label: "Ward", width: 120 },
  { key: "deviceId", label: "Device Id", width: 120 },
  { key: "kpiCategory", label: "KPI Category", width: 120 },
  { key: "date", label: "Date", width: 130 },
  { key: "punchIn", label: "Punch In", width: 110 },
  { key: "punchOut", label: "Punch Out", width: 110 },
  { key: "totalTime", label: "Total Time", width: 120 },
  { key: "status", label: "Status", width: 130 }
];

export const collectionAssets: CollectionAsset[] = [
  { id: "Bins", name: "RFID Tag 120L Bins", total: 5869, scanned: 3975, notScanned: 1294, compliance: 67, color: "#16a34a" },
  { id: "bov", name: "RFID Tag BOVs", total: 1672, scanned: 410, notScanned: 1262, compliance: 24, color: "#2563eb" },
  { id: "evehicle", name: "RFID Tag e-Vehicles", total: 1167, scanned: 750, notScanned: 417, compliance: 64, color: "#eab308" },
  { id: "compactor", name: "RFID Tag Compactors", total: 49, scanned: 14, notScanned: 35, compliance: 29, color: "#4f46e5" },
  { id: "tipper", name: "RFID Tag Tippers", total: 15, scanned: 9, notScanned: 6, compliance: 60, color: "#ef4444" },
  { id: "sweeper", name: "Mechanical Sweepers", total: 27, scanned: 10, notScanned: 17, compliance: 37, color: "#0ea5e9" },
  { id: "tricycle", name: "BOV vehicles", total: 26, scanned: 0, notScanned: 26, compliance: 0, color: "#14b8a6" },
  { id: "excavator", name: "Excavator Vehicles", total: 6, scanned: 1, notScanned: 5, compliance: 16, color: "#f97316" }
];

export const collectionHotspots = [
  { lat: 13.112, lng: 80.292, asset: "Bins", intensity: 0.9 },
  { lat: 13.115, lng: 80.287, asset: "Bins", intensity: 0.8 },
  { lat: 13.118, lng: 80.295, asset: "bov", intensity: 0.7 },
  { lat: 13.120, lng: 80.299, asset: "compactor", intensity: 0.6 },
  { lat: 13.108, lng: 80.283, asset: "tipper", intensity: 0.5 },
  { lat: 13.105, lng: 80.279, asset: "Bins", intensity: 0.85 },
  { lat: 13.102, lng: 80.276, asset: "bov", intensity: 0.6 },
  { lat: 13.100, lng: 80.272, asset: "compactor", intensity: 0.55 },
  { lat: 13.098, lng: 80.268, asset: "tipper", intensity: 0.5 },
  { lat: 13.096, lng: 80.265, asset: "Bins", intensity: 0.7 },
  { lat: 13.094, lng: 80.262, asset: "Bins", intensity: 0.8 },
  { lat: 13.092, lng: 80.259, asset: "bov", intensity: 0.65 },
  { lat: 13.110, lng: 80.275, asset: "Bins", intensity: 0.9 },
  { lat: 13.108, lng: 80.271, asset: "bov", intensity: 0.75 },
  { lat: 13.114, lng: 80.285, asset: "Bins", intensity: 0.85 },
  { lat: 13.116, lng: 80.282, asset: "bov", intensity: 0.7 },
];

export const collectionAssetCategories = [
  "RFID Tag for Metal Bins", "RFID Tag for BOV",
  "RFID Tag for Compactor", "RFID Tag for Tipper"
];

export const collectionReaderCategories = [
  "RFID Reader For RC Compactor",
  "RFID Reader For IC Compactor",
  "RFID Reader For Parking Yard"
];

export const FIELD_ACTIVITY_TABS = [
  "PC - HH Segregation Waste Confirmation",
  "PC - Waste Deposit MCC & RRC",
  "SC Waste Collection From RC",
  "Bins",
  "SC - Clearing Waste From Market Areas",
  "SC Clearing Horticulture Waste",
  "SC Clearing Drains Silt",
  "SC - Disinfection Of Bins",
  "DHW",
  "BW - Bin Washing",
  "SS Mechanical Street Sweeping",
  "SS Manual Street Sweeping",
  "Collection HS",
  "IEC - IEC Activities"
] as const;

export const FIELD_STAFF_COLUMNS: FieldStaffColumn[] = [
  { key: "srNo", label: "Sr No" }, { key: "taskGroup", label: "Task Group" },
  { key: "taskName", label: "Task Name" }, { key: "dateOfCreation", label: "Date of Creation" },
  { key: "status", label: "Status" },
  { key: "hhName", label: "HH Name" }, { key: "hhNumber", label: "HH Number" },
  { key: "image", label: "Image" }, { key: "collectionType", label: "Collection Type" },
  { key: "zone", label: "Zone" }, { key: "ward", label: "Ward" },
  { key: "location", label: "Location" }, { key: "bovRouteNo", label: "BOV Route No" },
  { key: "noOfHH", label: "No of HH" }, { key: "noOfHHSegregating", label: "No of HH Segregating" },
  { key: "contactNumber", label: "Contact Number" }
];

export const monitoringSummaryCards = [
  { id: "rfid-parking", title: "RFID Reader At Parking Yards", icon: Radio, total: 0, online: 0, compliance: 0, offline: 0 },
  { id: "rfid-compactor", title: "RFID Reader For RC Compactor", icon: Truck, total: 0, online: 0, compliance: 0, offline: 0 },
  { id: "face-detection", title: "Face Detection/Fingerprint Machine", icon: ScanFace, total: 70, online: 61, compliance: 87, offline: 9 },
];

export const assetSubCategories: Record<string, string[]> = {
  Vehicle: ["Compactor", "Tipper", "E-Rickshaw", "Truck", "Van"],
  Bin: ["Wet Waste Bin", "Dry Waste Bin", "Street Sweeping Bin", "Silt Bin"],
  Equipment: ["Wheelbarrow", "Broom", "Shovel", "Cart"]
};

export const blankAssetForm = {
  assetCode: "", category: "", subCategory: "", imeiNo: "",
  wardNo: "", zoneNo: "", location: "", installedArea: "",
  chassisNo: "", otherNo: "", dateOfInstallation: "", installedBy: "",
  status: "active" as const
};

export const initialAssets: AssetRecord[] = [
  { id: "AST-001", assetCode: "VEH001", category: "Vehicle", subCategory: "Compactor", imeiNo: "862177048199001", wardNo: "51", zoneNo: "Royapuram-5", location: "NN Garden", installedArea: "Washermanpet", chassisNo: "CH-2026-001", otherNo: "TN-05-AB-1234", dateOfInstallation: "2026-01-10", installedBy: "Vendor Team A", lastModifiedOn: "06-03-2026 11:45:30", status: "active" },
  { id: "AST-002", assetCode: "BIN012", category: "Bin", subCategory: "Wet Waste Bin", imeiNo: "", wardNo: "72", zoneNo: "Thiru Vi Ka Nagar-6", location: "Pulianthope 3rd Street", installedArea: "Pulianthope", chassisNo: "", otherNo: "BIN-TAG-9921", dateOfInstallation: "2026-02-18", installedBy: "Ward Crew 6", lastModifiedOn: "06-03-2026 09:22:12", status: "maintenance" },
  { id: "AST-003", assetCode: "EQU044", category: "Equipment", subCategory: "Wheelbarrow", imeiNo: "", wardNo: "77", zoneNo: "Beach", location: "North Market Lane", installedArea: "Market Area", chassisNo: "", otherNo: "EQ-7788", dateOfInstallation: "2025-12-01", installedBy: "Stores Department", lastModifiedOn: "05-03-2026 17:11:01", status: "inactive" }
];

export const blankEmployeeForm = {
  empCode: "", name: "", designation: "", department: "",
  zone: "", ward: "", shift: "", contactNo: "",
  joiningDate: "", status: "active" as const, kpiCategory: ""
};

export const initialEmployees: EmployeeRecord[] = [
  { id: "EMP-001", empCode: "EMP001", name: "Ravi Kumar", designation: "Driver", department: "Transport", zone: "Royapuram-5", ward: "51", shift: "Shift A", contactNo: "9876543210", joiningDate: "2025-10-12", status: "active", kpiCategory: "6.2 Deployment" },
  { id: "EMP-002", empCode: "EMP002", name: "Selvi M", designation: "Sweeper", department: "Sanitation", zone: "Thiru Vi Ka Nagar-6", ward: "72", shift: "Shift B", contactNo: "9876500011", joiningDate: "2025-09-08", status: "on-leave", kpiCategory: "5.1 Sweeping" },
  { id: "EMP-003", empCode: "EMP003", name: "Murugan K", designation: "Supervisor", department: "Operations", zone: "Beach", ward: "77", shift: "Shift C", contactNo: "9876500022", joiningDate: "2024-12-22", status: "inactive", kpiCategory: "7.1 Bins" }
];

export const blankGrievanceForm = {
  categoryName: "", slaCategory: "", categoryType: "", status: "ACTIVE" as const
};

const grievanceSeedRows: Omit<GrievanceRecord, "id" | "srNo">[] = [
  { categoryName: "REMOVAL OF GARBAGE", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "ABSENTEEISM OF SWEEPERS", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "OVERFLOWING OF GARBAGE BIN", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "PROVISION OF GARBAGE BIN", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "BROKEN BIN", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "IMPROPER SWEEPING", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "SPILLING OF GARBAGE FROM LORRY", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "GARBAGE LORRY WITHOUT NET", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "ABSENTEEISM OF DOOR TO DOOR GARBAGE COLLECTOR", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "NUISANCE BY GARBAGE COMPACTOR OR TRUCK", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "OTHERS", slaCategory: "Infrastructure", categoryType: "Complaint", status: "DE-ACTIVE" },
  { categoryName: "SHIFTING OF GARBAGE BIN", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "BURNING OF GARBAGE", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "DEATH OF STRAY ANIMALS", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "CARCASS WASTE COLLECTION REQUEST", slaCategory: "Service", categoryType: "Services", status: "ACTIVE" },
  { categoryName: "ACCIDENT/EMERGENCY CLEANING REQUEST", slaCategory: "Service", categoryType: "Services", status: "ACTIVE" },
  { categoryName: "OTHERS", slaCategory: "Complaint", categoryType: "Services", status: "ACTIVE" },
  { categoryName: "REMOVAL OF GARBAGE", slaCategory: "Service", categoryType: "Services", status: "DE-ACTIVE" },
  { categoryName: "STREET SWEEPING", slaCategory: "Service", categoryType: "Services", status: "DE-ACTIVE" },
  { categoryName: "HOUSEHOLD BULK WASTE COLLECTION", slaCategory: "Service", categoryType: "Services", status: "ACTIVE" },
  { categoryName: "HORTICULTURE WASTE COLLECTION", slaCategory: "Service", categoryType: "Services", status: "ACTIVE" },
  { categoryName: "EXCELLET", slaCategory: "Complaint", categoryType: "Complaint", status: "DE-ACTIVE" },
  { categoryName: "SATISFIED", slaCategory: "", categoryType: "Feedback", status: "ACTIVE" },
  { categoryName: "NOT SATISFIED", slaCategory: "", categoryType: "Feedback", status: "ACTIVE" },
  { categoryName: "POOR", slaCategory: "", categoryType: "Feedback", status: "ACTIVE" },
  { categoryName: "BOV NOT ARRIVED", slaCategory: "Complaint", categoryType: "Complaint", status: "DE-ACTIVE" },
  { categoryName: "BOV ACCIDENT", slaCategory: "Infrastructure", categoryType: "Complaint", status: "DE-ACTIVE" },
  { categoryName: "GARDEN WASTE", slaCategory: "Service", categoryType: "Services", status: "DE-ACTIVE" },
  { categoryName: "SPILLAGE OF GARBAGE FROM BOV", slaCategory: "Complaint", categoryType: "Complaint", status: "ACTIVE" },
  { categoryName: "LIME POWDER NOT APPLIED", slaCategory: "Complaint", categoryType: "Complaint", status: "DE-ACTIVE" },
  { categoryName: "Water Tanker", slaCategory: "Service", categoryType: "Services", status: "DE-ACTIVE" }
];

export const initialGrievances: GrievanceRecord[] = grievanceSeedRows.map((row, index) => ({
  id: `GRV-${String(index + 1).padStart(3, "0")}`,
  srNo: index + 1,
  ...row
}));

const fieldNames = ["Ravi Kumar","Selvi M","Murugan K","Lakshmi P","Suresh R","Anitha S","Karthik V","Priya D"];
const fieldLocations = ["Anna Nagar","T. Nagar","Mylapore","Adyar","Velachery","Perambur","Tondiarpet","Royapuram"];
const fieldCollections = ["Wet","Dry","Mixed","Hazardous"];

export function generateFieldStaffData(activity: string, wards: string[]): StaffRecord[] {
  const statuses: ("Closed"|"Open"|"Pending")[] = ["Closed","Open","Pending"];
  const wardPool = wards.length ? wards : ["51","55","60","72","77","88"];
  return Array.from({ length: 47 }, (_, i) => ({
    srNo: i + 1,
    taskGroup: activity.includes(" - ") ? activity.split(" - ")[0] : activity.slice(0, 4),
    taskName: activity,
    dateOfCreation: `2026-03-${String((i % 28) + 1).padStart(2, "0")}`,
    status: statuses[i % statuses.length],
    remarks1: i % 3 === 0 ? "Completed on time" : i % 3 === 1 ? "In progress" : "Awaiting confirmation",
    hhName: fieldNames[i % fieldNames.length],
    hhNumber: `HH-${String(1000 + i).padStart(5, "0")}`,
    image: "image.png",
    collectionType: fieldCollections[i % fieldCollections.length],
    zone: ZONES[i % ZONES.length],
    ward: wardPool[i % wardPool.length] || "1",
    location: fieldLocations[i % fieldLocations.length],
    bovRouteNo: `R-${String(100 + (i % 20)).padStart(3, "0")}`,
    noOfHH: 20 + (i % 30),
    noOfHHSegregating: 10 + (i % 25),
    contactNumber: `98${String(40000000 + i * 1111).padStart(8, "0")}`
  }));
}

export function generateMonitoringDevices(wards: string[]): MonitoringDevice[] {
  return Array.from({ length: 70 }, (_, i) => ({
    id: i + 1,
    deviceStatus: (i % 8 !== 0 ? "Online" : "Offline") as "Online" | "Offline",
    assetCode: `AST/00000008${String(62 - (i % 60)).padStart(2, "0")}`,
    assetCategory: "Face Detection Machine" as const,
    imei: `JBY124180${String(500 - i).padStart(4, "0")}`,
    ward: wards[i % wards.length] || String((i % 100) + 1)
  }));
}

export function generateCollectionReportRows(zones: string[], wards: string[]): CollectionReportRow[] {
  const zonePool = zones.length ? zones : Array.from(ZONES);
  const wardPool = wards.length ? wards : ["51","55","60","72","77","88"];
  const pad = (v: number) => String(v).padStart(2, "0");
  return Array.from({ length: 62 }, (_, i) => {
    const day = 7 - (i % 2);
    const hour = 10 + (i % 4);
    const min = 50 - (i % 40);
    const sec = 50 - (i % 30);
    const ts = `${pad(day)}-03-2026 ${pad(hour)}:${pad(Math.max(0, min))}:${pad(Math.max(0, sec))}`;
    return {
      srNo: i + 1,
      assetCode: `AST/000000${String(7065 + i).padStart(4, "0")}`,
      assetCategory: collectionAssetCategories[i % collectionAssetCategories.length],
      imeiSlMfg: `E200470${String(7000 + i).padStart(4, "0")}D${String(900 + i).padStart(4, "0")}`,
      tagVehicleNo: `TN02CE${String(4900 + (i % 80)).padStart(4, "0")}`,
      wardNo: wardPool[i % wardPool.length],
      zoneNo: zonePool[i % zonePool.length],
      scannedByReader: String(1811450 + (i % 18)),
      readerCategory: collectionReaderCategories[i % collectionReaderCategories.length],
      readerVehicleNo: `TN02CE${String(4930 + (i % 40)).padStart(4, "0")}`,
      readerZone: zonePool[(i + 1) % zonePool.length],
      readerWard: wardPool[(i + 2) % wardPool.length],
      totalScanned: (i % 4) + 1,
      actualShift: (["A","B","C"] as const)[i % 3],
      lastScannedTime: ts, inTime: ts, outTime: ts
    };
  });
}
