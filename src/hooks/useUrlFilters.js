import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Keeps search, filters, sorting and page number in the URL query string,
 * so refresh / copy-paste of the URL shows exactly the same view.
 */
export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  const updateFilters = useCallback(
    (patch, { resetPage = true } = {}) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        Object.entries(patch).forEach(([key, value]) => {
          if (value === '' || value === null || value === undefined) next.delete(key);
          else next.set(key, String(value));
        });
        if (resetPage && !('page' in patch)) next.delete('page');
        return next;
      });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => setSearchParams({}), [setSearchParams]);

  return { filters, updateFilters, clearFilters };
}
