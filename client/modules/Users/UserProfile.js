import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProfileIcon from '../Profile/components/ProfileIcon';
import UserDescription from '../Profile/components/UserDescription';
import UserTags from '../Profile/components/UserTags';
import ProfileSidebar from './components/Sidebar';
import history from '../../history';
// Import Style


// Import Components

// Import Actions

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    };
  }

  sendMessage = (talk = false) => {
    this.props.socket.emit('begin_chat', {
      participants: [
        this.props.authUser._id,
        this.props.user._id
      ],
      talk
    });
  }

  render() {
    return (
      <div className="container center offset-8 fluid height-60 flex">
        <div className="card">
          <div className="row-5">
            <ProfileIcon user={this.state.user} editing={false} />
            <UserDescription user={this.state.user} editing={false} />
          </div>
          <UserTags user={this.state.user} editing={false} />
        </div>
        <ProfileSidebar sendMessage={this.sendMessage}/>
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    user: state.search.user,
    tags: state.tags.tags,
    authUser: state.userData.user,
    socket: state.io.socket
  };
};
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initUser: (user) => dispatch({
      type: 'INIT_SEARCH_USER',
      user,
    }),
    initTags: (tags) => dispatch({
      type: 'INIT_TAGS',
      tags
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
