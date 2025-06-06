import React, { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./OutsourcingForm.css";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";

const OutsourcingForm = () => {
  const { cat, sub, model } = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cat, sub, model]);
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const servicesList = [
    "石蠟包埋",
    "石蠟空白切片",
    "H&E",
    "IHC",
    "IF螢光 (雙染)",
    "特殊染色",
    "可見光 (400X)",
    "螢光 (400X) DAPI+單波長",
    "螢光 (400X) DAPI+雙波長",
    "脫鈣前處理",
    "動物病理判讀",
  ];

  useEffect(() => {
    if (captchaToken) {
      setForm((prev) => ({ ...prev, recaptcha: captchaToken }));
    }
  }, [captchaToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleQuantityChange = (name, qty) => {
  const updated = form.services.map((s) =>
    s.name === name ? { ...s, quantity: qty } : s
  );
  setForm({ ...form, services: updated });
};
const handleServiceChange = (e) => {
  const { value, checked } = e.target;
  const updatedServices = checked
    ? [...form.services, { name: value, quantity: 1 }]
    : form.services.filter((s) => s.name !== value); // ← 修正重點在這

  setForm({ ...form, services: updatedServices });
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
    // 🪄 將 services object 陣列轉換成字串陣列
    const formToSubmit = {
      ...form,
      services: form.services.map((s) => `${s.name} x ${s.quantity}`),
    };

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/sendForm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formToSubmit),
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
  const serviceTable = [
    {
      type: "包埋",
      rowspan: 1,
      items: [{ item: "石蠟包埋", price: "110" }],
    },
    {
      type: "切片",
      rowspan: 1,
      items: [{ item: "石蠟空白切片", price: "50" }],
    },
    {
      type: "染色",
      rowspan: 4,
      note: "註: 不含切片，若需切片一片加 50 元，\n一級抗體需自行準備",
      items: [
        { item: "H&E", price: "50" },
        { item: "IHC", price: "400" },
        { item: "IF 螢光（雙染）", price: "900" },
        { item: "特殊染色", price: "300" },
      ],
    },
    {
      type: "掃片", // ← ✅ 修正這一筆
      rowspan: 3,
      items: [
        { item: "可見光 (400X)", price: "400" },
        { item: "螢光 (400X) DAPI + 單波長", price: "1400" },
        { item: "螢光 (400X) DAPI + 雙波長", price: "1900" },
      ],
    },
    {
      type: "其他",
      rowspan: 2,
      items: [
        { item: "脫鈣前處理", price: "90" },
        { item: "動物病理判讀", price: "依需求報價" },
      ],
    },
  ];

  return (
    <div className="outsourcingForm-outsourcing-form-container">
      <title>病理組織代工需求單</title>
      <meta
        name="description"
        content="提交您組織樣本的委託需求，我們提供切片、染色、掃描等病理服務。"
      />
      <div
        className="outsourcingForm-paper-style-form p-4 shadow"
        style={{
          maxWidth: "800px",
          width: "100%",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        <h3 className="mb-4 text-primary text-center">病理組織代工需求單</h3>

        <h4 className="text-muted mb-4 text-center">
          <strong>
            為了維護品質，若要包埋檢體請以10%中性緩衝福馬林固定，建議的福馬林用量為組織體積的至少10倍以上浸泡，並將瓶口用Paraffin封緊，避免外漏呦~
          </strong>
        </h4>
        {isMobile ? (
          <div className="mobile-table">
            {serviceTable.map((group, idx) => (
              <div className="mobile-card mb-3 p-3 border rounded" key={idx}>
                <h5 className="fw-bold text-primary mb-2">{group.type}</h5>
                <ul className="list-unstyled mb-2">
                  {group.items.map((item, i) => (
                    <li
                      key={i}
                      className="d-flex justify-content-between border-bottom py-1"
                    >
                      <span>{item.item}</span>
                      <span>{item.price}</span>
                    </li>
                  ))}
                </ul>
                {group.note && (
                  <div
                    className="small text-muted"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {group.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="outsourcingForm-table table-bordered text-center align-middle">
              <colgroup>
                <col style={{ width: "15%" }} />
                <col style={{ width: "55%" }} />
                <col style={{ width: "30%" }} />
              </colgroup>
              <thead className="table-danger text-white fw-bold">
                <tr>
                  <th>類型</th>
                  <th>項目</th>
                  <th>單個收費</th>
                </tr>
              </thead>
              <tbody>
                {serviceTable.map((group, groupIdx) =>
                  group.items.map((row, rowIdx) => (
                    <tr key={`${groupIdx}-${rowIdx}`}>
                      {rowIdx === 0 && (
                        <td rowSpan={group.rowspan}>
                          <div>
                            {group.type}
                            {group.note && (
                              <div
                                className="note"
                                dangerouslySetInnerHTML={{
                                  __html: group.note.replace(/\n/g, "<br />"),
                                }}
                              />
                            )}
                          </div>
                        </td>
                      )}
                      <td>{row.item}</td>
                      <td>{row.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="table-note mt-3 text-start">
          <p>
            <strong className="text-primary">特殊染色：</strong>
            <span className="text-primary">
              PAS、Trichrome，其他特殊染色價格另議
            </span>
          </p>
          <p>
            <strong className="text-danger">優惠組合價：</strong>
            <span className="text-danger">
              包埋 + 切片 + H&E（一組）NT$ 200 元
            </span>
          </p>
          <p className="note-muted mt-2">
            ※以上為一般檢體適用，若有 Tissue Microarray (TMA)
            製作或是其他類型服務價格另議，
            <br />
            需其他服務也可以諮詢我們喔～
          </p>
        </div>

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
    {servicesList.map((s, idx) => {
      const selected = form.services.find((srv) => srv.name === s);
      return (
        <div className="col-md-6 d-flex align-items-center mb-2" key={idx}>
          <input
            className="form-check-input me-2"
            type="checkbox"
            value={s}
            checked={!!selected}
            onChange={handleServiceChange}
            id={`service-${idx}`}
          />
          <label className="form-check-label me-2" htmlFor={`service-${idx}`}>
            {s}
          </label>
          {selected && (
            <input
              type="number"
              className="form-control form-control-sm"
              style={{ width: "80px" }}
              min="1"
              value={selected.quantity}
              onChange={(e) =>
                handleQuantityChange(s, Math.max(1, Number(e.target.value)))
              }
            />
          )}
        </div>
      );
    })}
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
                <div className="text-danger small mt-1">{errors.recaptcha}</div>
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
