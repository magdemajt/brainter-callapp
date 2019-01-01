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
  const longestLine = messageEdited.split('\n').reduce((prev, curr) => (curr.length > prev ? curr.length : prev), 0);
  const style = {
    width: `${Math.min((longestLine * 0.8 + 5).toString(), (46 * 0.8 + 5).toString())}rem`,
    height: `${(messageEdited.split('\n').length * 1.8 + 1).toString()}rem`
  };
  return (
    <li key={message._id} id={bottom ? 'bottom' : null} style={{ height: style.height }}>
      <p className={`message ${float ? 'right' : 'left'}`} style={style}>
        {messageEdited}
      </p>
      {children}
    </li>
  );
};

export default ChatMessage;
