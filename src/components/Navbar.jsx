import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import DropdownHoverMenu from "./DropdownHoverMenu";
import "./Navbar.css";

function Navbar() {
  const [searchText, setSearchText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    const stored = localStorage.getItem("recentSearches");
    return stored ? JSON.parse(stored) : [];
  });
  const [inquiryCount, setInquiryCount] = useState(0);
  const [productionLinks, setProductionLinks] = useState([]);
  const [serviceLinks, setServiceLinks] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // 更新購物車數量：支援 localStorage 和 CustomEvent
  useEffect(() => {
    const updateInquiryCount = () => {
      const items = JSON.parse(localStorage.getItem("inquiryCart") || "[]");
      setInquiryCount(items.length);
    };

    updateInquiryCount();

    window.addEventListener("storage", updateInquiryCount);
    window.addEventListener("inquiry-updated", updateInquiryCount); // 🆕 支援跨組件

    return () => {
      window.removeEventListener("storage", updateInquiryCount);
      window.removeEventListener("inquiry-updated", updateInquiryCount);
    };
  }, []);

  function flattenLinks(links, path = []) {
    let result = [];

    links.forEach((link) => {
      const currentPath = [...path, link.label];
      const toPath = `/products/${currentPath.map(encodeURIComponent).join("/")}`;

      if (link.submenu) {
        result.push({
          label: link.label,
          path: toPath,
          keywords: currentPath.join(" ").toLowerCase(),
          isCategory: true,
        });
        result = result.concat(flattenLinks(link.submenu, currentPath));
      } else {
        const infoText = [
          link.label,
          link?.info?.ExternalTitle || "",
          link?.info?.InternalTitle || "",
          link?.info?.Description || "",
        ]
          .join(" ")
          .toLowerCase();

        result.push({
          label: link.label,
          path: toPath,
          keywords: infoText,
          isCategory: false,
        });
      }
    });

    return result;
  }

  const updateRecentSearches = (item) => {
    const updated = [item, ...recentSearches.filter((i) => i.path !== item.path)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleSearchChange = (e) => setSearchText(e.target.value);

  const handleResultClick = (path, label) => {
    updateRecentSearches({ path, label });
    setSearchText("");
    setSearchResults([]);
    navigate(path);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchResults[0]) {
      handleResultClick(searchResults[0].path, searchResults[0].label);
    }
  };

  useEffect(() => {
    if (!searchText) {
      setSearchResults([]);
      return;
    }
    const allItems = flattenLinks(productionLinks);
    const keyword = searchText.trim().toLowerCase();
    const matched = allItems.filter((m) => m.keywords.includes(keyword));
    setSearchResults(matched);
  }, [searchText, productionLinks]);

  useEffect(() => {
    const processProductionData = (data) =>
      Object.entries(data).map(([mainCategory, items]) => {
        const isMainLink = items.url && items.url.trim();
        if (isMainLink) {
          return {
            label: mainCategory,
            to: items.url,
            Icon: items.Icon
          };
        }
    
        const submenu = Object.entries(items)
          .filter(([k]) => k !== "Image")
          .map(([subCategory, models]) => {
            const isSubLink = models.url && models.url.trim();
            if (isSubLink) {
              return {
                label: subCategory,
                to: models.url,
                Icon: models.Icon
              };
            }
    
            const modelItems = Object.entries(models)
              .filter(([model]) => model !== "Image")
              .map(([model, details]) => {
                const isModelLink = details?.url && details.url.trim();
                return {
                  label: model,
                  to:
                    isModelLink ||
                    `/products/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}/${encodeURIComponent(model)}`,
                  info: details?.Information,
                  Icon: details?.Icon
                };
              });
            return {
              label: subCategory,
              to: `/products/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}`,
              submenu: modelItems,
              Icon: models.Icon
            };
          });
        
        return {
          label: mainCategory,
          to: `/products/${encodeURIComponent(mainCategory)}`,
          submenu: submenu,
          Icon: items.Icon
        };
      });
    

    const processServicesData = (data) =>
      Object.entries(data).map(([mainCategory, items]) => {
        const isMainLink = items.url && items.url.trim();
        if (isMainLink) return { label: mainCategory, to: items.url,Icon: items.Icon };
        const submenu = Object.entries(items)
          .filter(([k]) => k !== "Image")
          .map(([subCategory, models]) => {
            const modelItems = Object.entries(models)
              .filter(([model]) => model !== "Image")
              .map(([model, details]) => ({
                label: model,
                to: `/services/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}/${encodeURIComponent(model)}`,
                info: details.Information,
                Icon: details.Icon
              }));
            return {
              label: subCategory,
              to: `/services/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}`,
              submenu: modelItems,
              Icon: models.Icon
            };
          });
        return {
          label: mainCategory,
          to: `/services/${encodeURIComponent(mainCategory)}`,
          submenu: submenu,
          Icon: items.Icon
        };
      });

    fetch(`${baseUrl}/api/Production`)
      .then((res) => res.json())
      .then((data) => setProductionLinks(processProductionData(data)))
      .catch((err) => console.error("❌ 無法載入產品資料:", err));

    fetch(`${baseUrl}/api/services`)
      .then((res) => res.json())
      .then((data) => setServiceLinks(processServicesData(data)))
      .catch((err) => console.error("❌ 無法載入服務資料:", err));
  }, [baseUrl]);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">YenChiBioTech</Link>

          <div className="d-flex align-items-center search-container">
            <FaSearch style={{ color: "white", marginRight: "8px" }} />
            <input
              type="text"
              className="form-control search-input"
              placeholder="搜尋產品型號..."
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            />
            {searchText && searchResults.length > 0 && (
              <ul className="search-dropdown">
                {searchResults.map((result, i) => (
                  <li key={i} className="search-dropdown-item" onClick={() => handleResultClick(result.path, result.label)}>
                    {result.label}
                    <span className="search-dropdown-path">
                      {decodeURIComponent(result.path.replace(/^\/products\//, "").replace(/\//g, " / "))}
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
            {searchFocused && searchText === "" && recentSearches.length > 0 && (
              <ul className="search-dropdown">
                <li className="search-dropdown-item d-flex justify-content-between align-items-center text-muted">
                  <span>最近搜尋</span>
                  <button className="btn btn-sm btn-link text-danger p-0 m-0 ms-auto" onClick={(e) => {
                    e.stopPropagation();
                    clearRecentSearches();
                  }}>清除</button>
                </li>
                {recentSearches.map((item, i) => (
                  <li key={i} className="search-dropdown-item" onClick={() => handleResultClick(item.path, item.label)}>
                    {item.label}
                    <span className="search-dropdown-path">
                      {decodeURIComponent(item.path.replace(/^\/products\//, "").replace(/\//g, " / "))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/inquiry" className="text-white position-relative ms-3">
              <FiShoppingCart size={20} />
              {inquiryCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {inquiryCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <div className="bg-light border-bottom sticky-top nav-secondary">
        <div className="container">
          <ul className="nav justify-content-center py-2">
            <li className="nav-item"><Link className="nav-link" to="/about">關於我們</Link></li>
            <DropdownHoverMenu label="產品" links={productionLinks} />
            <DropdownHoverMenu label="實驗委託" links={serviceLinks} />
            <li className="nav-item"><Link className="nav-link" to="/contact">聯絡我們</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
