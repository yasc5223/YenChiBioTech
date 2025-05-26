import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import "./transition.css";
import ProductDetail from "./pages/ProductDetail";
import Inquiry from "./pages/Inquiry";
import Footer from "./components/Footer";
import OutsourcingForm from "./pages/Forms/OutsourcingForm";
import BloodBiochemicalAnalysisForm from "./pages/Forms/BloodBiochemicalAnalysisForm";
import FishAndShrimpDiseasesForm from "./pages/Forms/FishAndShrimpDiseasesForm";
import UrinalysisForm from "./pages/Forms/UrinalysisForm";
import ScrollToTop from "./components/ScrollToTop";
import PathologyShowcase from "./pages/PathologyShowcase";
import "./App.css";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const nodeRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="app-wrapper d-flex flex-column min-vh-100">
      <Navbar />
      <main className="app-main flex-grow-1">
        <div className="container mt-5 pt-3">
          {
            <TransitionGroup>
              <ScrollToTop />
              <CSSTransition
                key={location.pathname}
                classNames="fade"
                timeout={300}
                unmountOnExit
                nodeRef={nodeRef}
              >
                <div ref={nodeRef}>
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/products/*" element={<Products />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                      path="/products/:cat/:sub/:model"
                      element={<ProductDetail />}
                    />
                    <Route path="/inquiry" element={<Inquiry />} />
                    <Route
                      path="/services/HistopathologyOutsourcing"
                      element={<OutsourcingForm />}
                    />
                    <Route
                      path="/services/BloodBiochemicalAnalysis"
                      element={<BloodBiochemicalAnalysisForm />}
                    />
                    <Route
                      path="/services/FishAndShrimpDiseases"
                      element={<FishAndShrimpDiseasesForm />}
                    />
                    <Route
                      path="/services/UrinalysisForm"
                      element={<UrinalysisForm />}
                    />
                    <Route
                      path="/outsourcing/showcase"
                      element={<PathologyShowcase />}
                    />
                  </Routes>
                </div>
              </CSSTransition>
            </TransitionGroup>
          }
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
