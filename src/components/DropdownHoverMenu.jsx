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
      {links.Icon && <img src={links.Icon} alt="" className="icon-image" />}{label}
      </span>

      {isOpen && (
        <div className="dropdown-menu show">
          {links.map((link, index) => {
            const isExternal = link.to?.startsWith('http');
            const hasSub = hasSubmenu(link);

            return (
              <div key={index} className={hasSub ? 'dropdown-submenu' : ''}>
                {hasSub ? (
                  <>
                    <span className="dropdown-item dropdown-item-content">
                      <span>{link.Icon && <img src={link.Icon} alt="" className="icon-image" />}{link.label}</span>
                      <FiChevronRight className="arrow-icon" />
                    </span>
                    <div className="dropdown-menu">
                      {link.submenu.filter((link) => link.label != "Icon").map((subLink, subIndex) => {
                        const isSubExternal = subLink.to?.startsWith('http');
                        return isSubExternal ? (
                          <a
                            key={subIndex}
                            className="dropdown-item"
                            href={subLink.to}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {subLink.Icon && <img src={subLink.Icon} alt="" className="icon-image" />}{subLink.label}
                          </a>
                        ) : (
                          <Link
                            key={subIndex}
                            className="dropdown-item"
                            to={subLink.to}
                          >
                            {subLink.Icon && <img src={subLink.Icon} alt="" className="icon-image" />}{subLink.label}
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
                    {link.Icon && <img src={link.Icon} alt="" className="icon-image" />}{link.label}
                  </a>
                ) : (
                  <Link className="dropdown-item" to={link.to}>
                    {link.Icon && <img src={link.Icon} alt="" className="icon-image" />}{link.label}
                  </Link>
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
