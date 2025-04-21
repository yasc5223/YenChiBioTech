import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumbs = ({ pathParts = [] }) => {
  const navigate = useNavigate();

  const fullPath = ['/products', ...pathParts];

  return (
    <nav className="breadcrumb-container mb-4">
      <ol className="breadcrumb align-items-center d-flex flex-wrap mb-0">
        {fullPath.map((part, i) => {
          const path = fullPath.slice(0, i + 1).join('/');
          const name = decodeURIComponent(part);
          return (
            <React.Fragment key={i}>
              <li
                className={`breadcrumb-item ${i === fullPath.length - 1 ? 'active' : ''}`}
                {...(i !== fullPath.length - 1 && {
                  style: { cursor: 'pointer' },
                  onClick: () => navigate(path),
                })}
              >
                {i === 0 ? <><HiHome className="me-1" />產品</> : name}
              </li>
              {i !== fullPath.length - 1 && (
                <li className="mx-1 text-muted">
                  <FiChevronRight />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
