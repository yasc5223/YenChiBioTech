import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DropdownHoverMenu.css';
import { FiChevronRight } from 'react-icons/fi'; // ⬅️ 引入箭頭 icon

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
          {links.map((link, index) => (
            <div key={index} className={hasSubmenu(link) ? 'dropdown-submenu' : ''}>
              {hasSubmenu(link) ? (
                <>
                  <Link className="dropdown-item" to={link.to}>
                    <span className="dropdown-item-content">
                      <span>{link.label}</span>
                      <FiChevronRight className="arrow-icon" />
                    </span>
                  </Link>
                  <div className="dropdown-menu">
                    {link.submenu.map((subLink, subIndex) => (
                      <React.Fragment key={subIndex}>
                        {hasSubmenu(subLink) ? (
                          <div className="dropdown-submenu">
                            <Link className="dropdown-item" to={subLink.to}>
                              <span className="dropdown-item-content">
                                <span>{subLink.label}</span>
                                <FiChevronRight className="arrow-icon" />
                              </span>
                            </Link>
                            <div className="dropdown-menu">
                              {subLink.submenu.map((subSubLink, subSubIndex) => (
                                <Link
                                  key={subSubIndex}
                                  className="dropdown-item"
                                  to={subSubLink.to}
                                >
                                  {subSubLink.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link className="dropdown-item" to={subLink.to}>
                            {subLink.label}
                          </Link>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              ) : (
                <Link className="dropdown-item" to={link.to}>
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </li>
  );
}

export default DropdownHoverMenu;
