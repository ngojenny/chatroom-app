import React from 'react';
import './Header.css';

const Header = props => {
  return (
    <header>
      <h1>{props.text}</h1>
      {props.children}
    </header>
  );
};

export default Header;
