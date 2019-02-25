import React, { Component } from 'react';
import { connect } from 'react-redux';
import { chunk } from '../util';

const ChatMessage = ({
  message,
  float,
  children = null,
  bottom
}) => {
  // const messageEdited = chunk(message.text, 38).join('\n');
  const messageEdited = message.text;
  return (
    <li key={message._id} className={`message ${float ? 'right' : 'left'}`} id={bottom ? 'bottom' : null}>
      <p>
        {messageEdited}
      </p>
      {children}
    </li>
  );
};

export default ChatMessage;
