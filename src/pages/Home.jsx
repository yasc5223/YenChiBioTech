import React from "react";
import ImageCarousel from "../components/ImageCarousel";
import "./Home.css"; // 確保有引入 CSS

function Home() {
  const newsList = [
    {
      id: 1,
      title:
        "歡慶開幕!!!全台前五台組織旋轉切片機(R2260)優惠價只要20萬，快把握機會，快來聯繫我們了解詳情!",
      date: "2025-05-01",
    },
  ];

  return (
    <div className="home">
      <ImageCarousel
        path="/api/images" // API 路徑
        baseImagePath="/images" // 圖片所在資料夾
        interval={3000} // 輪播間隔（毫秒）
        title="" // 選擇性標題
      />

      <section className="news-section mt-5">
        <h2 className="news-title">最新消息</h2>
        {newsList.length > 0 ? (
          <ul className="news-list">
            {newsList.map((news) => (
              <li key={news.id} className="news-item">
                <span className="news-date">{news.date}</span> -{" "}
                <span className="news-text">{news.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted">目前無最新消息</p>
        )}
      </section>
    </div>
  );
}

export default Home;
