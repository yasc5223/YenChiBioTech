import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DropdownHoverMenu.css';
import { FiChevronRight } from 'react-icons/fi'; // ➤箭頭 icon

function DropdownHoverMenu({ label, links }) {
  const [isOpen, setIsOpen] = useState(false);

  const hasSubmenu = (link) => link.submenu && link.submenu.length > 0;

  return (
    <li
      className="nav-item dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="nav-link dropdown-toggle" role="button">
        {label}
      </span>

      {isOpen && (
  <div className="dropdown-menu show">
    {links.map((link, index) => {
      const hasSub = link.submenu?.length > 0;
      const isExternal = link.to?.startsWith("http");

      return (
        <div key={index} className={hasSub ? "dropdown-submenu" : ""}>
          {isExternal ? (
            <a
              href={link.to}
              target="_blank"
              rel="noopener noreferrer"
              className="dropdown-item"
            >
              <span className="dropdown-item-content">
                <span>{link.label}</span>
                {hasSub && <FiChevronRight className="arrow-icon" />}
              </span>
            </a>
          ) : (
            <Link className="dropdown-item" to={link.to}>
              <span className="dropdown-item-content">
                <span>{link.label}</span>
                {hasSub && <FiChevronRight className="arrow-icon" />}
              </span>
            </Link>
          )}

          {/* 第二層 submenu */}
          {hasSub && (
            <div className="dropdown-menu">
              {link.submenu.map((subLink, subIndex) => {
                const isExternalSub = subLink.to?.startsWith("http");
                return isExternalSub ? (
                  <a
                    key={subIndex}
                    href={subLink.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dropdown-item"
                  >
                    {subLink.label}
                  </a>
                ) : (
                  <Link key={subIndex} to={subLink.to} className="dropdown-item">
                    {subLink.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    })}
  </div>
)}

    </li>
  );
}

export default DropdownHoverMenu;
