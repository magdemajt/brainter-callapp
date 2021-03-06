import React, { Component } from 'react';
import { connect } from 'react-redux';
import SurveyInputs from './components/SurveyInputs';
import { translate } from 'react-polyglot';
import SurveySelection from './components/SurveySelection';
// Import Style


// Import Components

// Import Actions

class Surveys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      talks: [],
      selectedTalk: {
        surveys: [{
          knowledge: 0,
          teaching: 0,
          culture: 0,
          comment: '',
          lesson: 0
        }]
      },
      edited: false
    };
  }

  componentDidMount() {
    this.props.socket.on('surveys', data => {
      this.setState({ talks: data.talks });
    });
    this.props.socket.emit('get_surveys');
  }

  changeSelectedTalk = (index) => {
    this.setState({ selectedTalk: { ...this.state.talks[index] }, edited: false });
  }

  finishSurvey = () => {
    this.props.socket.emit('finish_survey', { talk: this.state.selectedTalk });
    const newTalks = this.state.talks.filter(talk => {return this.state.selectedTalk._id !== talk._id});
    this.setState({ selectedTalk: newTalks[0], talks: newTalks });
  }

  changeComment = (comment) => {
    const talk = {...this.state.selectedTalk};
    talk.surveys[0].comment = comment;
    this.setState({ selectedTalk: talk, edited: true });
  }
  changeKnowledge = (knowledge) => {
    if (!(knowledge > 0 && knowledge <= 10)) {
      return null;
    }
    const talk = {...this.state.selectedTalk};
    talk.surveys[0].knowledge = knowledge;
    this.setState({ selectedTalk: talk, edited: true });
  }
  changeCulture = (culture) => {
    if (!(culture > 0 && culture <= 10)) {
      return null;
    }
    const talk = {...this.state.selectedTalk};
    talk.surveys[0].culture = culture;
    this.setState({ selectedTalk: talk, edited: true });
  }
  changeTeaching = (teaching) => {
    if (!(teaching  > 0 && teaching  <= 10)) {
      return null;
    }
    const talk = {...this.state.selectedTalk};
    talk.surveys[0].teaching = teaching;
    this.setState({ selectedTalk: talk, edited: true });
  }
  changeLesson = (lesson) => {
    if (!(lesson > 0 && lesson <= 10)) {
      return null;
    }
    const talk = {...this.state.selectedTalk};
    talk.surveys[0].lesson = lesson;
    this.setState({ selectedTalk: talk, edited: true });
  }


  render() {
    if (this.state.talks.length > 0) {
      return (
        <div className="container fluid offset-8 height-60 flex ml-1-5">
          <div className="card font-16">
            <div className="col-3">
              <SurveySelection edited={this.state.edited} talks={this.state.talks} currentId={this.state.selectedTalk._id} onChangeCurrent={this.changeSelectedTalk} />
            </div>
            <div className="col-6 ml-2">
              {this.state.edited ? this.props.t('survey.info') : null}
              <SurveyInputs knowledge={this.state.selectedTalk.surveys[0].knowledge}
                teaching={this.state.selectedTalk.surveys[0].teaching}
                culture={this.state.selectedTalk.surveys[0].culture}
                lesson={this.state.selectedTalk.surveys[0].lesson}
                comment={this.state.selectedTalk.surveys[0].comment}
                onChangeKnowledge={this.changeKnowledge}
                onChangeTeaching={this.changeTeaching}
                onChangeCulture={this.changeCulture}
                onChangeLesson={this.changeLesson}
                onChangeComment={this.changeComment}
              />
            </div>
            <div className="row-5 justify-center">
              <button type="button" onClick={this.finishSurvey} className={this.state.selectedTalk._id !== undefined ? 'btn' : 'btn disabled'}>Confirm</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="container center offset-8" style={{ fontSize: '1.6rem', fontFamily: 'CooperHewittBold' }}>
        No surveys to answer
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
      type: 'INIT_USER',
      user,
    }),
    initTags: (tags) => dispatch({
      type: 'INIT_TAGS',
      tags
    }),
    initPermission: (permission) => dispatch({
      type: 'INIT_PERMISSION',
      permission
    })
  };
};
/* eslint-enable */

export default translate()(connect(mapStateToProps, mapDispatchToProps)(Surveys));
