import type { WasteCollectionRfidRow } from "./WasteCollectionRFIDMonitoring";

export const wasteCollectionRfidData: WasteCollectionRfidRow[] = [
  { id: 1, zone: "Royapuram-5", tagId: "RFID-001", lastSeen: "2026-03-09 16:12", status: "scanned" },
  { id: 2, zone: "Royapuram-5", tagId: "RFID-002", lastSeen: "2026-03-09 15:58", status: "scanned" },
  { id: 3, zone: "Thiru Vi Ka Nagar-6", tagId: "RFID-026", lastSeen: "2026-03-09 15:30", status: "not-scanned" },
  { id: 4, zone: "Beach", tagId: "RFID-045", lastSeen: "2026-03-09 14:37", status: "scanned" },
  { id: 5, zone: "Beach", tagId: "RFID-046", lastSeen: "2026-03-09 13:43", status: "scanned" }
];
