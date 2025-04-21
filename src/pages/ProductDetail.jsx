import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ProductDetail.css";

const fallbackImage = "/spinner.svg";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ProductDetail = () => {
  const { cat, sub, model } = useParams();
  const [info, setInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    fetch(`${baseUrl}/api/production`)
      .then((res) => res.json())
      .then((data) => {
        const detail = data?.[cat]?.[sub]?.[model]?.Information;
        setInfo(detail);
      })
      .catch(() => setInfo(null));
  }, [cat, sub, model]);

  useEffect(() => {
    fetch(
      `${baseUrl}/api/images/${encodeURIComponent(cat)}/${encodeURIComponent(
        sub
      )}/${encodeURIComponent(model)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data);
          setActiveImage(data[0]);
        }
      })
      .catch(() => setImages([]));
  }, [cat, sub, model]);

  const handleImageChange = (img) => {
    if (img === activeImage) return;
    setFade(true);
    setTimeout(() => {
      setActiveImage(img);
      setFade(false);
    }, 150);
  };

  if (!info) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">載入中...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-3">產品資訊</h2>
      <Breadcrumbs pathParts={[cat, sub, model]} />

      <div className="row align-items-start">
        {/* 圖片 */}
        <div className="col-md-5 mb-4">
          <Zoom>
            <img
              src={activeImage || fallbackImage}
              className={`main-preview-image ${fade ? "fade-out" : "fade-in"}`}
              alt="產品主圖"
              onError={(e) => (e.currentTarget.src = fallbackImage)}
            />
          </Zoom>

          <div className="thumb-list d-flex justify-content-start flex-wrap gap-2 mt-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className={`thumbnail-img ${
                  activeImage === img ? "active" : ""
                }`}
                onMouseEnter={() => handleImageChange(img)}
                onClick={() => handleImageChange(img)}
                onError={(e) => (e.currentTarget.src = fallbackImage)}
                alt={`產品圖 ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 文字 */}
        <div className="col-md-7">
          <div className="product-info">
            <h3>{info.InternalTitle}</h3>
            <p>模組: {model}</p>
            {info.ExternalTitle && info.ExternalTitle !== model && (
              <div className="product-subtitle">{info.ExternalTitle}</div>
            )}
          </div>
        </div>
      </div>

      {/* 說明 Markdown */}
      <hr className="my-4" />
      <div className="product-description-markdown">
        <strong>產品說明：</strong>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p className="markdown-p" {...props} />,
            h2: ({ node, ...props }) => (
              <h2 className="markdown-h2" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="markdown-ul" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="markdown-li" {...props} />
            ),
            table: ({ node, ...props }) => (
              <table className="markdown-table" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th className="markdown-th" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="markdown-td" {...props} />
            ),
            img: ({ node, ...props }) => (
              <img
                {...props}
                className={`markdown-img ${props.className || ""}`}
              />
            ),
          }}
        >
          {info.Description}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ProductDetail;
