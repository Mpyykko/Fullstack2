import React from 'react';

interface HeaderProps {
  title: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, className }) => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container d-flex justify-content-center w-100">
        <span className={`navbar-brand mb-0 h1 ${className}`}>{title}</span>
      </div>
    </nav>
  );
};

export default Header;
