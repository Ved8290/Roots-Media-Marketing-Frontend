import { NEXT_STATUSES } from '../../utils/constants';
import DropdownMenu from '../common/DropdownMenu';
import { StatusBadge } from '../common/Badge';

/** Shows the current status; the menu lists ONLY the valid next statuses. */
export default function StatusDropdown({ status, disabled, onChange }) {
  const nextStatuses = NEXT_STATUSES[status] || [];

  if (nextStatuses.length === 0) return <StatusBadge status={status} />;

  return (
    <DropdownMenu
      align="left"
      renderTrigger={({ open, toggle }) => (
        <StatusBadge as="button" type="button" status={status} caret onClick={toggle} disabled={disabled} aria-haspopup="menu" aria-expanded={open} />
      )}
    >
      {nextStatuses.map((next) => (
        <button key={next} type="button" className="dropdown__item" onClick={() => onChange(next)}>
          {next}
        </button>
      ))}
    </DropdownMenu>
  );
}
