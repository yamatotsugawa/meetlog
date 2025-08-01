export function getInitials(name: string) {
  const s = name.trim().replace(/\s+/g, "");
  return s.slice(0, 2);
}
export function fmtDate(d: Date) {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
    }).format(d);
  } catch {
    return d.toISOString().slice(5, 16).replace("T", " ");
  }
}
