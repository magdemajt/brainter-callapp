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
import Admin from './modules/Admin';
import Surveys from './modules/Surveys';
import Lessons from './modules/Lessons';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

export default function App() {
  const theme = createMuiTheme({
    palette: {
      primary: { main: '#2E75B6' },
      secondary: {
        main: '#ffd966',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavMenu />
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute path="/users/:id" component={UserProfile} />
        <PrivateRoute path="/messages/:id/:talking" component={Messages} />
        <PrivateRoute exact path="/users" component={Users} />
        <PrivateRoute path="/talk" component={Talk} />
        <PrivateRoute path="/settings" component={Settings} />
        <PrivateRoute path="/lessons" component={Lessons} />
        <NoRegisterRoute path="/login" component={Login} />
        <NoRegisterRoute path="/register" component={Register} />
        <PrivateRoute path="/admin" component={Admin} />
        <PrivateRoute path="/surveys" component={Surveys} />
      </Switch>
    </ThemeProvider>
  );
}
