import { ZONES } from "../data";
import { DataGrid } from "../components/DataGrid";

export function ModulePage({ title }: { title: string }) {
  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3>{title} - Filters</h3></div>
          <div className="filters">
            <select>{ZONES.map((z) => <option key={z}>{z}</option>)}</select>
            <select><option>All Wards</option></select>
            <select><option>Last 7 Days</option></select>
            <button className="primary">Apply</button>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>{title} - KPI Snapshot</h3></div>
          <div className="snapshot">
            <div><strong>1,842</strong><span>Total</span></div>
            <div><strong>327</strong><span>Pending</span></div>
            <div><strong>81%</strong><span>Compliance</span></div>
            <div><strong>93</strong><span>Critical Alerts</span></div>
          </div>
        </div>
      </div>
      <DataGrid title={`${title} Data Table`} />
    </>
  );
}
