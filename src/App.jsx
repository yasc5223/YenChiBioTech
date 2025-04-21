import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import Contact from './pages/Contact';
import './transition.css';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const nodeRef = useRef(null); // ⭐ 關鍵修正

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-3">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center vh-100">
          <img
            src="spinner.svg"
            alt="載入中..."
            className="custom-spinner-img"
            width="80"
            height="80"
          />
        </div>
        ) : (
          <TransitionGroup>
            <CSSTransition
              key={location.pathname}
              classNames="fade"
              timeout={300}
              unmountOnExit
              nodeRef={nodeRef} // ⭐ 傳入這個
            >
              <div ref={nodeRef}>
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/products/*" element={<Products />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </div>
            </CSSTransition>
          </TransitionGroup>
        )}
      </div>
    </>
  );
}

export default App;
