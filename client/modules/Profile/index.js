import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProfileIcon from './components/ProfileIcon';
import UserDescription from './components/UserDescription';
import ProfileToolbar from './components/Toolbar';
import UserTags from './components/UserTags';
import TagsFilter from './components/TagsFilter';
import { updateAuth, addAuthTags, deleteAuthTags, updateWithTags, updateAuthWithTags, getTags, updatePhoto } from '../../axiosWrappers/users';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/styles';
import ModalEditTags from './components/EditTags';

// Import Style
const styles = theme => ({
  card: {
    maxWidth: '80%',
    marginTop: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

// Import Components

// Import Actions

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      user: {...this.props.user},
      filteredTags: [...this.props.tags],
      filter: '',
      expanded: false,
      editingTags: false
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

  updateUserTags = (tags) => {
    this.setState({user: Object.assign({}, this.state.user, {tags})});
  }

  uploadImage = (files) => {
    updatePhoto(files[0], (res) => {
      this.setState({ user: Object.assign({}, this.state.user, { photo: res.data })});
      this.props.initUser(this.state.user);
    })
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

  filterTags = (value) => {
    const filteredTags = this.props.tags.filter(tag => {
      return tag.name.includes(value.toLowerCase());
    });
    this.setState({ filteredTags });
  }

  render() {
    const { classes } = this.props;
    const { expanded, user, editingTags } = this.state;
    const handleExpandClick = () => this.setState({ expanded: !expanded });

    return (
      <div>
          <Card className={classes.card}>
            <CardHeader
            avatar={(
              <ProfileIcon user={user} editing={this.state.editing} onDrop={this.uploadImage} />  
            )}
            action={(
              <IconButton aria-label="Settings">
                <MoreVertIcon />
              </IconButton>
            )}
            title={user.name}
            subheader={(new Date()).getFullYear()}
          />
          <CardContent>
            <UserTags user={this.state.user} updateUserTags={this.updateUserTags} filteredTags={this.state.filteredTags} editing={this.state.editing} />
            <UserDescription user={this.state.user} editing={this.state.editing} onChangeProp={this.changeUserDesc} />
            <ModalEditTags opened={editingTags} filterTags={this.filterTags} user={this.state.user} updateUserTags={this.updateUserTags} filteredTags={this.state.filteredTags} closeEditTags={() => this.setState({ editingTags: false })}/>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                minutes.
              </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                minutes more. (Discard any mussels that don’t open.)
              </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then serve.
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
        <ProfileToolbar editing={this.state.editing} changeEdit={this.changeEdit} changeEditTags={() => this.setState({ editingTags: true, editing: true })} />
      </div>
    );
    return (
      <div className="container center offset-8 fluid height-60 flex space-between">
        <div className="card">
          <div className="row-5">
            
          </div>
          
        </div>
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Profile));
