import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';

const UserSelection = ({
  messageUsers, onSelect, authUser, userM, t
}) => {
  const newMessages = (messageUser) => {
    const newMsgs = _.filter(messageUser.messages, (o) => { return o.sender === authUser._id && o.seen.find(user => user._id === authUser._id)  });
    return newMsgs;
  };
  const names = (participants) => {
    let text = '';
    participants.filter(par => par._id !== authUser._id).forEach((user, index, array) => {
      text += user.name + (array.length - 1 !== index ? ', ' : '');
    });
    if (text === '') {
      text = t('messages.noUser');
    }
    return text;
  };
  const users = messageUsers.map(messageUser => {
    const newMsgs = [];
    //const newMsgs = newMessages(messageUser);
    return (<li key={messageUser._id} onClick={() => onSelect(messageUser, newMsgs)} className={userM.hasOwnProperty('_id') && userM._id === messageUser._id ? 'active' : ''}>
      {/* <img src={messageUser.photo.data} alt="User profile image" /> */}
      {names(messageUser.participants)}
      {newMsgs.length > 0 ? <span>{newMsgs.length}</span> : null}
    </li>)
  });
  return (
    <div className="sidebar">
      <ul className="message-users-list">
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
