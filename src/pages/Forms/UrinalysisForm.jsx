import React, { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./UrinalysisForm.css";

const UrinalysisForm = () => {
  const [form, setForm] = useState({
    organization: "",
    contactPerson: "",
    contactInfo: "",
    species: "",
    services: [],
    others: "",
    recaptcha: "",
  });

  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const reCAPTCHAKey = import.meta.env.VITE_RECAPTCHA_KEY;
  const recaptchaRef = useRef(null);
  const formName = "尿液生化檢驗";
  const servicesList = [
    "氯(CL, Chloride)",
    "肌酸酐(Creatinine)",
    "鈉(Na, Sodium)",
    "鉀(K, Potassium)",
    "總蛋白(Total Protein)",
    "尿酸(UA, Uric Acid)",
    "微量白蛋白(Microalbumin)",
    "尿素氮(BUN, Blood Urea Nitrogen)"
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
        `${import.meta.env.VITE_API_BASE_URL}/api/sendForm`,
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
          formName: formName
        });
        setCaptchaToken("");
        recaptchaRef.current?.reset();
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
        <h3 className="mb-4 text-primary text-center">{formName}</h3>
        <h4 className="text-muted mb-4 text-center">
          <strong>
            檢體準備:尿液(Urine)，最少準備尿液量100 ul<br/>每增加一個檢測項目，尿液量需增加10 ul
            </strong>
        </h4>

        <form onSubmit={handleSubmit}>
          {[
            { name: "organization", label: "單位名稱 *" },
            { name: "contactPerson", label: "聯絡人 *" },
            { name: "contactInfo", label: "聯絡方式（Email 或電話）*" },
            { name: "species", label: "物種 *" },
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
                ref={recaptchaRef}
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

export default UrinalysisForm;
