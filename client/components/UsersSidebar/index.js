/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';

class UsersSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recUsers: [] //recommended users to talk
    };
    this.reloadInterval = null;
  }

  componentDidMount () {
    if (this.props.socket !== null) {
      this.props.socket.removeListener('recom_users');
      this.reloadInterval = setInterval(() => {
        this.props.socket.emit('get_recom_users');
      }, 5000);
      this.props.socket.on('recom_users', (data) => {
        this.setState({ recUsers: data.users });
      });
      this.props.socket.emit('get_recom_users');
    }
  }

  componentWillUnmount () {
    clearInterval(this.reloadInterval);
    this.reloadInterval = null;
  }

  sendMessage = (talk = false, user) => {
    this.props.initSearchUser(user);
    this.props.socket.emit('begin_chat', {
      participants: [
        this.props.authUser._id,
        user._id
      ],
      talk
    });
  }


  render () {
    const users = this.state.recUsers.map(user => {
      return (
        <li key={user._id} className="flex-el">
          <div style={{position: 'relative' }}>
            <img src={`/api/user/photo/${user._id}`} />
            <span className={user.active ? 'user-active small' : 'user-active small not'}></span>
          </div>
          {user.name}
          <div>
            <Tooltip trigger={['hover']} placement="left" overlay={this.props.t('user.sendmsg')}>
              <button className="messageButton" type="button" onClick={() => this.sendMessage(false, user)} />
            </Tooltip>
            <Tooltip placement="top" overlay={this.props.t('user.call')} trigger={['hover']}>
              <button type="button" className="call-button" onClick={() => this.sendMessage(true, user)} />
            </Tooltip>
          </div>
        </li>
      );
    });

    return (
      <div className="sidebar no-small-screen">
        <ul className="users-list no-margin">
          {users}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  socket: state.io.socket,
  talk: state.talk.talk,
  messageUsers: state.messages.messageUsers,
  messageUser: state.talk.messageUser,
  authUser: state.userData.user
});
const mapDispatchToProps = dispatch => {
  return {
    startCalling: (messageUser) => dispatch({
      type: 'START_CALLING',
      messageUser
    }),
    initSearchUser: (user) => dispatch({
      type: 'INIT_SEARCH_USER',
      user
    })
  };
}
export default translate()(connect(mapStateToProps, mapDispatchToProps)(UsersSidebar));
/* eslint-enable */
