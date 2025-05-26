import React, { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./FishAndShrimpDiseasesForm.css";

const FishAndShrimpDiseasesForm = () => {
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
  const [servicesList, setServicesList] = useState([]);
  const reCAPTCHAKey = import.meta.env.VITE_RECAPTCHA_KEY;
  const recaptchaRef = useRef(null);

  const fishServicesList = [
    "神經壞死病毒",
    "虹彩病毒-Ranaviruses",
    "虹彩病毒-Megalocytivirus",
  ];

  const shrimpServicesList = [
    "副溶血弧菌(產毒基因)",
    "肝胰腺微胞子蟲",
    "白點病毒",
    "虹彩病毒",
    "副溶血弧菌(玻璃苗)",
  ];

  useEffect(() => {
    if (captchaToken) {
      setForm((prev) => ({ ...prev, recaptcha: captchaToken }));
    }
  }, [captchaToken]);

  useEffect(() => {
    if (form.species === "魚類") {
      setServicesList(fishServicesList);
    } else if (form.species === "蝦類") {
      setServicesList(shrimpServicesList);
    } else {
      setServicesList([]);
    }
    setForm((prev) => ({ ...prev, services: [] }));
  }, [form.species]);

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
        `${import.meta.env.VITE_API_BASE_URL}/api/fishshrimp`,
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
        <h3 className="mb-4 text-primary text-center">魚蝦疾病病原檢測需求單</h3>
        <h4 className="text-muted mb-4 text-center">
          <strong>
            檢體準備: 準備臟器冷藏或冷凍即可，不須泡在任何液體中，請先聯繫我們，不同病原需要測對應之臟器。
          </strong>
        </h4>


        <form onSubmit={handleSubmit}>
          {["organization", "contactPerson", "contactInfo"].map((name) => (
            <div className="mb-3" key={name}>
              <label className="form-label fw-bold">
                {name === "organization" && "單位名稱 *"}
                {name === "contactPerson" && "聯絡人 *"}
                {name === "contactInfo" && "聯絡方式（Email 或電話）*"}
              </label>
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

          <div className="mb-3">
            <label className="form-label fw-bold">檢體物種 *</label>
            <p className="text-muted small">※ 請先選擇檢體物種，選單將依物種顯示可選項目</p>
            <select
              className={`form-select ${errors.species ? "is-invalid" : ""}`}
              name="species"
              value={form.species}
              onChange={handleChange}
            >
              <option value="">請選擇</option>
              <option value="魚類">魚類</option>
              <option value="蝦類">蝦類</option>
            </select>
            {errors.species && (
              <div className="invalid-feedback">{errors.species}</div>
            )}
          </div>

          {servicesList.length > 0 && (
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
          )}

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

export default FishAndShrimpDiseasesForm;
