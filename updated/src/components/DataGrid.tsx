import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Filter, Search } from "lucide-react";
import type { Row } from "../types";
import { exportCsv } from "../utils";
import { queueRows } from "../data";

export function DataGrid({ title, data = queueRows, searchPlaceholder }: { title: string; data?: Row[]; searchPlaceholder?: string }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string>(Object.keys(data[0] ?? {})[0] ?? "ID");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const pageSize = 10;

  const filtered = useMemo(
    () =>
      data
        .filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(query.toLowerCase())))
        .sort((a, b) => {
          const av = String(a[sortKey]);
          const bv = String(b[sortKey]);
          return asc ? av.localeCompare(bv) : bv.localeCompare(av);
        }),
    [query, sortKey, asc, data]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const columns = Object.keys(data[0] ?? []);
  const isOperationalQueue = title === "Latest Operational Queue";

  return (
    <div className="card">
      <div className="card-head">
        <h3>{title}</h3>
        <div className="row-actions">
          <button className="ghost" onClick={() => exportCsv(filtered)}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>
      <div className="toolbar">
        <div className="searchbox">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => { setPage(1); setQuery(e.target.value); }}
            placeholder={searchPlaceholder ?? "Search by code, zone, ward, status..."}
          />
        </div>
        <button className="ghost"><Filter size={15} /> Advanced Filter</button>
        <button className="ghost" disabled={!selected.length}>Bulk Action ({selected.length})</button>
      </div>
      <div className="table-wrap">
        <table className={isOperationalQueue ? "queue-table" : undefined}>
          <thead>
            <tr>
              <th />
              {columns.map((c) => (
                <th key={c} onClick={() => { setAsc(sortKey === c ? !asc : true); setSortKey(c); }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => {
              const id = Number(r.ID);
              return (
                <tr key={id}>
                  <td>
                    <input type="checkbox" checked={selected.includes(id)}
                      onChange={(e) => setSelected((s) => e.target.checked ? [...s, id] : s.filter((x) => x !== id))} />
                  </td>
                  {columns.map((c) => <td key={c}>{String(r[c])}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <span>{filtered.length} rows | page {page}/{totalPages}</span>
        <div>
          <button className="ghost" onClick={() => setPage(Math.max(1, page - 1))}><ChevronLeft size={14} /></button>
          <button className="ghost" onClick={() => setPage(Math.min(totalPages, page + 1))}><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
