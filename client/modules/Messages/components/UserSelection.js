import React, { Component } from 'react';
import { connect } from 'react-redux';

const UserSelection = ({
  messageUsers, onSelect, authUser, userM
}) => {
  const names = (participants) => {
    let text = '';
    participants.filter(par => par._id !== authUser._id).forEach((user, index, array) => {
      text += user.name + (array.length - 1 !== index ? ', ' : '');
    });
    return text;
  };
  const users = messageUsers.map(messageUser => (
    <li key={messageUser._id} onClick={() => onSelect(messageUser)} className={userM.hasOwnProperty('_id') && userM._id === messageUser._id ? 'active' : ''}>
      {/* <img src={messageUser.photo.data} alt="User profile image" /> */}
      {names(messageUser.participants)}
    </li>
  ));
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
export default connect(mapStateToProps)(UserSelection);
