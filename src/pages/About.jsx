import React from "react";
import "./About.css";
import Card from "../components/Card"; // 路徑依你實際放的位置調整

function About() {
  const brands = [
    {
      src: "/About/brands/abcam.png",
      alt: "abcam",
      link: "https://www.abcam.com/en-us/products/primary-antibodies",
    },
    {
      src: "/About/brands/BASO.png",
      alt: "BASO",
      link: "https://basobiotech.com/zh-tw/index.php",
    },
    {
      src: "/About/brands/cayman.svg",
      alt: "cayman",
      link: "https://www.caymanchem.com/?srsltid=AfmBOoqybv5BW4N3dkYECqwnvmsn-G3CbHRnblXu_4sE61VX8aPJOLJk",
    },
    {
      src: "/About/brands/Cell_Signaling.png",
      alt: "Signaling",
      link: "https://www.cellsignal.com/?srsltid=AfmBOoold-ujn7KPchY34RGPRSAoV2ANz2ip2zdtkIQ7Q99WQwTGrUYS",
    },
    {
      src: "/About/brands/infitek.png",
      alt: "infitek",
      link: "https://infitek.com/",
    },
    {
      src: "/About/brands/Leica.svg",
      alt: "Leica",
      link: "https://www.leicabiosystems.com/",
    },
    {
      src: "/About/brands/Proteintech.png",
      alt: "Proteintech",
      link: "https://www.ptglab.com/?srsltid=AfmBOopSs3YpFWhE9Tv2IotI9CGSiTyxsSFAgkqhhjnKBce5tcsVqggX",
    },
    {
      src: "/About/brands/santa.jpg",
      alt: "santa",
      link: "https://www.scbt.com/home?srsltid=AfmBOorn1wmkazNIHN7WXquUjye-icSFNkSzVUc1tCqtHcJa30bqw-Uu",
    },
    {
      src: "/About/brands/scitek.png",
      alt: "scitek",
      link: "https://www.scitekglobal.com/",
    },
    {
      src: "/About/brands/scytek.jpg",
      alt: "scytek",
      link: "https://www.scytek.com/",
    },
    {
      src: "/About/brands/Sigma-Aldrich.jpg",
      alt: "Sigma-Aldrich",
      link: "https://www.sigmaaldrich.com/TW/zh",
    },
    {
      src: "/About/brands/Thermo.png",
      alt: "Thermo",
      link: "https://www.thermofisher.com/tw/zt/home.html",
    },
    {
      src: "/About/brands/武藤化學.png",
      alt: "武藤化學",
      link: "https://www.mutokagaku.com/",
    },
    {
      src: "/About/brands/Polysciences.svg",
      alt: "Polysciences",
      link: "https://www.polysciences.com/default/",
    },
  ];
  return (
    <div className="about-container">
      <img src="/About/封面圖.png" alt="封面圖" className="about-banner" />

      <div className="about-text">
        <div className="paragraph-title">
          <img src="/About/icon/1.png" alt="" className="paragraph-icon" />{" "}
          團隊背景
        </div>
        <p className="fade-in-text" style={{ animationDelay: "0.5s" }}>
          <br />
          我們是一支專注於動物組織病理代檢與實驗委託服務的專業團隊，成員皆具備生物醫學相關科系背景，對動物實驗設計、病理分析與研究流程有深厚的理解與豐富的實務經驗。
        </p>

        <div className="paragraph-title">
          <img src="/About/icon/2.png" alt="" className="paragraph-icon" />{" "}
          服務宗旨
        </div>
        <p className="fade-in-text" style={{ animationDelay: "2s" }}>
          我們了解在動物實驗與學術研究中，病理診斷與組織分析扮演著關鍵角色。無論是學術研究單位、醫學中心或生技產業，我們致力於提供高品質、精確且迅速的組織病理分析服務，協助客戶提升研究品質與效率。研質秉持著科學嚴謹、品質優先、服務至上的理念，我們期望成為您在研究路上的堅強後盾。
        </p>
        <div className="paragraph-title">
          <img src="/About/icon/4.png" alt="" className="paragraph-icon" />{" "}
          合作品牌
        </div>
        <div className="card-grid">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="card-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                imageSrc={brand.src}
                altText={brand.alt}
                link={brand.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
