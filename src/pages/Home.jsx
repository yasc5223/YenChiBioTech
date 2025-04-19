import React from 'react';
import ImageCarousel from '../components/ImageCarousel';

function Home() {
  return (
    <div>
      <ImageCarousel
        path="/api/images"               // API 路徑
        baseImagePath="/images"          // 圖片所在資料夾
        interval={3000}                  // 輪播間隔（毫秒）
        title=""            // 選擇性標題
      />

      <div className="text-center mt-5">
        <h1>歡迎來到 YenChiBioTech</h1>
        <p>我們致力於提供專業生技服務與優質產品</p>
      </div>
    </div>
  );
}

export default Home;
