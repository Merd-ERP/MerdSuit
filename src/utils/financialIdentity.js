import {
  findByRelationshipOptionValue,
  hasRelationshipId,
  relationshipIdsEqual,
  relationshipOptionValue,
} from "./relationships";

export { hasRelationshipId, relationshipIdsEqual };

export function createFinancialId(prefix = "record") {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getFinancialRouteToken(record = {}) {
  return hasRelationshipId(record.id)
    ? encodeURIComponent(relationshipOptionValue(record.id))
    : "";
}

export function resolveFinancialRoute(records = [], routeToken = "") {
  if (!routeToken) return null;

  const typedMatch = findByRelationshipOptionValue(records, routeToken);
  if (typedMatch) return typedMatch;

  // Preserve old raw-ID links only when they identify exactly one record.
  const legacyMatches = records.filter(
    (record) => hasRelationshipId(record.id) && String(record.id) === routeToken
  );
  return legacyMatches.length === 1 ? legacyMatches[0] : null;
}
