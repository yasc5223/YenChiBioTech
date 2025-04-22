import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaFacebookF, FaLine, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light mt-5 pt-4 pb-3">
      <div className="container">
        <div className="row">

          {/* 公司資訊 */}
          <div className="col-md-4 mb-3">
            <h5>YenChi BioTech</h5>
            <p className="small mb-1">台北市信義區 XX 路 XX 號</p>
            <p className="small mb-1">TEL: 02-1234-5678</p>
            <p className="small mb-1">Email: info@yenchibio.com</p>
          </div>

          {/* 快速連結 */}
          <div className="col-md-4 mb-3">
            <h6>快速連結</h6>
            <ul className="list-unstyled small">
              <li><Link className="footer-link" to="/about">關於我們</Link></li>
              <li><Link className="footer-link" to="/products">產品列表</Link></li>
              <li><Link className="footer-link" to="/inquiry">詢價清單</Link></li>
              <li><Link className="footer-link" to="/contact">聯絡我們</Link></li>
            </ul>
          </div>

          {/* 社群連結 */}
          <div className="col-md-4 mb-3">
            <h6>關注我們</h6>
            <div className="d-flex gap-3 mt-2">
              <a href="https://facebook.com" className="footer-icon" target="_blank" rel="noreferrer"><FaFacebookF /></a>
              <a href="https://line.me" className="footer-icon" target="_blank" rel="noreferrer"><FaLine /></a>
              <a href="mailto:info@yenchibio.com" className="footer-icon"><FaEnvelope /></a>
            </div>
          </div>
        </div>

        <div className="text-center footer-note">
  © 2025 YenChi BioTech All rights reserved.
</div>
      </div>
    </footer>
  );
};

export default Footer;
