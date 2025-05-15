import React from "react";
import "./PathologyShowcase.css";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';


const baseUrl = import.meta.env.VITE_API_BASE_URL;
const sections = [
  {
    title: "H&E染色簡介",
    description:
      `H&E染色 是病理學與組織學中最常見且最基本的染色技術，用於觀察組織的基本結構與病理變化。
      
**成果照片:**`,
    images: [
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/HE1.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/HE2.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/HE3.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/HE4.png",
    ],
  },
  {
    title: "特殊染色 (Special Stains)簡介",
    description:
      `
特殊染色是一系列針對特定組織成分或微生物所設計的染色技術，常用於補充H&E染色無法辨識的病理資訊。具有高度診斷價值，廣泛應用於臨床病理與研究。

**本公司代工染色類型與用途：**

* **PAS染色（Periodic Acid-Schiff）**

用於偵測多醣體、糖原、基底膜與真菌細胞壁。常見於腎臟病變、真菌感染與腺體黏液檢查。
* **Masson三色染色（Masson's Trichrome）**

用來區分膠原纖維與肌肉組織，常用於評估肝臟或腎臟的纖維化程度。

**成果照片:**`,
    images: [
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/SPECIAL1.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/SPECIAL2.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/SPECIAL3.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/SPECIAL4.png",
    ],
  },
  {
    title: "IHC染色簡介",
    description:
      `
IHC染色 是利用抗體與抗原專一性結合的原理，來標定組織或細胞中特定蛋白質的表現位置與量的一種技術。此方法廣泛應用於病理診斷、癌症分類與生物醫學研究。

**成果照片:**
`,
    images: [
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/IHC1.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/IHC2.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/IHC3.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/IHC4.png",
    ],
  },
  {
    title: "IF螢光染色簡介",
    description:
      `IF螢光染色是一種以螢光標記抗體為工具，專一性地標定細胞或組織中目標抗原（蛋白質）的技術，廣泛應用於細胞生物學與分子病理學研究。

**成果照片:**
`,
    images: [
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/if1.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/if2.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/if3.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/if4.png",
    ],
  },
  {
    title: "全景掃片",
    description:
      "**成果照片:**",
    images: [
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/FULL1.png",
      "https://pub-b524d4be842842c49ece6c562a9d8709.r2.dev/FULL2.png",
    ],
  },
];

const PathologyShowcase = () => {
  return (
    <div className="showcase-container container">
      <h2 className="text-center text-primary mb-5">病理代工成果分享</h2>
      {sections.map((section, idx) => (
        <div className="showcase-section mb-5" key={idx}>
          <h4 className="text-dark fw-bold">{section.title}</h4>
          <p className="text-muted">
            {
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
                {section.description}
              </ReactMarkdown>
            }
          </p>
          <div className="image-row">
            {section.images.map((img, i) => (
              <div className="image-thumb" key={i}>
                <Zoom>
                <img src={img.startsWith("http") ? img : baseUrl + "/images" + img} alt={`展示圖 ${i + 1}`} />
                </Zoom>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PathologyShowcase;
