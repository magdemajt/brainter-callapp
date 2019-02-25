import React, { Component } from 'react';
import { connect } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { translate } from 'react-polyglot';
import Dropzone from 'react-dropzone';

const ChatInput = ({
  messageText,
  send,
  onEdit,
  t,
  disabled,
  dragAndDrop,
  onDrop,
  changeUploadFiles
}) => (
  <div className="container fixed bottom full-70 flex justify-center">
    {/* <EmojiPicker onEmojiClick={emoji => onEdit(`${messageText}${String.fromCodePoint(`0x${emoji}`)}`)} /> */}
    {dragAndDrop
      ? (
        <Dropzone
          style={{
            height: '4rem', width: '30%', minWidth: '40rem', position: 'relative', borderWidth: '2px', borderStyle: 'dashed', borderColor: 'black', borderRadius: '.5rem', margin: '.8rem 0'
          }}
          onDrop={onDrop}
        />
      )
      : (
        <textarea
          disabled={disabled}
          cols="46"
          style={messageText.length > 46 ? { overflowY: 'scroll', padding: '.8rem 2rem' } : { overflow: 'hidden', padding: '.8rem 2rem' }}
          type="text"
          className="input nowidth"
          id="message-input"
          placeholder={t('messages.messageInput')}
          onChange={e => onEdit(e.target.value)}
          onKeyPress={(event) => { event.key === 'Enter' ? send(event) : null; }}
          value={messageText}
        />
      ) }
    <button onClick={send} id="send-btn" type="button" />
    {/* <button onClick={changeUploadFiles} className={dragAndDrop ? 'noFilesButton' : 'filesButton'} type="button">Files</button> */}
  </div>
);

export default translate()(ChatInput);
