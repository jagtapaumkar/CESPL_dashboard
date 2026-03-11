import { useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { ZONES, collectionAssets } from "../data";
import { WasteCollectionRFIDMonitoring } from "./WasteCollectionRFIDMonitoring";
import { wasteCollectionRfidData } from "./wasteCollectionRfidData";

function AssetSvg({ asset, color }: { asset: string; color: string }) {
  if (asset.includes("Bins")) return (
    <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
      <rect x="18" y="18" width="28" height="34" rx="4" fill={color} opacity="0.16" />
      <rect x="22" y="24" width="20" height="24" rx="3" stroke={color} strokeWidth="3" fill="none" />
      <rect x="20" y="14" width="24" height="6" rx="2" fill={color} />
    </svg>
  );
  if (asset.includes("BOV")) return (
    <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
      <rect x="10" y="24" width="30" height="18" rx="4" fill={color} opacity="0.15" />
      <rect x="16" y="18" width="20" height="12" rx="2" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="20" cy="45" r="4" fill={color} /><circle cx="36" cy="45" r="4" fill={color} />
    </svg>
  );
  return (
    <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
      <circle cx="22" cy="42" r="4" fill={color} /><circle cx="40" cy="42" r="4" fill={color} />
      <rect x="10" y="24" width="34" height="14" rx="3" stroke={color} strokeWidth="3" fill="none" />
      <rect x="38" y="20" width="12" height="10" rx="2" fill={color} opacity="0.2" />
    </svg>
  );
}

export function WasteCollectionDashboardPage() {
  const [query, setQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string>("Bins");
  const [zoneScope, setZoneScope] = useState<(typeof ZONES)[number]>(ZONES[0]);
  const [showOnlyNotScanned, setShowOnlyNotScanned] = useState(false);

  const visibleAssets = collectionAssets.filter((a) => {
    const byQuery = a.name.toLowerCase().includes(query.toLowerCase());
    const byFlag = showOnlyNotScanned ? a.notScanned > 0 : true;
    return byQuery && byFlag;
  });
  const totalCount = visibleAssets.reduce((s, a) => s + a.total, 0);

  return (
    <>
      <div className="card">
        <div className="filters">
          <select value={zoneScope} onChange={(e) => setZoneScope(e.target.value as (typeof ZONES)[number])}>
            {ZONES.map((z) => <option key={z}>{z}</option>)}
          </select>
          <input className="filter-input" placeholder="Search asset category..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <label className="toggle-row">
            <input type="checkbox" checked={showOnlyNotScanned} onChange={(e) => setShowOnlyNotScanned(e.target.checked)} />
            Show only not scanned
          </label>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Collection Summary By Asset Category</h3>
          {/* <p className="subtle">Interactive cards: click any asset to update timeline and map highlights</p> */}
        </div>
        <div className="asset-grid">
          {visibleAssets.map((asset) => {
            const isActive = selectedAsset === asset.id;
            return (
              <button key={asset.id} className={isActive ? "asset-card active" : "asset-card"} onClick={() => setSelectedAsset(asset.id)}>
                <div className="asset-top">
                  <div className="asset-svg-wrap" style={{ borderColor: asset.color }}>
                    <AssetSvg asset={asset.name} color={asset.color} />
                  </div>
                  <span className="asset-count">{asset.total}</span>
                </div>
                <h4>{asset.name}</h4>
                <div className="linear-progress">
                  <div style={{ width: `${asset.compliance}%`, background: asset.color }} />
                </div>
                <div className="asset-meta">
                  <small>Scanned: {asset.scanned}</small>
                  <small>Not scanned: {asset.notScanned}</small>
                  <small>Compliance: {asset.compliance}%</small>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <WasteCollectionRFIDMonitoring data={wasteCollectionRfidData} initialZone="Royapuram-5" />

      <div className="card">
        <div className="card-head">
          <h3>Metal Bin Collection Summary on Map</h3>
          <span className="badge-soft">Total Count: {totalCount.toLocaleString()}</span>
        </div>
        <MapContainer center={[13.0827, 80.2707]} zoom={13} style={{ height: 320, borderRadius: 12 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {[
            { lat: 13.112, lng: 80.292, asset: "Bins", intensity: 0.9 },
            { lat: 13.115, lng: 80.287, asset: "Bins", intensity: 0.8 },
            { lat: 13.118, lng: 80.295, asset: "bov", intensity: 0.7 },
            { lat: 13.120, lng: 80.299, asset: "compactor", intensity: 0.6 },
            { lat: 13.108, lng: 80.283, asset: "tipper", intensity: 0.5 },
          ].map((m, idx) => (
            <CircleMarker key={`${m.asset}-${idx}`} center={[m.lat, m.lng]} radius={6 + m.intensity * 5}
              pathOptions={{ color: collectionAssets.find((a) => a.id === m.asset)?.color ?? "#2563eb", fillOpacity: 0.35 }}>
              <Popup>
                {collectionAssets.find((a) => a.id === m.asset)?.name} hotspot<br />
                Intensity: {Math.round(m.intensity * 100)}%
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}
