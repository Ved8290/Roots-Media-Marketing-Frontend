function getPages(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  return sorted.reduce((acc, p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) acc.push('gap');
    acc.push(p);
    return acc;
  }, []);
}

export default function Pagination({ pagination, noun = 'items', onPageChange }) {
  const { page, limit, total, totalPages } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="pagination-bar">
      <span className="muted">
        Showing {from}-{to} of {total} {noun}
      </span>
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
            &lsaquo;
          </button>
          {getPages(page, totalPages).map((item, index) =>
            item === 'gap' ? (
              <span key={`gap-${index}`} className="pagination__gap">&hellip;</span>
            ) : (
              <button
                type="button"
                key={item}
                className={item === page ? 'is-active' : ''}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            )
          )}
          <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
            &rsaquo;
          </button>
        </nav>
      )}
    </div>
  );
}
