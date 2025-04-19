import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import './ImageCarousel.css';

const ImageCarousel = ({
  path = '/api/images',
  interval = 3000,
  baseImagePath = '/images',
  title,
}) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}${path}`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error('Failed to fetch images:', err));
  }, [baseUrl, path]);

  return (
    <div className="container mt-4">
      {title && <h3 className="text-center mb-3">{title}</h3>}

      {images.length > 0 ? (
        <Carousel interval={interval}>
          {images.map((img, idx) => (
            <Carousel.Item key={idx}>
              <img
                className="d-block w-100"
                src={`${baseUrl}${baseImagePath}/${img}`}
                alt={`Slide ${idx + 1}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
