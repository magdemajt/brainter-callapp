import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';

const UserSelection = ({
  messageUsers, onSelect, authUser, userM, t, messagePanel, getMoreMessageUsers, listRef
}) => {
  const newMessages = (messageUser) => {
    const newMsgs = _.filter(messageUser.messages, o => o.sender !== authUser._id && !o.seen.find(user => user === authUser._id));
    return newMsgs;
  };
  const names = (participants = []) => {
    let text = '';
    participants.filter(par => par._id !== authUser._id).forEach((user, index, array) => {
      text += user.name + (array.length - 1 !== index ? ', ' : '');
    });
    if (text === '') {
      text = t('messages.noUser');
    }
    return text;
  };
  const users = messageUsers.map((messageUser) => {
    // const newMsgs = [];
    const newMsgs = newMessages(messageUser);
    return (
      <li key={messageUser._id} onClick={() => onSelect(messageUser, newMsgs)} className={userM && userM.hasOwnProperty('_id') && userM._id === messageUser._id ? 'active' : ''}>
        {/* <img src={messageUser.photo.data} alt="User profile image" /> */}
        {names(messageUser.participants)}
        {newMsgs.length > 0 ? <span className="badge small">{newMsgs.length < 10 ? newMsgs.length : '+9'}</span> : null}
      </li>
    );
  });
  return (
    <div className="sidebar">
      <ul className="message-users-list" ref={listRef} onScroll={getMoreMessageUsers}>
        {messagePanel}
        {users}
      </ul>
    </div>
  );
};
const mapStateToProps = state => ({
  messageUsers: state.messages.messageUsers,
  userM: state.messages.user,
  authUser: state.userData.user
});
export default translate()(connect(mapStateToProps)(UserSelection));
