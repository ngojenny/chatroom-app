import React from 'react';
import './Message.css';

const Message = (props) => {
  return (
    <div className="individualMessage">
      <span>{props.authorName}</span>
      <p>{props.msg}</p>
    </div>
  )
}

export default Message;