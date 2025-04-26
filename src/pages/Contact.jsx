import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    unit: "",
    phone: "",
    message: "",
  });

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("inquiryCart") || "[]");
    setCart(stored);
  }, []);

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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("📨 詢價單已成功送出！");
        localStorage.removeItem("inquiryCart");
        window.dispatchEvent(new Event("inquiry-updated"));
        navigate("/");
      } else {
        alert("❌ 詢價單送出失敗");
      }
    } catch (err) {
      console.error("發送失敗：", err);
      alert("❌ 發送時發生錯誤");
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="row g-4">
        {/* 表單區塊 */}
        <div className="col-lg-7">
          <div className="paper-style-form p-4 shadow contact-form-card">
            <h2 className="mb-4 text-primary text-center">📨 聯絡我們</h2>
            <ContactForm form={form} onChange={handleChange} onSubmit={handleSubmit} />
          </div>
        </div>

        {/* 地圖與聯絡資訊 */}
        <div className="col-lg-5">
          <div className="info-card bg-white rounded shadow p-4 h-100">
            <h5 className="fw-bold mb-3">📍 公司資訊</h5>
            <p><strong>公司名稱：</strong>研質生技股份有限公司</p>
            <p><strong>電話：</strong>(02) 1234-5678</p>
            <p><strong>Email：</strong>info@yentech.com.tw</p>
            <p><strong>地址：</strong>台北市中山區某某路 123 號</p>
            <div className="ratio ratio-4x3 rounded overflow-hidden mt-3">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625.1066132322766!2d121.548997!3d25.036448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abcd12345678%3A0x9876543210abcdef!2z5qGD6aSo6Lev5a246Kit5a2X!5e0!3m2!1szh-TW!2stw!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
