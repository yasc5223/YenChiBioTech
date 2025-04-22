import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import './ContactForm.css';

const ContactForm = ({ form, onChange, onSubmit }) => {
  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState('');

  const reCAPTCHAKey = import.meta.env.VITE_RECAPTCHA_KEY; // ✅ .env 裡設定 VITE_RECAPTCHA_KEY

  useEffect(() => {
    if (captchaToken) {
      onChange({ target: { name: 'recaptcha', value: captchaToken } });
    }
  }, [captchaToken]);

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = '必填';
    if (!form.email) {
      errs.email = '必填';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Email 格式錯誤';
    }
    if (!form.unit) errs.unit = '必填';
    if (!form.phone) errs.phone = '必填';
    if (!form.recaptcha) errs.recaptcha = '請通過驗證';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {[{ name: 'name', label: '👤 姓名' },
        { name: 'email', label: '📧 Email' },
        { name: 'unit', label: '🏢 單位' },
        { name: 'phone', label: '📞 電話' }
      ].map(({ name, label }) => (
        <div key={name} className="mb-3">
          <label className="form-label fw-bold">{label}</label>
          <input
            type={name === 'email' ? 'email' : 'text'}
            name={name}
            className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
            value={form[name]}
            onChange={onChange}
          />
          {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
        </div>
      ))}

      <div className="mb-3">
        <label className="form-label fw-bold">📝 備註 / 詢問內容</label>
        <textarea
          name="message"
          rows="4"
          className="form-control"
          value={form.message}
          onChange={onChange}
          placeholder="若有未列出的詢問產品，請於此處填寫..."
        />
      </div>

      <div className="mb-3">
        <ReCAPTCHA
          sitekey={reCAPTCHAKey}
          onChange={(token) => setCaptchaToken(token)}
        />
        {errors.recaptcha && (
          <div className="text-danger small mt-1">{errors.recaptcha}</div>
        )}
      </div>

      <div className="text-end">
        <button type="submit" className="btn btn-primary">
          📮 送出詢價單
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
