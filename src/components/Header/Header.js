import React, { Fragment } from 'react';
import './Header.css';

const Header = (props) => {
  return (
    <Fragment>
      {props.mainHeader ? (
        <header>
          <h1>{props.text}</h1>
          {props.children}
        </header>
      ) : (
        <div>
          <h2>{props.text}</h2>
          {props.children}
        </div>
      )}
    </Fragment>
  )
}

export default Header;