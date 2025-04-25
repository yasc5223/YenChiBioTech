import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    unit: '',
    phone: '',
    message: '',
  });

  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false); // ✅ 新增

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('inquiryCart') || '[]');
    setCart(stored);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, unit, phone, email, message } = form;

    if (!name || !unit || !phone || !email) {
      alert('請完整填寫所有必填欄位');
      return;
    }

    if (cart.length === 0 && !message.trim()) {
      alert('請加入商品或填寫備註內容');
      return;
    }

    const payload = {
      name, unit, phone, email, message,
      recaptcha: form.recaptcha,
      items: cart,
    };

    try {
      setSubmitting(true); // ✅ 開始 loading
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('📨 完成！將會盡快與您聯繫！');
        localStorage.removeItem('inquiryCart');
        window.dispatchEvent(new Event('inquiry-updated'));
        navigate('/');
      } else {
        alert('❌ 資料發送失敗，請聯繫管理員。');
      }
    } catch (err) {
      console.error('發送失敗：', err);
      alert('❌ 資料發送失敗，請聯繫管理員。');
    } finally {
      setSubmitting(false); // ✅ 結束 loading
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-sm p-4 contact-form-card">
            <h2 className="mb-4 text-primary text-center">📨 聯絡我們</h2>
            <ContactForm
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting} // ✅ 傳入 loading 狀態
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
