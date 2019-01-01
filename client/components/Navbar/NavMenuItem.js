import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class NavMenuItem extends React.Component {
  render() {
    return (
      <div className="nav-item">
        <Link to={this.props.location} id={this.props.locationName} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}/>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  initUser: user => dispatch({
    type: 'TOGGLE_INIT_USER',
    user
  })
});

export default connect(mapStateToProps, mapDispatchToProps)(NavMenuItem);
