import React from 'react';
import './Message.css';

const Message = (props) => {
  return (
    <div className={props.authorUID === props.userUID ? "individualMessage currentUserMessage" : "individualMessage"}>
      <span>{props.authorName}</span>
      <p>{props.msg}</p>
    </div>
  )
}

export default Message;