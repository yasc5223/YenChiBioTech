import React from 'react';
import './Card.css';

function Card({ imageSrc, altText, link }) {
  return (
    <a href={link} className="card" target="_blank" rel="noopener noreferrer">
      <img src={imageSrc} alt={altText} className="card-image" />
    </a>
  );
}

export default Card;
