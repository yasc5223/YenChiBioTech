import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import DropdownHoverMenu from './DropdownHoverMenu';
import '../App.css';

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [productLinks, setProductLinks] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const searchRef = useRef(null);

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  // 點外部自動關閉搜尋欄
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 取得產品分類資料（扁平處理）
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
      {/* 第一層：Logo + 搜尋 */}
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

      {/* 第二層：分類列 */}
      <div className="bg-light border-bottom sticky-top" style={{ top: '56px', zIndex: 1020 }}>
        <div className="container">
          <ul className="nav justify-content-center py-2">
            <li className="nav-item">
              <Link className="nav-link" to="/about">關於我們</Link>
            </li>

            {/* 單層產品選單（扁平） */}
            <DropdownHoverMenu
              label="產品"
              links={productLinks}
            />

            {/* 實驗委託固定選單 */}
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