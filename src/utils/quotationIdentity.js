import {
  findByRelationshipOptionValue,
  hasRelationshipId,
  relationshipOptionValue,
} from "./relationships";

const NUMBER_PREFIX = "quotation-number:";

export function getQuotationRouteToken(quotation = {}) {
  if (hasRelationshipId(quotation.id)) {
    return encodeURIComponent(relationshipOptionValue(quotation.id));
  }
  return encodeURIComponent(`${NUMBER_PREFIX}${quotation.quotationNumber || ""}`);
}

export function resolveQuotationRoute(quotations = [], routeId = "") {
  const typedMatch = findByRelationshipOptionValue(quotations, routeId);
  if (typedMatch) return typedMatch;

  if (routeId.startsWith(NUMBER_PREFIX)) {
    const quotationNumber = routeId.slice(NUMBER_PREFIX.length);
    const numberMatches = quotations.filter(
      (quotation) => quotationNumber && quotation.quotationNumber === quotationNumber
    );
    return numberMatches.length === 1 ? numberMatches[0] : null;
  }

  const legacyMatches = quotations.filter(
    (quotation) => hasRelationshipId(quotation.id) && String(quotation.id) === String(routeId)
  );
  return legacyMatches.length === 1 ? legacyMatches[0] : null;
}
