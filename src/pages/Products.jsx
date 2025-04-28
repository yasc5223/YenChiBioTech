import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import "./Products.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const fallbackImage = `${baseUrl}/images/spinner.svg`;

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname
    .replace("/products", "")
    .split("/")
    .filter(Boolean)
    .map(decodeURIComponent);

  const [level1, level2, level3] = pathParts;
  const [loading, setLoading] = useState(true);
  const [apiImages, setApiImages] = useState([]);
  const [productData, setProductData] = useState({});
  const [modelImages, setModelImages] = useState({});

  useEffect(() => {
    fetch(`${baseUrl}/api/production`)
      .then((res) => res.json())
      .then((data) => {
        setProductData(data);
      })
      .catch((err) => {
        console.error("⚠️ 無法載入產品分類:", err);
      });
  }, []);

  const isValidPath = () => {
    if (level1 && !productData[level1]) return false;
    if (level2 && !productData[level1]?.[level2]) return false;
    if (level3 && !productData[level1]?.[level2]?.[level3]) return false;
    return true;
  };

  useEffect(() => {
    if (Object.keys(productData).length === 0) return;
    if (!isValidPath()) {
      navigate("/products");
    }
  }, [location.pathname, productData]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  useEffect(() => {
    if (level1 && level2 && !level3) {
      const models = Object.entries(productData[level1]?.[level2] || {}).filter(
        ([key]) => key !== "Image" && key !== "Icon"
      );

      models.forEach(([model]) => {
        if (!modelImages[model]) {
          const url = `${baseUrl}/api/images/${encodeURIComponent(
            level1
          )}/${encodeURIComponent(level2)}/${encodeURIComponent(model)}`;
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              if (Array.isArray(data) && data.length > 0) {
                setModelImages((prev) => ({ ...prev, [model]: data[0] }));
              }
            })
            .catch(() => {
              setModelImages((prev) => ({ ...prev, [model]: fallbackImage }));
            });
        }
      });
    }
  }, [level1, level2, level3, productData]);

  useEffect(() => {
    if (level1 && level2 && level3) {
      const url = `${baseUrl}/api/images/${encodeURIComponent(
        level1
      )}/${encodeURIComponent(level2)}/${encodeURIComponent(level3)}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setApiImages(data);
        })
        .catch((err) => {
          console.error("⚠️ 圖片載入失敗:", err);
          setApiImages([]);
        });
    }
  }, [level1, level2, level3]);

  const goBackOneLevel = () => {
    if (pathParts.length > 0) {
      const upperPath = [
        "/products",
        ...pathParts.slice(0, pathParts.length - 1),
      ].join("/");
      navigate(upperPath);
    } else {
      navigate("/products");
    }
  };

  const renderCard = (title, image, onClick, description) => (
    <div className="card-item" key={title}>
      <div
        className="card card-fixed shadow-sm"
        style={{ cursor: "pointer" }}
        onClick={onClick}
      >
        {image && (
          <div className="card-img-wrapper">
            <img
              src={image}
              alt={title}
              onError={(e) => (e.currentTarget.src = fallbackImage)}
              className="card-img-top card-img-fit"
            />
          </div>
        )}
        <div className="card-body">
          <h6 className="card-title mb-1">
            {title.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </h6>
          {description && description !== title && (
            <div className="text-muted small mt-1">
              {description.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderLevel = () => {
    if (Object.keys(productData).length === 0) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入分類資料中...</span>
          </div>
        </div>
      );
    }

    if (!isValidPath()) {
      return <p className="text-danger">找不到產品分類或型號，請重新選擇。</p>;
    }

    if (!level1) {
      return (
        <div className="card-responsive-grid">
          {Object.entries(productData).map(([category, data]) =>
            renderCard(category, data.Image, () =>
              navigate(`/products/${category}`)
            )
          )}
        </div>
      );
    }

    if (level1 && !level2) {
      const subCategories = Object.entries(productData[level1] || {}).filter(
        ([key]) => key !== "Image" && key !== "Icon"
      );
      return (
        <div className="card-responsive-grid">
          {subCategories.map(([sub, data]) =>
            renderCard(data.HideCardTitle ? "" : sub, data.Image, () => {
              if (data.url) {
                window.open(data.url, "_blank");
              } else {
                navigate(`/products/${level1}/${sub}`);
              }
            })
          )}
        </div>
      );
    }

    if (level1 && level2 && !level3) {
      const models = Object.entries(productData[level1]?.[level2] || {}).filter(
        ([key]) => key !== "Image" && key !== "Icon"
      );
      return (
        <div className="card-responsive-grid">
          {models.map(([model, data]) => {
            const info = data?.Information;
            const image = info?.Images?.[0] || modelImages[model];
            const externalUrl = data?.url;

            const handleClick = () => {
              if (externalUrl) {
                window.open(externalUrl, "_blank", "noopener noreferrer");
              } else {
                navigate(`/products/${level1}/${level2}/${model}`);
              }
            };

            return renderCard(
              data.HideCardTitle ? "" : info?.ExternalTitle || model,
              image,
              handleClick,
              ""
            );
          })}
        </div>
      );
    }

    if (level1 && level2 && level3) {
      const info = productData[level1]?.[level2]?.[level3]?.Information;
      if (!info) return <p>找不到產品資料。</p>;

      return (
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">{info.ExternalTitle || level3}</h4>
            <p>
              <strong>內部代號：</strong>
              {info.InternalTitle}
            </p>
            <p>{info.Description}</p>

            {apiImages.length > 0 ? (
              <div className="d-flex flex-column gap-3 mt-3">
                {apiImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onError={(e) => (e.currentTarget.src = fallbackImage)}
                    alt={`${info.ExternalTitle || level3} 圖片${i + 1}`}
                    className="img-fluid rounded card-img-fit"
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted">沒有圖片資料。</p>
            )}

            <button className="btn btn-secondary mt-4" onClick={goBackOneLevel}>
              ← 返回上一層
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-3">產品資訊</h2>
      <Breadcrumbs pathParts={pathParts} />
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
        </div>
      ) : (
        renderLevel()
      )}
    </div>
  );
};

export default Products;
