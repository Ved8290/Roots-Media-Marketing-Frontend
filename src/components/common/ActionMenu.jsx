import { Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';

/** The "three dots" menu. items: [{ label, to?, onClick?, tone?, hidden? }] */
export default function ActionMenu({ items }) {
  return (
    <DropdownMenu
      renderTrigger={({ open, toggle }) => (
        <button type="button" className="icon-btn" onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-label="Actions">
          &#8942;
        </button>
      )}
    >
      {items
        .filter((item) => !item.hidden)
        .map((item) =>
          item.to ? (
            <Link key={item.label} to={item.to} className={`dropdown__item dropdown__item--${item.tone || 'default'}`}>
              {item.label}
            </Link>
          ) : (
            <button key={item.label} type="button" className={`dropdown__item dropdown__item--${item.tone || 'default'}`} onClick={item.onClick}>
              {item.label}
            </button>
          )
        )}
    </DropdownMenu>
  );
}
