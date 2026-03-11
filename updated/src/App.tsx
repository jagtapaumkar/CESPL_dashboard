import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Plus,
  Bell,
  Search,
  ClipboardCheck,
  MessageSquareWarning,
  Trash2,
  AlertTriangle,
  CalendarCheck,
  FileBarChart,
  FileSpreadsheet,
  Users,
  Package,
  UserCog,
  ShieldCheck,
  Radar
} from "lucide-react";
import { AttendanceDashboardPage } from "./pages/AttendanceDashboardPage";
import { AttendanceReportsPage } from "./pages/AttendanceReportsPage";
import { AssetMasterPage } from "./pages/AssetMasterPage";
import { CitizenGrievanceDashboardPage } from "./pages/CitizenGrievanceDashboardPage";
import { CollectionReportsPage } from "./pages/CollectionReportsPage";
import { ComplaintMisPage } from "./pages/ComplaintMisPage";
import { DailyMonitoringPage } from "./pages/DailyMonitoringPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EmployeeMasterPage } from "./pages/EmployeeMasterPage";
import { FieldStaffActivityPage } from "./pages/FieldStaffActivityPage";
import { GrievanceMasterPage } from "./pages/GrievanceMasterPage";
import { KpiDashboardPage } from "./pages/KpiDashboardPage";
import { OperationsIePage } from "./pages/OperationsIePage";
import { WasteCollectionDashboardPage } from "./pages/WasteCollectionDashboardPage";
import { AttendanceHeaderLottie } from "./components/AttendanceHeaderLottie";
import { RegisterComplaintModal } from "./components/RegisterComplaintModal";
import type { OpsComplaint, RegisterComplaintFormData } from "./types";
import { opsComplaintImage, ZONES, initialOpsComplaints } from "./data";
import "./styles.css";
import logo from "./assets/logo.png";

type PageKey =
  | "dashboard"
  | "kpi"
  | "attendance"
  | "attendanceReports"
  | "waste"
  | "dailyMonitoring"
  | "complaintMis"
  | "citizenGrievanceDashboard"
  | "citizenGrievance"
  | "operationsIe"
  | "collectionReports"
  | "assetMaster"
  | "employeeMaster"
  | "grievanceMaster"
  | "fieldStaff";

type PageSearchItem = {
  key: PageKey;
  label: string;
  section: string;
  keywords: string;
};

const GlobalDustbinBackground = lazy(() => import("./components/GlobalDustbinBackground"));
const PageTransitionLoader = lazy(() => import("./components/PageTransitionLoader"));
const PAGE_TRANSITION_MS = 2800;

