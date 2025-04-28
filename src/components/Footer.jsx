import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaFacebookF, FaLine, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return (
    <footer className="footer bg-dark text-light mt-5 pt-4 pb-3">
      <div className="container">
        <div className="row">
          {/* 公司資訊
          研質生技有限公司
Yenchi Biotech LTD

電話: 先空白
傳真: 04-24637008
Email: info@yenchibio.com.tw
地址: 台中市西屯科園路19號3F301室
3F-301, No. 19, Keyuan Rd.  Xitun Dist., Taichung City 407  
Taiwan (R.O.C.)
          */}
          <div className="col-md-4 mb-3">
            <h5>研質生技有限公司</h5>
            <h5>Yenchi Biotech LTD</h5>
          </div>

          {/* 快速連結 */}
          <div className="col-md-4 mb-3">
            <p className="small mb-1">電話: </p>
            <p className="small mb-1">傳真: 04-24637008</p>
            <p className="small mb-1">Email: info@yenchibio.com.tw</p>
            <p className="small mb-1">地址: 台中市西屯區科園路19號3F301室</p>
            <p className="small mb-1">
              3F-301, No. 19, Keyuan Rd. Xitun Dist., Taichung City 407
            </p>
            <p className="small mb-1">Taiwan (R.O.C.)</p>
          </div>

          {/* 社群連結 
              <a href="https://facebook.com" className="footer-icon" target="_blank" rel="noreferrer"><FaFacebookF /></a>
              <a href="https://line.me" className="footer-icon" target="_blank" rel="noreferrer"><FaLine /></a>
              */}
          <div className="col-md-4 mb-3 d-flex flex-column justify-content-start align-items-center">
            <img src={baseUrl + "/api/GetImage/LineQRCode.png"} alt="" className="footer-icon-image" />
            <p className="mt-2 mb-0 small text-center">
              歡迎加入官方LINE詢問更多產品
            </p>
          </div>
        </div>

        <div className="text-center footer-note">
          © 2025 研質生技有限公司 All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
