import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./OutsourcingForm.css";

const OutsourcingForm = () => {
  const [form, setForm] = useState({
    organization: "",
    contactPerson: "",
    contactInfo: "",
    invoice: "",
    species: "",
    services: [],
    others: "",
    recaptcha: "",
  });

  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const reCAPTCHAKey = import.meta.env.VITE_RECAPTCHA_KEY;

  const servicesList = [
    "製作蠟塊",
    "切空白切片",
    "染 HE",
    "特殊染色",
    "玻片掃描",
    "IHC染色 (自備抗體，會與您溝通稀釋倍數)",
    "IF螢光染色(紅綠藍)"
  ];

  useEffect(() => {
    if (captchaToken) {
      setForm((prev) => ({ ...prev, recaptcha: captchaToken }));
    }
  }, [captchaToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...form.services, value]
      : form.services.filter((v) => v !== value);
    setForm({ ...form, services: updated });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.organization) newErrors.organization = "必填";
    if (!form.contactPerson) newErrors.contactPerson = "必填";
    if (!form.contactInfo) newErrors.contactInfo = "必填";
    if (!form.species) newErrors.species = "必填";
    if (!form.recaptcha) newErrors.recaptcha = "請通過驗證";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/outsourcing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        alert("✅ 表單送出成功！感謝您！");
        setForm({
          organization: "",
          contactPerson: "",
          contactInfo: "",
          invoice: "",
          species: "",
          services: [],
          others: "",
          recaptcha: "",
        });
        setCaptchaToken("");
      } else {
        const { error } = await res.json();
        alert(`❌ 表單送出失敗：${error || "伺服器錯誤"}`);
      }
    } catch (err) {
      console.error("發送失敗:", err);
      alert("❌ 網路錯誤，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="outsourcing-form-container">
      <div className="paper-style-form p-4 shadow" style={{ maxWidth: "800px", width: "100%", wordWrap: "break-word", overflowWrap: "break-word" }}>
        <h3 className="mb-4 text-primary text-center">病理組織代工需求單</h3>
        
        <h4 className="text-muted mb-4 text-center">
          <strong>
          感謝您選擇研質生技為您服務，為了維持品質，檢體請以10倍體積的福馬林保存呦～
          </strong>
        </h4>
        <form onSubmit={handleSubmit}>
          {[
            { name: "organization", label: "單位名稱 *" },
            { name: "contactPerson", label: "聯絡人 *" },
            { name: "contactInfo", label: "聯絡方式（Email 或電話）*" },
            { name: "species", label: "組織物種 *" },
          ].map(({ name, label }) => (
            <div className="mb-3" key={name}>
              <label className="form-label fw-bold">{label}</label>
              <input
                type="text"
                className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                name={name}
                value={form[name]}
                onChange={handleChange}
              />
              {errors[name] && (
                <div className="invalid-feedback">{errors[name]}</div>
              )}
            </div>
          ))}

          <div className="mb-4">
            <label className="form-label fw-bold">委託需求（可複選）*</label>
            <div className="row">
              {servicesList.map((s, idx) => (
                <div className="col-md-6" key={idx}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={s}
                      checked={form.services.includes(s)}
                      onChange={handleServiceChange}
                      id={`service-${idx}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`service-${idx}`}
                    >
                      {s}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">其他需求詢問</label>
            <textarea
              className="form-control"
              name="others"
              rows="3"
              value={form.others}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-between align-items-start mt-4 flex-wrap gap-3">
            <div>
              <ReCAPTCHA
                sitekey={reCAPTCHAKey}
                onChange={(token) => setCaptchaToken(token)}
              />
              {errors.recaptcha && (
                <div className="text-danger small mt-1">
                  {errors.recaptcha}
                </div>
              )}
            </div>

            <div className="text-end">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 d-flex align-items-center justify-content-center gap-2"
                style={{ height: "40px", minWidth: "140px" }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span>送出中...</span>
                  </>
                ) : (
                  <>
                    📮 <span>送出表單</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutsourcingForm;
