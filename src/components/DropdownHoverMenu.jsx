import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DropdownHoverMenu.css';
import { FiChevronRight } from 'react-icons/fi';

function DropdownHoverMenu({ label, links, to }) {
  const [isOpen, setIsOpen] = useState(false);

  const hasSubmenu = (link) => link.submenu && link.submenu.length > 0;

  return (
    <li className="nav-item dropdown">
      <div
        className="dropdown-wrapper"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        style={{ position: 'relative' }}
      >
        <Link
          to={to}
          className="nav-link dropdown-toggle"
          role="button"
        >
          {links.Icon && <img src={links.Icon} alt="" className="icon-image" />}
          {label}
        </Link>

        {isOpen && (
          <div className="dropdown-menu show">
            {links.map((link, index) => {
              const isExternal = link.to?.startsWith('http');
              const hasSub = hasSubmenu(link);

              return (
                <div key={index} className={hasSub ? 'dropdown-submenu' : ''}>
                  {hasSub ? (
                    <><div className="dropdown-item dropdown-item-content">
                    {link.to?.startsWith('http') ? (
                      <a
                        href={link.to}
                        className="dropdown-link-item"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.Icon && (
                          <img src={link.Icon} alt="" className="icon-image" />
                        )}
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="dropdown-link-item"
                      >
                        {link.Icon && (
                          <img src={link.Icon} alt="" className="icon-image" />
                        )}
                        {link.label}
                      </Link>
                    )}
                    <FiChevronRight className="arrow-icon" />
                  </div>
                  
                      <div className="dropdown-menu">
                        {link.submenu
                          .filter((subLink) => subLink.label !== 'Icon')
                          .map((subLink, subIndex) => {
                            const isSubExternal = subLink.to?.startsWith('http');
                            return isSubExternal ? (
                              <a
                                key={subIndex}
                                className="dropdown-item"
                                href={subLink.to}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {subLink.Icon && (
                                  <img src={subLink.Icon} alt="" className="icon-image" />
                                )}
                                {subLink.label}
                              </a>
                            ) : (
                              <Link
                                key={subIndex}
                                className="dropdown-item"
                                to={subLink.to}
                              >
                                {subLink.Icon && (
                                  <img src={subLink.Icon} alt="" className="icon-image" />
                                )}
                                {subLink.label}
                              </Link>
                            );
                          })}
                      </div>
                    </>
                  ) : isExternal ? (
                    <a
                      className="dropdown-item"
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.Icon && (
                        <img src={link.Icon} alt="" className="icon-image" />
                      )}
                      {link.label}
                    </a>
                  ) : (
                    <Link className="dropdown-item" to={link.to}>
                      {link.Icon && (
                        <img src={link.Icon} alt="" className="icon-image" />
                      )}
                      {link.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </li>
  );
}

export default DropdownHoverMenu;
