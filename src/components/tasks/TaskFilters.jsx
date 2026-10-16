import { useEffect, useState } from 'react';
import { DEPARTMENTS, TASK_PRIORITIES, TASK_STATUSES, TASK_SORT_OPTIONS } from '../../utils/constants';
import { splitSortValue } from '../../utils/format';

export default function TaskFilters({ filters, onChange, onClear }) {
  const [search, setSearch] = useState(filters.search || '');

  // Keep the box in sync when the URL changes (back button, clear, pasted link)
  useEffect(() => setSearch(filters.search || ''), [filters.search]);

  const submitSearch = (event) => {
    event.preventDefault();
    onChange({ search: search.trim() });
  };

  const sortValue = `${filters.sortBy || 'createdAt'}:${filters.order || 'desc'}`;
  const hasFilters = Object.keys(filters).some((key) => key !== 'page');

  return (
    <div className="filters">
      <form className="filters__search" onSubmit={submitSearch}>
        <input type="search" placeholder="Search title or employee" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search title or employee" />
        <button type="submit" className="btn btn--secondary">Search</button>
      </form>

      <div className="filters__row">
        <select value={filters.department || ''} onChange={(e) => onChange({ department: e.target.value })} aria-label="Department">
          <option value="">Department</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={filters.priority || ''} onChange={(e) => onChange({ priority: e.target.value })} aria-label="Priority">
          <option value="">Priority</option>
          {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={filters.status || ''} onChange={(e) => onChange({ status: e.target.value })} aria-label="Status">
          <option value="">Status</option>
          {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label className="date-filter">
          <span>Due from</span>
          <input type="date" value={filters.dueFrom || ''} max={filters.dueTo || undefined} onChange={(e) => onChange({ dueFrom: e.target.value })} />
        </label>
        <label className="date-filter">
          <span>Due to</span>
          <input type="date" value={filters.dueTo || ''} min={filters.dueFrom || undefined} onChange={(e) => onChange({ dueTo: e.target.value })} />
        </label>
        <select value={sortValue} onChange={(e) => onChange(splitSortValue(e.target.value))} aria-label="Sort by">
          {TASK_SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <label className="checkbox">
          <input type="checkbox" checked={filters.overdue === 'true'} onChange={(e) => onChange({ overdue: e.target.checked ? 'true' : '' })} />
          Overdue only
        </label>
        {hasFilters && (
          <button type="button" className="btn btn--link" onClick={onClear}>Clear all</button>
        )}
      </div>
    </div>
  );
}
