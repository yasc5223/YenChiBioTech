import React from 'react';
import { Link } from 'react-router-dom';
import './DropdownHoverMenu.css';

function DropdownHoverMenu({ label, links }) {
  return (
    <li className="nav-item dropdown">
      <span className="nav-link dropdown-toggle" role="button">
        {label}
      </span>
      <ul className="dropdown-menu">
        {links.map((link) => (
          <li key={link.to}>
            <Link className="dropdown-item" to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default DropdownHoverMenu;