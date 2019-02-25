import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateAuth, addAuthTags, deleteAuthTags, updateWithTags, updateAuthWithTags, getTags, updatePhoto, getUsers, getUsersByTags, getUser } from '../../axiosWrappers/users';
import SearchUserByName from './components/SearchUserByName';
import SearchUserByTags from './components/SearchUsersByTags';
import history from '../../history';
import _ from 'lodash';
import TeachByTags from './components/TeachByTags';
import TagTalkModal from '../../components/TagTalkModal';
import TagTalkTeacherModal from '../../components/TagTalkTeacherModal';
import MultiTalkTeacherModal from '../../components/MultiTalkTeacherModal';
import UsersSidebar from '../../components/UsersSidebar';
// Import Style


// Import Components

// Import Actions

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: '',
      topic: '',
      tagsFilter: '',
      teacherFilter: '',
      teacherModal: 0,

      dateDifference: 0,
      multiperson: false,
    };
    this.setListeners = false;
    this.multiInterval = null;
  }

  // add show new Talk request when added to Pool!!!

  componentDidUpdate (prevProps) {
    if (this.props.socket !== undefined && !this.setListeners) {
      this.setListeners = true;
      this.props.socket.removeListener('teacher_talks');
      this.props.socket.removeListener('selected_talk');
      this.props.socket.removeListener('starting_teaching');
      this.props.socket.removeListener('teacher_call');
      this.props.socket.removeListener('your_teacher_talk');
      this.props.socket.removeListener('multi_talks');
      this.props.socket.on('teacher_talks', (data) => {
        const talks = _.flatMap(data.teacherTalks, (o) => o.talks);
        this.setState({ dateDifference: data.date - Date.now});
        this.props.initTeacherTalks(talks);
        this.setState({ teacherModal: 1 });
      });
      this.props.socket.on('multi_talks', (data) => {
        const talks = _.flatMap(data.teacherTalks, (o) => o.talks);
        this.props.initTeacherTalks(talks);
        this.setState({ teacherModal: 2 });
      });
      this.props.socket.on('multi_joined_user', (data) => {
        this.setState({ teacherModal: 3 });
        this.props.initTeacherTalks([data.talk]);
      });
      this.props.socket.on('your_teacher_talk', (data) => {
        this.props.initTeacherTalks([data.talk]);
        if (data.talk.teacher) {
          this.setState({ teacherModal: 3 });
        } else {
          this.setState({ teacherModal: 4 });
        }
        setTimeout(() => {
          if (data.talk.teacher) {
            this.props.socket.emit('cancel_teacher_talk', { talk: data.talk });
            this.closeTeacherModal();
            this.props.initTeacherTalks([]);
          }
          //  else {
          //   this.props.socket.emit('start_multi_talk', { talk: data.talk });
          // }
        }, 120000);
      });
      this.props.socket.on('selected_talk', (data) => {
        this.props.removeTeacherTalk(data.teacherTalk);
      });
      this.props.socket.on('starting_teaching', (data) => {
        this.props.initTeacherTalks([]);
        this.props.initTalk(data.talk, true);
        history.push('/talk');
      });
      this.props.socket.on('teacher_call', (data) => {
        this.props.initTalk(data.talk, false);
        this.props.initTeacherTalks([]);
        history.push('/talk');
      });
    }
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

  componentWillUnmount () {
    try {
      clearInterval(this.multiInterval);
    } catch (e) {

    }
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

  searchByTags = (paid = false) => {
    if (this.state.multiperson) {
      this.props.socket.emit('search_multi_talk', { selectedTags: this.props.selectedTags, topic: this.state.topic || '', paid, multiperson: this.state.multiperson });
      this.multiInterval = setInterval(() => {
        this.props.socket.emit('search_multi_talk', { selectedTags: this.props.selectedTags, topic: this.state.topic || '', paid, multiperson: this.state.multiperson });
      }, 15000)
    } else {
      this.props.socket.emit('search_teacher', { selectedTags: this.props.selectedTags, topic: this.state.topic || '', paid, multiperson: this.state.multiperson });
    }
    this.props.openTalkTagModal();
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

  changeTagsFilter = (tagsFilter) => {
    this.setState({ tagsFilter });
  }

  changeTeacherFilter = (teacherFilter) => {
    this.setState({ teacherFilter });
  }

  talkToUser = (id) => {
    this.selectUser(id);
    this.selectUserToTalk(id);
  }

  searchForTeacherTalks = (paid = false) => {
    this.props.socket.emit('search_talks', { selectedTags: this.props.teacherTags, paid, multiperson: this.state.multiperson, topic: this.state.topic });
    // setTimeout(() => {}, )
  }

  closeTeacherModal = () => {
    this.setState({ teacherModal: 0 });
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
      talk: true,
      caller: this.state.caller
    });
  }

  render() {
    return (
      <div className="container center offset-8 hm full flex">
        <div className="w-30">
          <UsersSidebar />
        </div>
        <div className="w-40 h-con">
          <div className={'row-5 justify-center column' + (this.state.opened === '1' ? ' expanded' : '')}>
            <button className="btn huge" onClick={() => this.setState({opened: '1'})}>
              Search by name
            </button>
            {this.state.opened === '1' ? <SearchUserByName viewUserProfile={this.viewProfile} talkToUser={this.talkToUser} />: null}
          </div>
          <div className={'row-5 justify-center column' + (this.state.opened === '2' ? ' expanded' : '')}>
            <button className="btn huge" onClick={() => this.setState({opened: '2'})}>
              Search for teacher
            </button>
            {this.state.opened === '2' ? <SearchUserByTags search={this.searchByTags} changeTopic={this.changeTopic} initFilter={this.changeTagsFilter} tagsFilter={this.state.tagsFilter} userAmount={this.state.multiperson} changeUserAmount={(multiperson) => this.setState({ multiperson })} />: null}
          </div>
          {this.props.authUser !== undefined && this.props.authUser.tags !== undefined && this.props.authUser.tags.filter(tag => tag.level >= 5).length > 0 ?  
            <div className={'row-5 justify-center column' + (this.state.opened === '3' ? ' expanded' : '')}>
              <button className="btn huge" onClick={() => this.setState({opened: '3'})}>
                Teach
              </button>
              {this.state.opened === '3' ? <TeachByTags initFilter={this.changeTeacherFilter} tagsFilter={this.state.teacherFilter} search={this.searchForTeacherTalks} userAmount={this.state.multiperson} changeUserAmount={(multiperson) => this.setState({ multiperson })} changeTopic={this.changeTopic} /> : null}
            </div>
          : null}
        </div>
        <TagTalkModal opened={this.state.teacherModal === 4 && this.props.teacherTalks[0].user === this.props.authUser._id} closeModal={this.closeTeacherModal}/>
        <MultiTalkTeacherModal opened={this.state.teacherModal === 3} teacher={this.props.talks !== undefined && this.props.authUser._id === this.props.talks[0].user._id} closeModal={this.closeTeacherModal}/>
        <TagTalkTeacherModal dateDifference={this.state.dateDifference} opened={this.state.teacherModal === 1 || this.state.teacherModal === 2} multi={this.props.talks !== undefined && this.props.talks[0].teacher} closeModal={this.closeTeacherModal}/>
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
    teacherTalks: state.talk.teacherTalks,
    selectedTags: state.search.selectedTags,
    teacherTags: state.search.teacherTags,
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
    }),
    initTeacherTalks: (teacherTalks) => dispatch({
      type: 'INIT_TEACHER_TALKS',
      teacherTalks
    }),
    initTalk: (talk, creator) => dispatch({
      type: 'INIT_TEACHER_TALK',
      talk,
      creator
    }),
    removeTeacherTalk: (teacherTalk) => dispatch({
      type: 'REMOVE_TEACHER_TALK',
      teacherTalk
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Users);
