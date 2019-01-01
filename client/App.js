import React, { Component } from 'react';
import cookie from 'cookies-js';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import './styles/app.scss';
import 'rc-tooltip/assets/bootstrap_white.css';
import NoRegisterRoute from './components/NoRegisterRoute';
import Login from './modules/Login/Login';
import Home from './modules/Home/Home';
import Register from './modules/Register/Register';
import NavMenu from './components/Navbar/NavMenu';
import Profile from './modules/Profile';
import Users from './modules/Users';
import UserProfile from './modules/Users/UserProfile';
import Messages from './modules/Messages';
import Talk from './modules/Talk';
import Settings from './modules/Settings';

export default class App extends Component {
  constructor(props) {
    super(props);

    // Naprawić problem z zbyt wczesnym montowaniem NavMenu
  }

  render() {
    return (
      <div>
        <NavMenu />
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute path="/users/:id" component={UserProfile} />
          <PrivateRoute path="/messages/:id/:talking" component={Messages} />
          <PrivateRoute exact path="/users" component={Users} />
          <PrivateRoute path="/talk" component={Talk} />
          <PrivateRoute path="/settings" component={Settings}/>
          <NoRegisterRoute path="/login" component={Login} />
          <NoRegisterRoute path="/register" component={Register} />
        </Switch>
      </div>
    );
  }
}
