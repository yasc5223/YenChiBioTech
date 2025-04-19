import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import DropdownHoverMenu from './DropdownHoverMenu';
import './Navbar.css';

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [productLinks, setProductLinks] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const searchRef = useRef(null);

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/api/production`)
      .then(res => res.json())
      .then(data => {
        const links = [];
        for (const [category, subcategories] of Object.entries(data)) {
          for (const subName of Object.keys(subcategories)) {
            links.push({
              label: subName,
              to: `/products/${encodeURIComponent(subName)}`
            });
          }
        }
        setProductLinks(links);
      })
      .catch(err => console.error('無法載入產品資料：', err));
  }, [baseUrl]);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">YenChiBioTech</Link>
          <div className="search-container" ref={searchRef}>
            <FaSearch
              onClick={toggleSearch}
              style={{ color: 'white', cursor: 'pointer' }}
            />
            <input
              type="text"
              className={`form-control search-input ${searchOpen ? 'open' : ''}`}
              placeholder="搜尋..."
              autoFocus={searchOpen}
            />
          </div>
        </div>
      </nav>

      <div className="bg-light border-bottom sticky-top nav-secondary">
        <div className="container">
          <ul className="nav justify-content-center py-2">
            <li className="nav-item">
              <Link className="nav-link" to="/about">關於我們</Link>
            </li>
            <DropdownHoverMenu label="產品" links={productLinks} />
            <DropdownHoverMenu
              label="實驗委託"
              links={[
                { to: "/services/cell", label: "細胞服務" },
                { to: "/services/ihc", label: "IHC/IF 染色" },
                { to: "/services/slicing", label: "組織切片" },
              ]}
            />
            <li className="nav-item">
              <Link className="nav-link" to="/contact">聯絡我們</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;