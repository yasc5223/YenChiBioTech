import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = ({ form, onChange, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleClick = () => {
    setSubmitted(true);

    const isValid =
      form.name &&
      form.unit &&
      form.phone &&
      form.email &&
      validateEmail(form.email);

    if (!isValid) {
      const formBox = document.querySelector('.contact-form');
      if (formBox) {
        formBox.classList.remove('shake');
        void formBox.offsetWidth;
        formBox.classList.add('shake');
      }
      return;
    }

    onSubmit();
  };

  const getInvalid = (field) => {
    if (!submitted) return false;
    if (field === 'email') {
      return !form.email || !validateEmail(form.email);
    }
    return !form[field];
  };

  return (
    <div className="contact-form border rounded p-3 bg-white">
      {['name', 'email', 'unit', 'phone'].map((field, idx) => {
        const isInvalid = getInvalid(field);
        return (
          <div className="mb-3" key={idx}>
            <label className="form-label fw-bold">
              {{
                name: '👤 姓名',
                email: '📧 Email',
                unit: '🏢 單位',
                phone: '📞 電話(#分機)',
              }[field]}
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
              value={form[field]}
              onChange={onChange}
            />
            {isInvalid && (
              <div className="invalid-feedback">
                {field === 'email' ? '請輸入正確的 Email 格式' : '請填寫此欄位'}
              </div>
            )}
          </div>
        );
      })}

      <div className="mb-3">
        <label className="form-label fw-bold">📝 備註 / 詢問內容</label>
        <textarea
          className="form-control"
          rows={4}
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder="若有未列出的詢問產品，請於此處填寫..."
        />
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary px-4 py-2" onClick={handleClick}>
          📮 送出
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
