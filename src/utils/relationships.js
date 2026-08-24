export const hasRelationshipId = (value) =>
  value !== undefined && value !== null && value !== "";

export const relationshipIdsEqual = (left, right) =>
  hasRelationshipId(left)
  && hasRelationshipId(right)
  && Object.is(left, right);

export const relationshipOptionValue = (value) =>
  hasRelationshipId(value) ? JSON.stringify([typeof value, value]) : "";

export function findByRelationshipOptionValue(records = [], optionValue) {
  if (!optionValue) return null;
  return records.find(
    (record) => relationshipOptionValue(record.id) === optionValue
  ) || null;
}

function resolveById(records = [], id) {
  const exactMatch = records.find((record) => relationshipIdsEqual(record.id, id));
  if (exactMatch) return exactMatch;

  // Older selects serialized numeric IDs as strings. Accept that mismatch only
  // when it identifies exactly one entity, never when 0 and "0" both exist.
  const compatibleMatches = records.filter(
    (record) => hasRelationshipId(record.id) && String(record.id) === String(id)
  );
  return compatibleMatches.length === 1 ? compatibleMatches[0] : null;
}

export const isArchivedRecord = (record = {}) =>
  record.archived === true || String(record.status || "").toLowerCase() === "archived";

export function findUniqueByName(records = [], name) {
  const normalizedName = String(name || "").trim().toLowerCase();
  if (!normalizedName) return null;

  const matches = records.filter(
    (record) => String(record.name || "").trim().toLowerCase() === normalizedName
  );

  return matches.length === 1 ? matches[0] : null;
}

export function resolveClient(record = {}, clients = []) {
  if (hasRelationshipId(record.clientId)) {
    return resolveById(clients, record.clientId);
  }

  return findUniqueByName(
    clients,
    record.clientNameSnapshot || record.client
  );
}

export function resolveProject(record = {}, projects = []) {
  if (hasRelationshipId(record.projectId)) {
    return resolveById(projects, record.projectId);
  }

  return findUniqueByName(
    projects,
    record.projectNameSnapshot || record.project
  );
}

export function recordMatchesClient(record = {}, client, clients = []) {
  if (!client) return false;
  if (hasRelationshipId(record.clientId)) {
    const resolvedClient = resolveClient(record, clients);
    return resolvedClient ? relationshipIdsEqual(resolvedClient.id, client.id) : false;
  }

  const resolvedClient = resolveClient(record, clients);
  return resolvedClient ? relationshipIdsEqual(resolvedClient.id, client.id) : false;
}

export function recordMayReferenceClient(record = {}, client, clients = []) {
  if (!client) return false;
  if (hasRelationshipId(record.clientId)) {
    if (relationshipIdsEqual(record.clientId, client.id)) return true;
    const resolvedClient = resolveById(clients, record.clientId);
    return resolvedClient ? relationshipIdsEqual(resolvedClient.id, client.id) : false;
  }

  const snapshot = record.clientNameSnapshot || record.client;
  return Boolean(snapshot) && String(snapshot).trim().toLowerCase()
    === String(client.name || "").trim().toLowerCase();
}

export function recordMayReferenceProject(record = {}, project, projects = []) {
  if (!project) return false;
  if (hasRelationshipId(record.projectId)) {
    if (relationshipIdsEqual(record.projectId, project.id)) return true;
    const resolvedProject = resolveById(projects, record.projectId);
    return resolvedProject ? relationshipIdsEqual(resolvedProject.id, project.id) : false;
  }

  const snapshot = record.projectNameSnapshot || record.project;
  return Boolean(snapshot) && String(snapshot).trim().toLowerCase()
    === String(project.name || "").trim().toLowerCase();
}

export function getClientDisplayName(record = {}, clients = [], { current = false } = {}) {
  const resolved = resolveClient(record, clients);
  if (current && resolved) return resolved.name;
  return record.clientNameSnapshot || record.client || resolved?.name || "";
}

export function getProjectDisplayName(record = {}, projects = [], { current = false } = {}) {
  const resolved = resolveProject(record, projects);
  if (current && resolved) return resolved.name;
  return record.projectNameSnapshot || record.project || resolved?.name || "";
}