export default function App() {
  const [active, setActive] = useState<PageKey>("dashboard");
  const [complaints, setComplaints] = useState(initialOpsComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPageSearchOpen, setIsPageSearchOpen] = useState(false);
  const [searchHighlightIndex, setSearchHighlightIndex] = useState(0);
  const [isPageTransitioning, setIsPageTransitioning] = useState(true);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const wards = useMemo(() => Array.from({ length: 120 }, (_, i) => String(i + 1)), []);
  const zones = useMemo(() => Array.from(ZONES), []);

  useEffect(() => {
    transitionTimerRef.current = window.setTimeout(() => {
      setIsPageTransitioning(false);
    }, PAGE_TRANSITION_MS);

    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const navigateToPage = (pageKey: PageKey) => {
    if (pageKey === active) return;

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }

    setIsPageTransitioning(true);
    transitionTimerRef.current = window.setTimeout(() => {
      setActive(pageKey);
      setIsPageTransitioning(false);
    }, PAGE_TRANSITION_MS);
  };

  const handleRegisterSubmit = (data: RegisterComplaintFormData & { image?: string }) => {
    const now = new Date();
    const nextId = complaints.length ? Math.max(...complaints.map((c) => c.id)) + 1 : 1;
    const newComplaint: OpsComplaint = {
      id: nextId,
      srNo: complaints.length + 1,
      image: data.image ?? opsComplaintImage,
      complaintNo: `COMP/${String(Date.now()).slice(-10)}`,
      complainantContactNo: data.contactNo,
      kpiCategory: data.kpiCategory,
      issueType: data.issueType,
      description: data.description,
      zone: data.zone,
      wardNo: data.ward,
      location: `${data.streetName}, ${data.zone}`,
      complaintCreatedOn: now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      complaintClosureOn: "",
      actualDuration: "",
      streetName: data.streetName,
      startTime: "",
      endTime: "",
      status: "Open",
      closeTimeLocation: "",
      closingImage: "",
      actionRemarks: "",
      timeHint: "0m",
      branchTone: "open"
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    navigateToPage("operationsIe");
  };

  const pages: Record<PageKey, { label: string; render: () => JSX.Element }> = {
    dashboard: { label: "Dashboard", render: () => <DashboardPage /> },
    kpi: { label: "KPI Dashboard", render: () => <KpiDashboardPage /> },
    attendance: { label: "Attendance Dashboard", render: () => <AttendanceDashboardPage /> },
    attendanceReports: { label: "Attendance Reports", render: () => <AttendanceReportsPage /> },
    waste: { label: "Waste Collection", render: () => <WasteCollectionDashboardPage /> },
    dailyMonitoring: { label: "Daily Monitoring", render: () => <DailyMonitoringPage wards={wards} /> },
    complaintMis: { label: "Complaint MIS", render: () => <ComplaintMisPage complaints={complaints} /> },
    citizenGrievanceDashboard: { label: "Citizen Grievance Dashboard", render: () => <CitizenGrievanceDashboardPage /> },
    citizenGrievance: { label: "Citizen Grievance", render: () => <OperationsIePage complaints={complaints} setComplaints={setComplaints} search={searchQuery} /> },
    operationsIe: { label: "IE Complaints", render: () => <OperationsIePage complaints={complaints} setComplaints={setComplaints} search={searchQuery} /> },
    collectionReports: { label: "Collection Reports", render: () => <CollectionReportsPage zones={zones} wards={wards} /> },
    assetMaster: { label: "Asset Master", render: () => <AssetMasterPage /> },
    employeeMaster: { label: "Employee Master", render: () => <EmployeeMasterPage /> },
    grievanceMaster: { label: "Grievance Master", render: () => <GrievanceMasterPage /> },
    fieldStaff: { label: "Field Staff Activity", render: () => <FieldStaffActivityPage zones={zones} wards={wards} /> },
  };

const navSections = [
  {
    title: "Dashboard",
    items: [
      { key: "dashboard", label: "Overview", icon: LayoutDashboard },
      { key: "kpi", label: "KPI Dashboard", icon: BarChart3 },
      { key: "attendance", label: "Attendance Dashboard", icon: ClipboardCheck },
      { key: "citizenGrievanceDashboard", label: "Citizen Grievance Dashboard", icon: MessageSquareWarning },
      { key: "waste", label: "Waste Collection", icon: Trash2 }
    ]
  },
  {
    title: "Operations",
    items: [
      { key: "citizenGrievance", label: "Citizen Grievance", icon: MessageSquareWarning },
      { key: "operationsIe", label: "IE Complaints", icon: AlertTriangle }
    ]
  },
  {
    title: "MIS & Reports",
    items: [
      { key: "attendanceReports", label: "Attendance Reports", icon: CalendarCheck },
      { key: "complaintMis", label: "Complaint MIS", icon: FileBarChart },
      { key: "collectionReports", label: "Collection Reports", icon: FileSpreadsheet },
      { key: "fieldStaff", label: "Field Staff Activity", icon: Users }
    ]
  },
  {
    title: "Masters",
    items: [
      { key: "assetMaster", label: "Asset Master", icon: Package },
      { key: "employeeMaster", label: "Employee Master", icon: UserCog },
      { key: "grievanceMaster", label: "Grievance Master", icon: ShieldCheck }
    ]
  },
  {
    title: "Monitoring",
    items: [
      { key: "dailyMonitoring", label: "Daily Monitoring", icon: Radar }
    ]
  }
];

  const pageSearchItems = useMemo<PageSearchItem[]>(() => {
    const sectionByKey = new Map<PageKey, string>();
    navSections.forEach((section) => {
      section.items.forEach((item) => {
        sectionByKey.set(item.key as PageKey, section.title);
      });
    });

    return (Object.keys(pages) as PageKey[]).map((key) => {
      const section = sectionByKey.get(key) ?? "Pages";
      const label = pages[key].label;
      return {
        key,
        label,
        section,
        keywords: `${label} ${section}`.toLowerCase()
      };
    });
  }, [navSections, pages]);

  const pageSearchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return pageSearchItems
      .filter((item) => item.keywords.includes(query))
      .sort((a, b) => {
        const aStarts = a.label.toLowerCase().startsWith(query) ? 0 : 1;
        const bStarts = b.label.toLowerCase().startsWith(query) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.label.localeCompare(b.label);
      })
      .slice(0, 8);
  }, [searchQuery, pageSearchItems]);

  useEffect(() => {
    if (!isPageSearchOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsPageSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isPageSearchOpen]);

  useEffect(() => {
    if (searchHighlightIndex > pageSearchResults.length - 1) {
      setSearchHighlightIndex(0);
    }
  }, [pageSearchResults, searchHighlightIndex]);

  const openPageFromSearch = (pageKey: PageKey) => {
    navigateToPage(pageKey);
    setIsPageSearchOpen(false);
    setSearchQuery("");
  };

  const handleGlobalSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPageSearchOpen || pageSearchResults.length === 0) {
      if (event.key === "Escape") setIsPageSearchOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSearchHighlightIndex((prev) => (prev + 1) % pageSearchResults.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSearchHighlightIndex((prev) => (prev - 1 + pageSearchResults.length) % pageSearchResults.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = pageSearchResults[searchHighlightIndex];
      if (selected) openPageFromSearch(selected.key);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsPageSearchOpen(false);
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <GlobalDustbinBackground />
      </Suspense>
      {isPageTransitioning && (
        <Suspense fallback={<div className="page-transition-overlay"><div className="page-transition-card"><p>Loading page...</p></div></div>}>
          <PageTransitionLoader />
        </Suspense>
      )}
      <div className="app">
      <aside className="sidebar">
        <div className="brand">
  <img src={logo} alt="Logo" className="logo" />
  <span className="brand-text">Chennai Enviro</span>
</div>
        <nav className="nav">
          {navSections.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="nav-heading">{section.title}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={isActive ? "nav-item active" : "nav-item"}
                    onClick={() => navigateToPage(item.key as PageKey)}
                  >
                    <span className="nav-item-icon"><Icon size={18} /></span>
                    <span className="nav-item-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      <main className="content">
        <div className="global-nav">
          <div className="global-nav-left">
            <div className="topbar-brand">
              <strong>Chennai Enviro</strong>
              <span>Solutions</span>
            </div>
          </div>
          <div className="global-nav-search" ref={searchRef}>
            <Search size={18} className="muted" />
            <input
              value={searchQuery}
              onChange={(e) => {
                const nextValue = e.target.value;
                setSearchQuery(nextValue);
                setIsPageSearchOpen(nextValue.trim().length > 0);
                setSearchHighlightIndex(0);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsPageSearchOpen(true);
              }}
              onKeyDown={handleGlobalSearchKeyDown}
              placeholder="Search complaints, employees, assets..."
            />
            {isPageSearchOpen && (
              <div className="global-search-dropdown" role="listbox" aria-label="Page search results">
                {pageSearchResults.length > 0 ? (
                  pageSearchResults.map((item, index) => (
                    <button
                      key={item.key}
                      type="button"
                      className={index === searchHighlightIndex ? "global-search-item active" : "global-search-item"}
                      onMouseEnter={() => setSearchHighlightIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => openPageFromSearch(item.key)}
                    >
                      <span>{item.label}</span>
                      <small>{item.section}</small>
                    </button>
                  ))
                ) : (
                  <div className="global-search-empty">No matching pages</div>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            className="global-nav-add"
            title="Register new complaint"
            onClick={() => setIsRegisterOpen(true)}
          >
            <Plus size={20} />
          </button>
          <div className="global-nav-right">
            <button type="button" className="global-bell" aria-label="Notifications">
              <Bell size={18} />
              <span>3</span>
            </button>
            <div className="global-profile">
              <div className="global-avatar">A</div>
              <div>
                <strong>ABC</strong>
                <p>Supervisor</p>
              </div>
            </div>
          </div>
        </div>
        <header className={active === "attendance" ? "page-header page-header-attendance" : "page-header"}>
          <h1>{pages[active].label}</h1>
          {active === "attendance" && <AttendanceHeaderLottie />}
        </header>
        <section className="page-body">{pages[active].render()}</section>
      </main>
      <RegisterComplaintModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={handleRegisterSubmit}
        zones={zones}
        wards={wards}
      />
      </div>
    </>
  );
}

