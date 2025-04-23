import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [info, setInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [fade, setFade] = useState(false);
  const [productList, setProductList] = useState([]); //

  useEffect(() => {
    fetch(`${baseUrl}/api/production`)
      .then((res) => res.json())
      .then((data) => {
        const detail = data?.[cat]?.[sub]?.[model]?.Information;
        setInfo(detail);

        const models = Object.keys(data?.[cat]?.[sub] || {}).filter(
          (m) => m !== "Image"
        );
        setProductList(models);
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

  const handleAddToInquiry = () => {
    const product = {
      model,
      category: cat,
      subCategory: sub,
      info: info || {},
      image: images[0] || fallbackImage,
    };

    const existing = JSON.parse(localStorage.getItem("inquiryCart") || "[]");
    const isExist = existing.some((item) => item.model === product.model);

    if (!isExist) {
      const updated = [...existing, product];
      localStorage.setItem("inquiryCart", JSON.stringify(updated));
      window.dispatchEvent(new Event("inquiry-updated"));
      alert("✅ 已加入詢價車");
    } else {
      alert("⚠️ 該產品已在詢價車中");
    }
  };

  // 規格圖搜尋策略
  const findSpecImage = () => {
    for (let i = 0; i <= 10; i++) {
      const suffix = i === 0 ? "" : i;
      const url = `${baseUrl}/Production/${encodeURIComponent(
        cat
      )}/${encodeURIComponent(sub)}/${encodeURIComponent(
        model
      )}/規格/規格${suffix}.png`;
      const img = new Image();
      img.src = url;
      img.onload = () => setSpecImageUrl(url);
    }
  };

  const [specImageUrl, setSpecImageUrl] = useState(null);

  useEffect(() => {
    findSpecImage();
  }, [cat, sub, model]);

  const currentIndex = productList.indexOf(model);
  const prevModel = productList[currentIndex - 1];
  const nextModel = productList[currentIndex + 1];

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

        <div className="col-md-7">
          <div className="product-info">
            {info.ExternalTitle && info.ExternalTitle !== model && (
              <h3
                dangerouslySetInnerHTML={{
                  __html: info.ExternalTitle.replace(/\n/g, "<br />"),
                }}
              />
            )}
            {cat != '耗材試劑與抗體' && (<p>型號: {model}</p>)}
            {info.InternalTitle && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p className="markdown-p" {...props} />
                  ),
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
                {info.InternalTitle.replace(/\n/g, "\n\n")}
              </ReactMarkdown>
            )}

            <div className="mt-3 d-flex gap-2 flex-wrap">
              {prevModel && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    navigate(
                      `/products/${encodeURIComponent(
                        cat
                      )}/${encodeURIComponent(sub)}/${encodeURIComponent(
                        prevModel
                      )}`
                    )
                  }
                >
                  ← 上一個
                </button>
              )}
              <button className="btn btn-warning" onClick={handleAddToInquiry}>
                🛒 加入詢價
              </button>
              {nextModel && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    navigate(
                      `/products/${encodeURIComponent(
                        cat
                      )}/${encodeURIComponent(sub)}/${encodeURIComponent(
                        nextModel
                      )}`
                    )
                  }
                >
                  下一個 →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />
      <div className="product-description-markdown">
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
          {(info.Description || "").replace(/\n/g, "\n\n")}
        </ReactMarkdown>

        {specImageUrl && (
          <div className="mt-4">
            <img
              src={specImageUrl}
              alt="產品規格圖"
              className="img-fluid border rounded"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
