import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { translate } from 'react-polyglot';
import Dropzone from 'react-dropzone';
import { IconButton, TextField, makeStyles } from '@material-ui/core';
import Send from '@material-ui/icons/Send';

const ChatInput = ({
  socket, authUser, user, setManualScroll, className, disabled = false, t, onDrop
}) => {
  const [messageText, setMessageText] = useState('');
  const [dragAndDrop, setDragAndDrop] = useState(false);

  const classes = makeStyles(theme => ({
    root: {
      marginLeft: theme.spacing(1)
    }
  }))();

  useEffect(() => {
    setMessageText('');
  }, [user]);

  function formatMessage() {
    let seenNewLine = 0;
    let newMessageText = '';
    for (let i = 0; i < messageText.length; i++) {
      if (messageText.charAt(i) === '\n') {
        seenNewLine = 0;
      }
      if (seenNewLine > 0 && seenNewLine % 46 === 0) {
        newMessageText += '\n';
      }
      newMessageText += messageText.charAt(i);
      seenNewLine++;
    }
    return newMessageText;
  }

  function send(e) {
    if (messageText.trim() !== '') {
      const text = formatMessage();
      const message = { sender: authUser._id, text, messageUser: user._id };
      socket.emit('create_message', message);
      setMessageText('');
      setManualScroll(false);
      e.preventDefault();
    }
  }
  return (
    <React.Fragment>
      {/* <EmojiPicker onEmojiClick={emoji => onEdit(`${messageText}${String.fromCodePoint(`0x${emoji}`)}`)} /> */}
      {/* {dragAndDrop
      ? (
        <Dropzone
          style={{
            height: '4rem', width: '30%', minWidth: '40rem', position: 'relative', borderWidth: '2px', borderStyle: 'dashed', borderColor: 'black', borderRadius: '.5rem', margin: '.8rem 0'
          }}
          onDrop={onDrop}
        />
      )
      : ( */}
      <TextField
        spellCheck
        id="outlined-dense-multiline"
        label={t('messages.messageInput')}
        margin="dense"
        variant="outlined"
        disabled={disabled}
        type="text"
        multiline
        onChange={e => setMessageText(e.target.value)}
        onKeyPress={(event) => { event.key === 'Enter' ? send(event) : null; }}
        value={messageText}
        rowsMax="6"
      />
      {/* ) } */}
      <IconButton onClick={send} className={classes.root}>
        <Send />
      </IconButton>
      {/* <button onClick={changeUploadFiles} className={dragAndDrop ? 'noFilesButton' : 'filesButton'} type="button">Files</button> */}
    </React.Fragment>
  );
};


// const ChatInput = ({
//   messageText,
//   send,
//   onEdit,
//   t,
//   disabled,
//   dragAndDrop,
//   onDrop,
//   changeUploadFiles
// }) => (
//   <div className="container fixed bottom full-70 flex justify-center">
//     {/* <EmojiPicker onEmojiClick={emoji => onEdit(`${messageText}${String.fromCodePoint(`0x${emoji}`)}`)} /> */}
//     {dragAndDrop
//       ? (
//         <Dropzone
//           style={{
//             height: '4rem', width: '30%', minWidth: '40rem', position: 'relative', borderWidth: '2px', borderStyle: 'dashed', borderColor: 'black', borderRadius: '.5rem', margin: '.8rem 0'
//           }}
//           onDrop={onDrop}
//         />
//       )
//       : (
//         <textarea
//           disabled={disabled}
//           cols="46"
//           style={messageText.length > 46 ? { overflowY: 'scroll', padding: '.8rem 2rem' } : { overflow: 'hidden', padding: '.8rem 2rem' }}
//           type="text"
//           className="input nowidth"
//           id="message-input"
//           placeholder={t('messages.messageInput')}
//           onChange={e => onEdit(e.target.value)}
//           onKeyPress={(event) => { event.key === 'Enter' ? send(event) : null; }}
//           value={messageText}
//         />
//       ) }
//     <button onClick={send} id="send-btn" type="button" />
//     {/* <button onClick={changeUploadFiles} className={dragAndDrop ? 'noFilesButton' : 'filesButton'} type="button">Files</button> */}
//   </div>
// );
const mapStateToProps = state => ({
  authUser: state.userData.user,
  user: state.messages.user,
  socket: state.io.socket,
});
const mapDispatchToProps = dispatch => ({
  setManualScroll: manualScroll => dispatch({
    type: 'SET_MANUAL_SCROLL',
    manualScroll
  })
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ChatInput));
