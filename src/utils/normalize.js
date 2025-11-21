export function normalizeStatus(status) {
  if (!status) return "PENDENTE";

  return status
    .toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}
