import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import DropdownHoverMenu from './DropdownHoverMenu';
import './Navbar.css';

function Navbar() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [productionLinks, setProductionLinks] = useState([]);
  const [serviceLinks, setServiceLinks] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // 將 nested 結構展平成 {label, path, keywords}
  function flattenLinks(links, path = []) {
    let result = [];
    links.forEach(link => {
      if (link.submenu) {
        result = result.concat(flattenLinks(link.submenu, [...path, link.label]));
      } else {
        const infoText = [
          link.label,
          link?.info?.ExternalTitle || '',
          link?.info?.InternalTitle || '',
          link?.info?.Description || ''
        ].join(' ').toLowerCase();

        result.push({
          label: link.label,
          path: `/products/${path.map(encodeURIComponent).join('/')}/${encodeURIComponent(link.label)}`,
          keywords: infoText
        });
      }
    });
    return result;
  }

  useEffect(() => {
    if (!searchText) {
      setSearchResults([]);
      return;
    }
    const allModels = flattenLinks(productionLinks);
    const keyword = searchText.trim().toLowerCase();
    const matched = allModels.filter(m =>
      m.keywords.includes(keyword)
    );
    setSearchResults(matched);
  }, [searchText, productionLinks]);

  const handleSearchChange = (e) => setSearchText(e.target.value);

  const handleResultClick = (path) => {
    setSearchText('');
    setSearchResults([]);
    navigate(path);
  };

  useEffect(() => {
    const processProductionData = (data) => {
      return Object.entries(data).map(([mainCategory, items]) => {
        if (mainCategory === "蠟塊與切片") {
          return {
            label: mainCategory,
            to: "/products/wax-blocks"
          };
        }
        const submenu = Object.entries(items)
          .filter(([subCategory]) => subCategory !== "Image")
          .map(([subCategory, models]) => {
            const modelItems = Object.entries(models)
              .filter(([modelKey]) => modelKey !== "Image")
              .map(([model, details]) => ({
                label: model,
                to: `/products/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}/${encodeURIComponent(model)}`,
                info: details.Information
              }));
            return {
              label: subCategory,
              to: `/products/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}`,
              submenu: modelItems
            };
          });
        return {
          label: mainCategory,
          to: `/products/${encodeURIComponent(mainCategory)}`,
          submenu
        };
      });
    };

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

    setServiceLinks(processServiceData());

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
            <FaSearch style={{ color: 'white', marginRight: '8px' }} />
            <input
              type="text"
              className="form-control search-input"
              placeholder="搜尋產品型號..."
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults[0]) {
                  handleResultClick(searchResults[0].path);
                }
              }}
            />
            {searchText && searchResults.length > 0 && (
              <ul className="search-dropdown">
                {searchResults.map((result, i) => (
                  <li key={i} className="search-dropdown-item" onClick={() => handleResultClick(result.path)}>
                    {result.label}
                    <span className="search-dropdown-path">
                      {decodeURIComponent(
                        result.path.replace(/^\/products\//, '').replace(/\//g, ' / ')
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {searchText && searchResults.length === 0 && (
              <ul className="search-dropdown">
                <li className="search-dropdown-item">查無產品</li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <div className="bg-light border-bottom sticky-top nav-secondary">
        <div className="container">
          <ul className="nav justify-content-center py-2">
            <li className="nav-item">
              <Link className="nav-link" to="/about">關於我們</Link>
            </li>
            <DropdownHoverMenu label="產品" links={productionLinks} />
            <DropdownHoverMenu label="實驗委託" links={serviceLinks} />
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
