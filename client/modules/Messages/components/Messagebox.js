import React, {
  Component, useState, useEffect, useRef
} from 'react';
import { connect } from 'react-redux';
import ChatMessage from './ChatMessage';

const Messagebox = ({
  user, messages, manualScroll, setManualScroll, authUser, socket, className
}) => {
  const [loadingData, setLoadingData] = useState(false);
  // const [uploadFiles, setUploadFiles] = useState(false);
  const messageRef = useRef(null);

  function getNextMessages() {
    socket.emit('get_messages', {
      messageUser: user._id,
      part: messages.length
    });
  }

  function handleScroll() {
    if (messages.length < 25) {
      return undefined;
    }
    if (!loadingData && messageRef.scrollTop < 20) {
      setLoadingData(true);
      getNextMessages();
    }
    if (!manualScroll) {
      setManualScroll(true);
    }
  }

  function scrollDown() {
    try {
      const element = messageRef.current;
      element.scrollTop = element.scrollHeight - element.clientHeight;
    } catch (e) {

    }
  }

  useEffect(() => {
    setLoadingData(false);
    setManualScroll(false);
    scrollDown();
  }, [user]);

  useEffect(() => {
    if (manualScroll) {
      scrollDown();
    }
    setLoadingData(false);
  }, [messages]);


  if (user && user.hasOwnProperty('_id')) {
    const messagesRendered = messages.map((message, index, arr) => (<ChatMessage message={message} key={message._id} float={message.sender === authUser._id} bottom={index === arr.length - 1} />));
    return (
      <React.Fragment>
        <ul ref={messageRef} className={className} onScroll={handleScroll}>
          {loadingData
            ? <li>...</li>
            : null}
          {messagesRendered}
        </ul>
      </React.Fragment>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  authUser: state.userData.user,
  user: state.messages.user,
  socket: state.io.socket,
  manualScroll: state.messages.manualScroll
});
const mapDispatchToProps = dispatch => ({
  setManualScroll: manualScroll => dispatch({
    type: 'SET_MANUAL_SCROLL',
    manualScroll
  })
});
export default connect(mapStateToProps, mapDispatchToProps)(Messagebox);
