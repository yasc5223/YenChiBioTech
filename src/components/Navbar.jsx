import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import DropdownHoverMenu from './DropdownHoverMenu';
import './Navbar.css';

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [productionLinks, setProductionLinks] = useState([]);
  const [serviceLinks, setServiceLinks] = useState([]);
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
    // 處理 Production (產品) 資料
    const processProductionData = (data) => {
      return Object.entries(data).map(([mainCategory, items]) => {
        // 特別處理蠟塊與切片 (沒有型號結構)
        if (mainCategory === "蠟塊與切片") {
          return {
            label: mainCategory,
            to: "/production/wax-blocks"
          };
        }

        const submenu = Object.entries(items).map(([subCategory, models]) => {
          // 檢查是否有 list 屬性 (舊結構兼容)
          if (subCategory === "list") {
            return models.map(model => ({
              label: model,
              to: `/production/${encodeURIComponent(mainCategory)}/${encodeURIComponent(model)}`
            }));
          }

          // 處理新結構的型號數據
          const modelItems = Object.entries(models).map(([model, details]) => {
            return {
              label: model,
              to: `/production/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}/${encodeURIComponent(model)}`,
              info: details.Information
            };
          }).flat(); // 展平因分號拆分產生的陣列

          return {
            label: subCategory,
            to: `/production/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}`,
            submenu: modelItems
          };
        }).flat(); // 展平因 list 兼容處理產生的陣列

        return {
          label: mainCategory,
          to: `/production/${encodeURIComponent(mainCategory)}`,
          submenu: submenu
        };
      });
    };

    // 處理 Services (實驗委託) 資料
    const processServiceData = () => ([
      {
        label: "病理組織代工",
        to: "/services/pathology",
        submenu: [
          { label: "組織處理", to: "/services/pathology/tissue-processing" },
          { label: "切片製作", to: "/services/pathology/sectioning" },
          { label: "染色服務", to: "/services/pathology/staining" }
        ]
      },
      {
        label: "細胞實驗",
        to: "/services/cell",
        submenu: [
          { label: "細胞培養", to: "/services/cell/culture" },
          { label: "細胞轉染", to: "/services/cell/transfection" }
        ]
      }
    ]);
    
    // 設定 Services 連結
    setServiceLinks(processServiceData());

    // 實際使用時替換為以下 API 調用
    
    fetch(`${baseUrl}/api/Production`)
      .then(res => res.json())
      .then(data => {
        setProductionLinks(processProductionData(data));
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
            <DropdownHoverMenu 
              label="Production" 
              subLabel="產品"
              links={productionLinks}
            />
            <DropdownHoverMenu 
              label="Services" 
              subLabel="實驗委託"
              links={serviceLinks}
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