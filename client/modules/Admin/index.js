import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTags } from '../../axiosWrappers/users';
import history from '../../history';
import Toolbar from './components/Toolbar';
import { getMessageStats, getUserStats, getMessageUserStats, addTag } from '../../axiosWrappers/admin';
import Timepicker from './components/Timepicker';
import AddTag from './components/AddTag';
import AliasList from './components/AliasList';
// Import Style


// Import Components

// Import Actions

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 0,
      users: [],
      messages: [],
      messageUsers: [],
      time: Date.now(),
      tagName: '',
      aliases: [],
      aliasName: ''
    };
  }

  componentDidMount() {
    const currentDate = new Date().getTime();
    this.getDataForDate(currentDate);
  }

  getDataForDate = (date) => {
    getMessageStats(date, (res) => {
      this.setState({ messages: res.data });
    }, err => {});
    getUserStats(date, (res) => {
      this.setState({ users: res.data });
    }, err => {});
    getMessageUserStats(date, (res) => {
      this.setState({ users: res.data });
    }, err => {});
  }

  changeTagName = (name) => {
    this.setState({tagName: name});
  }

  changeAliasName = (name) => {
    this.setState({aliasName: name});
  }

  editAlias = (index) => {
    this.setState({aliasName: this.state.aliases[index]});
    this.removeAlias(index);
  }

  addAlias = () => {
    if (!this.state.aliases.find(el => { return el.toLowerCase() === this.state.aliasName.trim().toLowerCase()})) {
      this.setState({ aliases: this.state.aliases.concat(this.state.aliasName.trim()) });
    }
  }
  
  removeAlias = (index) => {
    this.setState({ aliases: this.state.aliases.filter((al, i) => { return index !== i; }) })
  }

  submitTag = () => {
    addTag(this.state.tagName.trim(), this.state.aliases, (res) => {
      if (res.data) {
        this.setState({aliases: [], aliasName: '', tagName: ''});
      }
    })
  }

  changeActive = (which) => {
    this.setState({currentView: which});
  }

  changeTime = (e) => {
    const time = new Date(e.target.value);
    this.getDataForDate(time.getTime());
    this.setState({ time });
  }
  
  render() {
    let view = null;
    if (this.props.permission === 0) {
      history.push('/');
    }
    switch (this.state.currentView) {
      case 0: {
        view = (
          <React.Fragment>
            <AddTag confirm={this.submitTag} addAlias={this.addAlias} changeAlias={this.changeAliasName} alias={this.state.aliasName} changeValue={this.changeTagName} tagName={this.state.tagName}/>
            <AliasList editAlias={this.editAlias} removeAlias={this.removeAlias} aliases={this.state.aliases}/>
          </React.Fragment>
        );
        break;
      }
      // case 1: {
      //   <UserStats />
      //   break;
      // }
      // case 2: {
      //   <MessageStats />
      //   break;
      // }
      // case 3: {
      //   <MessageUserStats />
      //   break;
      // }
    }
    return (
      <div className="container fluid offset-15 flex ml-1-5 height-60">
        <div className="card">
          {this.state.currentView > 0 ? <Timepicker changeTime={this.changeTime} value={this.state.time} /> : null}
          {view}
        </div>
        <Toolbar changeSettingPage={this.changeActive} />
      </div>
    );
    
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    permission: state.admin.permission
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
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
