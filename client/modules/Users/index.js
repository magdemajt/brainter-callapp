import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateAuth, addAuthTags, deleteAuthTags, updateWithTags, updateAuthWithTags, getTags, updatePhoto, getUsers, getUsersByTags, getUser } from '../../axiosWrappers/users';
import SearchUserByName from './components/SearchUserByName';
import SearchUserByTags from './components/SearchUsersByTags';
import history from '../../history';
// Import Style


// Import Components

// Import Actions

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: '',
      topic: ''
    };
  }

  componentDidMount() {
    getTags((res) => {
      if (res.data) {
        this.props.initTags(res.data);
        this.setState({ filteredTags: res.data });
      }
    })
    getUsers((res) => {
      if (res.data) {
        this.props.initUsers(res.data);
      }
    })
  }

  selectUser = (id) => {
    let indexUser = 0;
    this.props.users.find((us, index) => {
      if (id === us._id) {
        indexUser = index;
        return true;
      }
      return false;
    });
    this.props.initUser(this.props.users[indexUser]);
  }

  changeTopic = (topic) => {
    this.setState({ topic: topic.trim() });
  }

  searchByTags = () => {
    this.props.socket.emit('search_talk_tags', { selectedTags: this.props.selectedTags });
    this.props.openTalkTagModal();
    getUsersByTags(this.props.selectedTags, (res) => {
      this.props.initUser(res.data);
      this.selectUserToTalk(res.data._id);
    })
  }

  viewProfile = (id) => {
    this.selectUser(id);
    if (this.props.authUser._id === id) {
      history.push('/profile')
      return null;
    }
    getUser(id, (res) => {
      const tags = res.data.tags.map(tag => {
        return Object.assign({}, { ...tag.tag, level: tag.level });
      })
      this.props.initUser(Object.assign({}, res.data, { tags }));
      history.push(`/users/${id}`);
    })
  }

  talkToUser = (id) => {
    this.selectUser(id);
    this.selectUserToTalk(id);
  }
  selectUserToTalk = (id) => {
    if (this.props.authUser._id === id) {
      history.push('/profile')
      return null;
    }
    this.props.socket.emit('begin_chat', {
      participants: [
        this.props.authUser._id,
        id
      ],
      talk: true
    });
  }

  render() {
    return (
      <div className="container center offset-15">
        <div className={'row-5 justify-center column' + (this.state.opened === '1' ? ' expanded' : '')}>
          <button className="btn huge" onClick={() => this.setState({opened: '1'})}>
            Search by name
          </button>
          {this.state.opened === '1' ? <SearchUserByName viewUserProfile={this.viewProfile} talkToUser={this.talkToUser} />: null}
        </div>
        <div className={'row-5 justify-center column' + (this.state.opened === '2' ? ' expanded' : '')}>
          <button className="btn huge" onClick={() => this.setState({opened: '2'})}>
            Search user to talk to
          </button>
          {this.state.opened === '2' ? <SearchUserByTags search={this.searchByTags} changeTopic={this.changeTopic} />: null}
        </div>
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    users: state.search.users,
    authUser: state.userData.user,
    tags: state.tags.tags,
    selectedTags: state.search.selectedTags,
    socket: state.io.socket,
  };
};
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initUsers: (users) => dispatch({
      type: 'INIT_SEARCH_USERS',
      users,
    }),
    initUser: (user) => dispatch({
      type: 'INIT_SEARCH_USER',
      user,
    }),
    initTags: (tags) => dispatch({
      type: 'INIT_TAGS',
      tags
    }),
    openTalkTagModal: () => dispatch({
      type: 'OPEN_TAG_TALK'
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Users);
