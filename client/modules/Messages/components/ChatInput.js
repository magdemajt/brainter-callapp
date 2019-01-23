import React, { Component } from 'react';
import { connect } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { translate } from 'react-polyglot';

const ChatInput = ({
  messageText,
  send,
  onEdit,
  t,
  disabled
}) => (
  <div className="container fixed bottom full-70">
    {/* <EmojiPicker onEmojiClick={emoji => onEdit(`${messageText}${String.fromCodePoint(`0x${emoji}`)}`)} /> */}
    <textarea disabled={disabled} cols="46" style={messageText.length > 46 ? { overflowY: 'scroll' } : { overflow: 'hidden' }} type="text" className="input nowidth" id="message-input" placeholder={t('messages.messageInput')} onChange={e => onEdit(e.target.value)} onKeyPress={(event) => { event.key === 'Enter' ? send(event) : null; }} value={messageText} />
    <button onClick={send} id="send-btn" />
  </div>
);

export default translate()(ChatInput);
