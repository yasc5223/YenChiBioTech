import React from 'react';
import { useParams } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const { sub } = useParams();

  return (
    <div className="products-page container mt-4">
      <h2>{sub} 產品列表</h2>
      {/* 可加上根據 sub 顯示對應清單 */}
    </div>
  );
};

export default Products;