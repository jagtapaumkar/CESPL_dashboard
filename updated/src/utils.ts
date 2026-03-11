import type { Row } from "./types";

export function exportCsv(data: Row[]) {
  const keys = Object.keys(data[0] ?? {});
  const csv = [keys.join(","), ...data.map((r) => keys.map((k) => String(r[k])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "dashboard-export.csv";
  a.click();
}

export function parseOpsDateTime(value: string) {
  if (!value) return null;
  const [datePart = "", timePart = ""] = value.split(" ");
  const [d = "", m = "", y = ""] = datePart.split("-");
  if (!d || !m || !y) return null;
  const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T${timePart || "00:00:00"}`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function nowStamp() {
  const now = new Date();
  const two = (v: number) => String(v).padStart(2, "0");
  return `${two(now.getDate())}-${two(now.getMonth() + 1)}-${now.getFullYear()} ${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}`;
}
