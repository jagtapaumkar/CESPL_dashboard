import { useRef, useState } from "react";
import { Check, Download, Image, Printer, X } from "lucide-react";

type WardData = {
  sNo: number;
  ward: string;
  bovDrivers: { miop: number; actual: number; percentage: string };
  sweepers: { miop: number; actual: number; percentage: string };
};

const reportData: WardData[] = [
  { sNo: 1, ward: "49", bovDrivers: { miop: 35, actual: 17, percentage: "49%" }, sweepers: { miop: 20, actual: 46, percentage: "230%" } },
  { sNo: 2, ward: "50", bovDrivers: { miop: 36, actual: 17, percentage: "47%" }, sweepers: { miop: 23, actual: 30, percentage: "130%" } },
  { sNo: 3, ward: "51", bovDrivers: { miop: 33, actual: 16, percentage: "48%" }, sweepers: { miop: 13, actual: 37, percentage: "285%" } },
  { sNo: 4, ward: "52", bovDrivers: { miop: 33, actual: 10, percentage: "30%" }, sweepers: { miop: 17, actual: 27, percentage: "159%" } },
  { sNo: 5, ward: "53", bovDrivers: { miop: 34, actual: 17, percentage: "50%" }, sweepers: { miop: 22, actual: 37, percentage: "168%" } },
  { sNo: 6, ward: "54", bovDrivers: { miop: 40, actual: 19, percentage: "48%" }, sweepers: { miop: 22, actual: 42, percentage: "191%" } },
  { sNo: 7, ward: "55", bovDrivers: { miop: 40, actual: 22, percentage: "55%" }, sweepers: { miop: 20, actual: 28, percentage: "140%" } },
  { sNo: 8, ward: "56", bovDrivers: { miop: 33, actual: 18, percentage: "55%" }, sweepers: { miop: 19, actual: 36, percentage: "189%" } },
  { sNo: 9, ward: "57", bovDrivers: { miop: 36, actual: 32, percentage: "89%" }, sweepers: { miop: 27, actual: 54, percentage: "200%" } },
  { sNo: 10, ward: "58", bovDrivers: { miop: 34, actual: 24, percentage: "71%" }, sweepers: { miop: 31, actual: 49, percentage: "158%" } },
  { sNo: 11, ward: "59", bovDrivers: { miop: 31, actual: 33, percentage: "106%" }, sweepers: { miop: 19, actual: 72, percentage: "379%" } },
  { sNo: 12, ward: "60", bovDrivers: { miop: 35, actual: 26, percentage: "74%" }, sweepers: { miop: 30, actual: 64, percentage: "213%" } },
  { sNo: 13, ward: "61", bovDrivers: { miop: 32, actual: 27, percentage: "84%" }, sweepers: { miop: 23, actual: 55, percentage: "239%" } },
  { sNo: 14, ward: "62", bovDrivers: { miop: 31, actual: 23, percentage: "74%" }, sweepers: { miop: 24, actual: 31, percentage: "129%" } },
  { sNo: 15, ward: "63", bovDrivers: { miop: 30, actual: 20, percentage: "67%" }, sweepers: { miop: 21, actual: 27, percentage: "129%" } },
  { sNo: 16, ward: "Secretariate", bovDrivers: { miop: 0, actual: 2, percentage: "0%" }, sweepers: { miop: 31, actual: 26, percentage: "84%" } },
  { sNo: 17, ward: "High Court", bovDrivers: { miop: 0, actual: 1, percentage: "0%" }, sweepers: { miop: 31, actual: 16, percentage: "52%" } },
  { sNo: 18, ward: "Priority", bovDrivers: { miop: 20, actual: 0, percentage: "0%" }, sweepers: { miop: 0, actual: 20, percentage: "0%" } }
];

const totals = {
  bovDrivers: { miop: 533, actual: 324, percentage: "53%" },
  sweepers: { miop: 393, actual: 697, percentage: "171%" }
};

interface ManpowerDeploymentReportModalProps {
  zone: string;
  shift: string;
  date: string;
  onClose: () => void;
}

