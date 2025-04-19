import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DropdownHoverMenu({ label, links }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const menuRef = useRef();

  // 延遲關閉
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <li
      className={`nav-item dropdown ${open ? 'show' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      <span
        className="nav-link dropdown-toggle"
        role="button"
        style={{ cursor: 'pointer' }}
      >
        {label}
      </span>
      <ul className={`dropdown-menu ${open ? 'show' : ''}`}>
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link className="dropdown-item" to={to}>{label}</Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default DropdownHoverMenu;
