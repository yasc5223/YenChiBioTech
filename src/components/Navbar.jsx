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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);

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
      const toPath = `/products/${currentPath
        .map(encodeURIComponent)
        .join("/")}`;

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
    const updated = [
      item,
      ...recentSearches.filter((i) => i.path !== item.path),
    ].slice(0, 5);
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
            Icon: items.Icon,
          };
        }

        const submenu = Object.entries(items)
          .filter(([k]) => k !== "Image" && k !== "Icon")
          .map(([subCategory, models]) => {
            const isSubLink = models.url && models.url.trim();
            if (isSubLink) {
              return {
                label: subCategory,
                to: models.url,
                Icon: models.Icon,
              };
            }

            const modelItems = Object.entries(models)
              .filter(([model]) => model !== "Image" && model !== "Icon")
              .map(([model, details]) => {
                const isModelLink = details?.url && details.url.trim();
                return {
                  label: model,
                  to:
                    isModelLink ||
                    `/products/${encodeURIComponent(
                      mainCategory
                    )}/${encodeURIComponent(subCategory)}/${encodeURIComponent(
                      model
                    )}`,
                  info: details?.Information,
                  Icon: details?.Icon,
                };
              });
            return {
              label: subCategory,
              to: `/products/${encodeURIComponent(
                mainCategory
              )}/${encodeURIComponent(subCategory)}`,
              submenu: modelItems,
              Icon: models.Icon,
            };
          });

        return {
          label: mainCategory,
          to: `/products/${encodeURIComponent(mainCategory)}`,
          submenu: submenu,
          Icon: items.Icon,
        };
      });

    const processServicesData = (data) =>
      Object.entries(data).map(([mainCategory, items]) => {
        const isMainLink = items.url && items.url.trim();
        if (isMainLink)
          return { label: mainCategory, to: items.url, Icon: items.Icon };
        const submenu = Object.entries(items)
          .filter(([k]) => k !== "Image" && k !== "Icon")
          .map(([subCategory, models]) => {
            const modelItems = Object.entries(models)
              .filter(([model]) => model !== "Image" && model !== "Icon")
              .map(([model, details]) => ({
                label: model,
                to: `/services/${encodeURIComponent(
                  mainCategory
                )}/${encodeURIComponent(subCategory)}/${encodeURIComponent(
                  model
                )}`,
                info: details.Information,
                Icon: details.Icon,
              }));
            return {
              label: subCategory,
              to: `/services/${encodeURIComponent(
                mainCategory
              )}/${encodeURIComponent(subCategory)}`,
              submenu: modelItems,
              Icon: models.Icon,
            };
          });
        return {
          label: mainCategory,
          to: `/services/${encodeURIComponent(mainCategory)}`,
          submenu: submenu,
          Icon: items.Icon,
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
      {isMobile ? (
        <div className="border-bottom sticky-top nav-secondary">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <Link className="navbar-brand brand-link" to="/">
                <img
                  src={baseUrl + "/images/logo.png"}
                  alt="Logo"
                  className="nvabar-icon-image-mobile"
                  onClick={() => setMenuOpen(false)}
                />
              </Link>
              <div className="CompanyName me-3 fw-normal">研質生技有限公司</div>
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation"
              >
                ☰
              </button>
            </div>

            {menuOpen && (
              <>
                {/* ✅ Footer 區塊：搜尋 + 購物車 */}
                <div className="mobile-nav-footer mt-2 pt-3 border-top px-2 pb-3">
                  <div className="d-flex justify-content-center align-items-center  mb-2">
                    <FaSearch style={{ color: "black", marginRight: "8px" }} />
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="搜尋產品型號..."
                      value={searchText}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() =>
                        setTimeout(() => setSearchFocused(false), 150)
                      }
                      style={{ maxWidth: "180px", fontSize: "16px" }}
                    />
                    <Link
                      to="/inquiry"
                      className="text-dark position-relative ms-3"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiShoppingCart size={24} />
                      {inquiryCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-smaller">
                          {inquiryCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* 搜尋結果顯示區域 */}
                  {searchText && searchResults.length > 0 && (
                    <ul className="search-dropdown">
                      {searchResults.map((result, i) => (
                        <li
                          key={i}
                          className="search-dropdown-item"
                          onClick={() =>
                            handleResultClick(result.path, result.label)
                          }
                        >
                          {result.label}
                          <span className="search-dropdown-path">
                            {decodeURIComponent(
                              result.path
                                .replace(/^\/products\//, "")
                                .replace(/\//g, " / ")
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

                  {searchFocused &&
                    searchText === "" &&
                    recentSearches.length > 0 && (
                      <ul className="search-dropdown">
                        <li className="search-dropdown-item d-flex justify-content-between align-items-center text-muted">
                          <span>最近搜尋</span>
                          <button
                            className="btn btn-sm btn-link text-danger p-0 m-0 ms-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearRecentSearches();
                            }}
                          >
                            清除
                          </button>
                        </li>
                        {recentSearches.map((item, i) => (
                          <li
                            key={i}
                            className="search-dropdown-item"
                            onClick={() =>
                              handleResultClick(item.path, item.label)
                            }
                          >
                            {item.label}
                            <span className="search-dropdown-path">
                              {decodeURIComponent(
                                item.path
                                  .replace(/^\/products\//, "")
                                  .replace(/\//g, " / ")
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
                <ul className="nav flex-column py-2">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/about"
                      onClick={() => setMenuOpen(false)}
                    >
                      關於我們
                    </Link>
                  </li>
                  <DropdownHoverMenu
                    label="產品介紹"
                    links={productionLinks}
                    onItemClick={() => setMenuOpen(false)}
                  />
                  <DropdownHoverMenu
                    label="實驗委託"
                    links={serviceLinks}
                    onItemClick={() => setMenuOpen(false)}
                  />
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/contact"
                      onClick={() => setMenuOpen(false)}
                    >
                      聯絡我們
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="border-bottom sticky-top nav-secondary">
          <div className="container">
            <div className="container d-flex justify-content-between align-items-center">
              <Link className="navbar-brand brand-link" to="/">
                <img
                  src={baseUrl + "/images/logo.png"}
                  alt=""
                  className="nvabar-icon-image"
                />
              </Link>
              <div className="d-flex align-items-center ms-auto gap-3">
                <ul className="nav py-2">
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      關於我們
                    </Link>
                  </li>
                  <DropdownHoverMenu label="產品介紹" links={productionLinks} />
                  <DropdownHoverMenu label="實驗委託" links={serviceLinks} />
                  <li className="nav-item">
                    <Link className="nav-link" to="/contact">
                      聯絡我們
                    </Link>
                  </li>
                </ul>
                <div className="d-flex align-items-center search-container">
                  <FaSearch style={{ color: "black", marginRight: "8px" }} />
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="搜尋產品型號..."
                    value={searchText}
                    style={{
                      width: "200px",
                      fontSize: 20,
                    }} /* 搜尋框寬度控制在200px */
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setSearchFocused(false), 150)
                    }
                  />
                  {searchText && searchResults.length > 0 && (
                    <ul className="search-dropdown">
                      {searchResults.map((result, i) => (
                        <li
                          key={i}
                          className="search-dropdown-item"
                          onClick={() =>
                            handleResultClick(result.path, result.label)
                          }
                        >
                          {result.label}
                          <span className="search-dropdown-path">
                            {decodeURIComponent(
                              result.path
                                .replace(/^\/products\//, "")
                                .replace(/\//g, " / ")
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
                  {searchFocused &&
                    searchText === "" &&
                    recentSearches.length > 0 && (
                      <ul className="search-dropdown">
                        <li className="search-dropdown-item d-flex justify-content-between align-items-center text-muted">
                          <span>最近搜尋</span>
                          <button
                            className="btn btn-sm btn-link text-danger p-0 m-0 ms-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearRecentSearches();
                            }}
                          >
                            清除
                          </button>
                        </li>
                        {recentSearches.map((item, i) => (
                          <li
                            key={i}
                            className="search-dropdown-item"
                            onClick={() =>
                              handleResultClick(item.path, item.label)
                            }
                          >
                            {item.label}
                            <span className="search-dropdown-path">
                              {decodeURIComponent(
                                item.path
                                  .replace(/^\/products\//, "")
                                  .replace(/\//g, " / ")
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  <Link
                    to="/inquiry"
                    className="text-dark position-relative ms-3"
                  >
                    <FiShoppingCart size={30} />
                    {inquiryCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-smaller">
                        {inquiryCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
