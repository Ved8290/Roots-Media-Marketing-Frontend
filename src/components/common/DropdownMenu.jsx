import { useEffect, useRef, useState } from 'react';

/** Generic popover: `renderTrigger({ open, toggle })` plus children shown while open. */
export default function DropdownMenu({ renderTrigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      if (event.type === 'mousedown' && wrapperRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div className="dropdown" ref={wrapperRef}>
      {renderTrigger({ open, toggle: () => setOpen((value) => !value) })}
      {open && (
        <div className={`dropdown__menu dropdown__menu--${align}`} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}
