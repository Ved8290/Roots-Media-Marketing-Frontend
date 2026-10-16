import { useEffect, useState } from 'react';
import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYEE_SORT_OPTIONS } from '../../utils/constants';
import { splitSortValue } from '../../utils/format';

export default function EmployeeFilters({ filters, onChange, onClear }) {
  const [search, setSearch] = useState(filters.search || '');
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
        <input type="search" placeholder="Search name, email or employee ID" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search employees" />
        <button type="submit" className="btn btn--secondary">Search</button>
      </form>
      <div className="filters__row">
        <select value={filters.department || ''} onChange={(e) => onChange({ department: e.target.value })} aria-label="Department">
          <option value="">Department</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={filters.status || ''} onChange={(e) => onChange({ status: e.target.value })} aria-label="Status">
          <option value="">Status</option>
          {EMPLOYEE_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={sortValue} onChange={(e) => onChange(splitSortValue(e.target.value))} aria-label="Sort by">
          {EMPLOYEE_SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {hasFilters && <button type="button" className="btn btn--link" onClick={onClear}>Clear all</button>}
      </div>
    </div>
  );
}
