import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Inquiry.css";
import ContactForm from "../components/ContactForm";

const Inquiry = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const [cart, setCart] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false); // 🆕
  const [form, setForm] = useState({
    name: "",
    email: "",
    unit: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("inquiryCart") || "[]");
    setCart(stored);
  }, []);

  const handleRemove = (model) => {
    const updated = cart.filter((item) => item.model !== model);
    setCart(updated);
    localStorage.setItem("inquiryCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("inquiry-updated"));
  };

  const handleClear = () => {
    localStorage.removeItem("inquiryCart");
    setCart([]);
    window.dispatchEvent(new Event("inquiry-updated"));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, unit, phone, email, message } = form;

    if (!name || !unit || !phone || !email) {
      alert("請完整填寫所有欄位");
      return;
    }

    if (cart.length === 0 && !message.trim()) {
      alert("請加入商品或填寫備註內容");
      return;
    }

    const payload = {
      name,
      unit,
      phone,
      email,
      message,
      recaptcha: form.recaptcha,
      items: cart,
    };

    try {
      setSubmitting(true); // ⏳ 開始提交
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/inquiry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert("📨 詢價單已成功送出！");
        localStorage.removeItem("inquiryCart");
        window.dispatchEvent(new Event("inquiry-updated"));
        setShowForm(false);
        setCart([]);
      } else {
        alert("❌ 詢價單送出失敗");
      }
    } catch (err) {
      console.error("發送失敗：", err);
      alert("❌ 發送時發生錯誤");
    } finally {
      setSubmitting(false); // ✅ 結束提交
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container text-center">
        <h4>🛒 詢價車是空的</h4>
        <p>您尚未加入任何產品</p>
        <Link className="btn btn-outline-primary mt-3" to="/products">
          瀏覽產品
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">📋 詢價清單</h2>
{!isMobile ? (
  <table className="table table-bordered table-hover inquiry-table">
    <thead className="table-light">
      <tr>
        <th style={{ width: "110px" }}>圖片</th>
        <th style={{ width: "200px" }}>產品名稱</th>
        <th style={{ width: "160px" }}>分類</th>
        <th className="internal-code">說明</th>
        <th style={{ width: "80px" }}>操作</th>
      </tr>
    </thead>
    <tbody>
      {cart.map((item, idx) => (
        <tr key={idx}>
          <td className="text-center align-middle">
            <img
              src={item.image || "/spinner.svg"}
              alt={item.model}
              className="rounded me-3"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
          </td>
          <td className="align-middle">
            <Link
              to={`/products/${encodeURIComponent(item.category)}/${encodeURIComponent(item.subCategory)}/${encodeURIComponent(item.model)}`}
            >
              {item.model}
            </Link>
            {item.info?.ExternalTitle && (
              <div className="text-muted small">
                {item.info.ExternalTitle}
              </div>
            )}
          </td>
          <td className="align-middle">
            {item.category} / {item.subCategory}
          </td>
          <td className="align-middle internal-code">
            {item.info?.InternalTitle?.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </td>
          <td className="text-center align-middle">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleRemove(item.model)}
            >
              移除
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <div className="mobile-inquiry-list">
    {cart.map((item, idx) => (
      <div className="mobile-inquiry-card" key={idx}>
        <button
          type="button"
          className="remove-x-btn"
          onClick={() => handleRemove(item.model)}
        >
          ×
        </button>
        <div><strong>產品名稱：</strong> {item.model}</div>
        <div><strong>分類：</strong> {item.category} / {item.subCategory}</div>
        <div><strong>說明：</strong>
          {item.info?.InternalTitle?.split("\n").map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <div><strong>圖片：</strong>
          <img
            src={item.image || "/spinner.svg"}
            alt={item.model}
            style={{ width: "60px", height: "60px", objectFit: "cover", marginTop: "6px" }}
          />
        </div>
      </div>
    ))}
  </div>
)}


      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-danger" onClick={handleClear}>
          🧹 清空詢價清單
        </button>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          📮 送出詢價單
        </button>
      </div>

      {showForm && (
        <div
          className="custom-backdrop"
          onClick={(e) => {
            if (e.target.classList.contains("custom-backdrop")) {
              setShowForm(false);
            }
          }}
        >
          <div className="custom-modal">
            <div className="custom-modal-header">
              <span>📨 填寫聯絡資訊</span>
              <button
                className="custom-close-btn"
                onClick={() => setShowForm(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <ContactForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitting={submitting} // ✅ 傳給表單
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiry;
