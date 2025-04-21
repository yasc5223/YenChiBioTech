import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { HiHome } from 'react-icons/hi';
import { productData } from '../data/productData';
import './Products.css';

const fallbackImage = '/spinner.svg';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname
    .replace('/products', '')
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);

  const [level1, level2, level3] = pathParts;
  const [loading, setLoading] = useState(true);

  const isValidPath = () => {
    if (level1 && !productData[level1]) return false;
    if (level2 && !productData[level1]?.[level2]) return false;
    if (level3 && !productData[level1]?.[level2]?.[level3]) return false;
    return true;
  };

  useEffect(() => {
    if (!isValidPath()) {
      navigate('/products');
    }
  }, [location.pathname]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const renderBreadcrumb = () => {
    const fullPath = ['/products', ...pathParts];
    const pathLinks = [];

    fullPath.forEach((part, index) => {
      const path = fullPath.slice(0, index + 1).join('/');
      pathLinks.push({ name: decodeURIComponent(part), to: path });
    });

    return (
      <nav className="breadcrumb-container mb-4">
        <ol className="breadcrumb align-items-center d-flex flex-wrap mb-0">
          {pathLinks.map((item, i) => (
            <React.Fragment key={i}>
              <li
                className={`breadcrumb-item ${i === pathLinks.length - 1 ? 'active' : ''}`}
                {...(i !== pathLinks.length - 1 && {
                  style: { cursor: 'pointer' },
                  onClick: () => navigate(item.to),
                })}
                aria-current={i === pathLinks.length - 1 ? 'page' : undefined}
              >
                {i === 0 ? (
                  <>
                    <HiHome className="me-1" />
                    產品
                  </>
                ) : (
                  item.name
                )}
              </li>
              {i !== pathLinks.length - 1 && (
                <li className="mx-1 text-muted">
                  <FiChevronRight />
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  };

  const renderCard = (title, image, onClick) => (
    <div className="card-item" key={title}>
      <div className="card card-fixed shadow-sm" style={{ cursor: 'pointer' }} onClick={onClick}>
        {image && (
          <img
            src={image}
            alt={title}
            onError={(e) => (e.currentTarget.src = fallbackImage)}
            className="card-img-top card-img-fit"
          />
        )}
        <div className="card-body">
          <h6 className="card-title mb-0">{title}</h6>
        </div>
      </div>
    </div>
  );

  const renderLevel = () => {
    if (!isValidPath()) {
      return <p className="text-danger">找不到產品分類或型號，請重新選擇。</p>;
    }

    if (!level1) {
      return (
        <div className="card-responsive-grid">
          {Object.entries(productData).map(([category, data]) =>
            renderCard(category, data.Image, () => navigate(`/products/${category}`))
          )}
        </div>
      );
    }

    if (level1 && !level2) {
      const subCategories = Object.entries(productData[level1] || {}).filter(([key]) => key !== 'Image');
      return (
        <div className="card-responsive-grid">
          {subCategories.map(([sub, data]) =>
            renderCard(sub, data.Image, () => navigate(`/products/${level1}/${sub}`))
          )}
        </div>
      );
    }

    if (level1 && level2 && !level3) {
      const models = Object.keys(productData[level1]?.[level2] || {});
      return (
        <div className="card-responsive-grid">
          {models.map((model) => {
            const info = productData[level1][level2][model]?.Information;
            const image = info?.Images?.[0];
            return renderCard(info?.ExternalTitle || model, image, () =>
              navigate(`/products/${level1}/${level2}/${model}`)
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
            <p><strong>內部代號：</strong>{info.InternalTitle}</p>
            <p>{info.Description}</p>

            {info.Images && info.Images.length > 0 && (
              <div className="d-flex flex-column gap-3 mt-3">
                {info.Images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onError={(e) => (e.currentTarget.src = fallbackImage)}
                    alt={`${info.ExternalTitle || level3} 圖片${i + 1}`}
                    className="img-fluid rounded card-img-fit"
                  />
                ))}
              </div>
            )}

            <button className="btn btn-secondary mt-4" onClick={() => navigate(-1)}>← 返回上一層</button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-3">產品資訊</h2>
      {renderBreadcrumb()}
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
