import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './DropdownHoverMenu.css';
import { FiChevronRight } from 'react-icons/fi';

function DropdownHoverMenu({ label, links, to, onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [submenuPosition, setSubmenuPosition] = useState({});
  const itemRefs = useRef([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasSubmenu = (link) => link.submenu && link.submenu.length > 0;

  const toggleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
      setSubmenuPosition({});
    } else {
      const item = itemRefs.current[index];
      if (item) {
        const rect = item.getBoundingClientRect();
        setSubmenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
      setOpenIndex(index);
    }
  };

  const closeAll = () => {
    setIsOpen(false);
    setOpenIndex(null);
    setSubmenuPosition({});
  };

  if (isMobile) {
    return (
      <li className="nav-item mobile-dropdown">
        <div className="nav-link dropdown-toggle text-center" onClick={() => setIsOpen(!isOpen)}>
          {label}
        </div>

        {isOpen && (
          <ul className="dropdown-menu show">
            {links.map((link, index) => {
              const isExternal = link.to?.startsWith('http');
              const hasSub = hasSubmenu(link);
              const isSubOpen = openIndex === index;

              return (
                <li key={index} className="mobile-dropdown-subitem">
                  <div
                    ref={(el) => (itemRefs.current[index] = el)}
                    className="dropdown-item dropdown-item-content"
                    onClick={() => hasSub ? toggleSubmenu(index) : null}
                  >
                    {isExternal ? (
                      <a
                        href={link.to}
                        className="dropdown-link-item"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.Icon && <img src={link.Icon} alt="" className="icon-image" />}
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="dropdown-link-item"
                        onClick={() => {
                          closeAll();
                          onItemClick?.();
                        }}
                      >
                        {link.Icon && <img src={link.Icon} alt="" className="icon-image" />}
                        {link.label}
                      </Link>
                    )}
                    {hasSub && <FiChevronRight className="arrow-icon" />}
                  </div>

                  {hasSub && isSubOpen && (
                    <ul
                      className="dropdown-submenu-menu"
                      style={{
                        position: 'absolute',
                        top: submenuPosition.top,
                        left: submenuPosition.left,
                        zIndex: 9999,
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      {link.submenu.map((subLink, subIdx) => {
                        const isSubExternal = subLink.to?.startsWith('http');
                        return isSubExternal ? (
                          <li key={subIdx} className="dropdown-item">
                            <a
                              href={subLink.to}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {subLink.Icon && <img src={subLink.Icon} alt="" className="icon-image" />}
                              {subLink.label}
                            </a>
                          </li>
                        ) : (
                          <li key={subIdx} className="dropdown-item">
                            <Link
                              to={subLink.to}
                              onClick={() => {
                                closeAll();
                                onItemClick?.();
                              }}
                            >
                              {subLink.Icon && <img src={subLink.Icon} alt="" className="icon-image" />}
                              {subLink.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  // 桌面版
  return (
    <li className="nav-item dropdown">
      <div
        className="dropdown-wrapper"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Link to={to} className="nav-link dropdown-toggle" role="button">
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
                  <div className="dropdown-item dropdown-item-content">
                    {isExternal ? (
                      <a
                        href={link.to}
                        className="dropdown-link-item"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.Icon && <img src={link.Icon} alt="" className="icon-image" />}
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="dropdown-link-item"
                        onClick={onItemClick}
                      >
                        {link.Icon && <img src={link.Icon} alt="" className="icon-image" />}
                        {link.label}
                      </Link>
                    )}
                    {hasSub && <FiChevronRight className="arrow-icon" />}
                  </div>

                  {hasSub && (
                    <div className="dropdown-menu">
                      {link.submenu.map((subLink, subIndex) => {
                        const isSubExternal = subLink.to?.startsWith('http');
                        return isSubExternal ? (
                          <a
                            key={subIndex}
                            className="dropdown-item"
                            href={subLink.to}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {subLink.Icon && <img src={subLink.Icon} alt="" className="icon-image" />}
                            {subLink.label}
                          </a>
                        ) : (
                          <Link
                            key={subIndex}
                            className="dropdown-item"
                            to={subLink.to}
                            onClick={onItemClick}
                          >
                            {subLink.Icon && <img src={subLink.Icon} alt="" className="icon-image" />}
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
      </div>
    </li>
  );
}

export default DropdownHoverMenu;
