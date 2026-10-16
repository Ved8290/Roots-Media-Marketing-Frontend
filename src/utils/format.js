const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };

/** "2026-10-05" -> "05 Oct 2026" (parsed by hand so time zones can't shift the day) */
export function formatDate(dateOnly) {
  if (!dateOnly) return '-';
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', dateOptions);
}

/** ISO timestamp -> "05 Oct 2026" */
export function formatTimestamp(isoString) {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleDateString('en-GB', dateOptions);
}

export function splitSortValue(value = 'createdAt:desc') {
  const [sortBy, order] = value.split(':');
  return { sortBy, order };
}
