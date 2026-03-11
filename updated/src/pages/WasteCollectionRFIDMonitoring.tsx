import { useMemo, useState } from "react";

export type WasteCollectionRfidRow = {
  id: number;
  zone: string;
  tagId: string;
  lastSeen: string;
  status: "scanned" | "not-scanned";
};

export function WasteCollectionRFIDMonitoring({
  data,
  initialZone,
}: {
  data: WasteCollectionRfidRow[];
  initialZone: string;
}) {
  const [zone, setZone] = useState(initialZone);

  const filtered = useMemo(
    () => data.filter((row) => row.zone === zone),
    [data, zone]
  );

  return (
    <div className="card">
      <div className="card-head">
        <h3>RFID Monitoring</h3>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ fontSize: 12, opacity: 0.7 }}>
            Zone
            <select style={{ marginLeft: 6 }} value={zone} onChange={(e) => setZone(e.target.value)}>
              {[...new Set(data.map((r) => r.zone))].map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </label>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            Showing {filtered.length} items
          </span>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tag</th>
              <th>Status</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.tagId}</td>
                <td>{row.status}</td>
                <td>{row.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