export function ManpowerDeploymentReportModal({ zone, shift, date, onClose }: ManpowerDeploymentReportModalProps) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "error">("idle");

  const reportTitle = `Zone-${zone} ${shift} Shift Manpower Deployment Details on ${date}`;

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Manpower Deployment Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #0f172a; }
            .title { text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 14px; background: #dbeafe; padding: 10px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #cbd5e1; padding: 7px 8px; text-align: center; font-size: 12px; }
            thead th { background: #1d4ed8; color: #ffffff; font-weight: 700; }
            .total-row td { background: #d1fae5; font-weight: 700; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>${printRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportCsv = () => {
    let csv = `${reportTitle}\n\n`;
    csv += "S. No,Ward,BoV Drivers MIOP,BoV Drivers Actual,BoV Drivers %,Sweepers MIOP,Sweepers Actual,Sweepers %\n";
    reportData.forEach((row) => {
      csv += `${row.sNo},${row.ward},${row.bovDrivers.miop},${row.bovDrivers.actual},${row.bovDrivers.percentage},${row.sweepers.miop},${row.sweepers.actual},${row.sweepers.percentage}\n`;
    });
    csv += `Total,,${totals.bovDrivers.miop},${totals.bovDrivers.actual},${totals.bovDrivers.percentage},${totals.sweepers.miop},${totals.sweepers.actual},${totals.sweepers.percentage}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `manpower-deployment-report-${zone}-${shift}-${date.replace(/\//g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleCopyAsImage = async () => {
    if (!printRef.current) return;
    setCopyState("copying");

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(printRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true
      });

      const imageResponse = await fetch(dataUrl);
      const imageBlob = await imageResponse.blob();

      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
        throw new Error("Clipboard image API not available");
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": imageBlob
        })
      ]);

      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1500);
    }
  };

  return (
    <div className="att-report-modal-backdrop" onClick={onClose}>
      <div className="att-report-modal" onClick={(event) => event.stopPropagation()}>
        <div className="att-report-modal-head">
          <h2>Manpower Deployment Report</h2>
          <div className="att-report-modal-actions">
            <button className="ghost" onClick={handleCopyAsImage} disabled={copyState === "copying"}>
              {copyState === "copied" ? <Check size={14} /> : <Image size={14} />}
              {copyState === "copied" ? "Copied" : copyState === "copying" ? "Copying..." : copyState === "error" ? "Retry Copy" : "Copy as Image"}
            </button>
            <button className="ghost" onClick={handleExportCsv}><Download size={14} /> Export CSV</button>
            <button className="ghost" onClick={handlePrint}><Printer size={14} /> Print</button>
            <button className="ghost icon-only" onClick={onClose} aria-label="Close report modal"><X size={16} /></button>
          </div>
        </div>

        <div className="att-report-modal-body">
          <div className="att-manpower-report" ref={printRef}>
            <div className="att-manpower-report-title">{reportTitle}</div>
            <div className="att-manpower-table-wrap">
              <table className="att-manpower-table">
                <thead>
                  <tr>
                    <th rowSpan={2}>S.No</th>
                    <th rowSpan={2}>Ward</th>
                    <th colSpan={3}>BoV Drivers</th>
                    <th colSpan={3}>Sweepers</th>
                  </tr>
                  <tr>
                    <th>MIOP</th>
                    <th>Actual</th>
                    <th>%</th>
                    <th>MIOP</th>
                    <th>Actual</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row) => (
                    <tr key={row.sNo}>
                      <td>{row.sNo}</td>
                      <td>{row.ward}</td>
                      <td>{row.bovDrivers.miop}</td>
                      <td>{row.bovDrivers.actual}</td>
                      <td>{row.bovDrivers.percentage}</td>
                      <td>{row.sweepers.miop}</td>
                      <td>{row.sweepers.actual}</td>
                      <td>{row.sweepers.percentage}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan={2}>Total</td>
                    <td>{totals.bovDrivers.miop}</td>
                    <td>{totals.bovDrivers.actual}</td>
                    <td>{totals.bovDrivers.percentage}</td>
                    <td>{totals.sweepers.miop}</td>
                    <td>{totals.sweepers.actual}</td>
                    <td>{totals.sweepers.percentage}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
