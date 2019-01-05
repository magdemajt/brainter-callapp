import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProfileIcon from './components/ProfileIcon';
import UserDescription from './components/UserDescription';
import ProfileToolbar from './components/Toolbar';
import UserTags from './components/UserTags';
import TagsFilter from './components/TagsFilter';
import { updateAuth, addAuthTags, deleteAuthTags, updateWithTags, updateAuthWithTags, getTags, updatePhoto } from '../../axiosWrappers/users';
// Import Style


// Import Components

// Import Actions

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      user: {...this.props.user},
      filteredTags: [...this.props.tags],
      filter: ''
    };
  }

  componentDidMount() {
    getTags((res) => {
      if (res.data && this.props.tags.length === 0) {
        this.props.initTags(res.data);
        this.setState({ filteredTags: res.data });
      }
    })
  }

  changeUserTags = (tag, operationType) => {
    let tags = [];
    if (operationType === 'add') {
      tags = this.state.user.tags.concat(tag);
    } else {
      tags = this.state.user.tags.filter(tagEl => {
        return tag._id !==  tagEl._id 
      });
    }
    this.setState({user: Object.assign({}, this.state.user, {tags})});
  }

  uploadImage = (files) => {
    updatePhoto(files[0], (res) => {
      this.setState({ user: Object.assign({}, this.state.user, { photo: res.data })});
      this.props.initUser(this.state.user);
    })
  }
 
  updateUserTags = (tag, index) => {
    const newTags = this.state.user.tags.map((elem, i) => {
      if (i === index) {
        return tag;
      }
      return elem;
    });
    this.setState({user: Object.assign({}, this.state.user, {tags: newTags})});
  }

  changeUserDesc = (e) => {
    this.setState({user: Object.assign({}, this.state.user, {desc: e.target.value})});
  }
  commitChanges = () => {
    updateAuthWithTags({
      //addTags: this.props.tagsToAdd,
      tags: this.state.user.tags,
      //removeTags: this.props.tagsToRemove,
      desc: this.state.user.desc,
      photo: this.state.user.photo,
    }, (res) => {
      this.props.initUser(this.state.user)
      
      this.setState({editing: false});
    })
  }

  changeEdit = () => {
    if (!this.state.editing) {
      this.setState({editing: true});
    } else {
      this.commitChanges();
    }
  }

  filterTags = (e) => {
    const filteredTags = this.props.tags.filter(tag => {
      return tag.name.includes(e.target.value.toLowerCase());
    });
    this.setState({ filteredTags });
  }

  render() {
    return (
      <div className="container center offset-15 fluid height-60 flex space-between">
        <div className="card">
          <div className="row">
            <ProfileIcon user={this.state.user} editing={this.state.editing} onDrop={this.uploadImage} />
            <UserDescription user={this.state.user} editing={this.state.editing} onChangeProp={this.changeUserDesc} />
          </div>
          <UserTags user={this.state.user} onChangeProp={this.changeUserTags} updateExisting={this.updateUserTags} filteredTags={this.state.filteredTags} editing={this.state.editing} />
          {this.state.editing ? <TagsFilter onChange={this.filterTags} /> : null}
        </div>
        <ProfileToolbar editing={this.state.editing} changeEdit={this.changeEdit}/>
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    user: state.userData.user,
    tags: state.tags.tags
  };
};
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
