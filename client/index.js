import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { I18n } from 'react-polyglot';
import HttpsRedirect from 'react-https-redirect';
import App from './App';
import rootReducer from './store/reducers';
import history from './history';

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const locale = window.locale || 'en';
const phrases = {
  nav: {
    messages: 'Messages',
    users: 'Users',
    settings: 'Settings',
    profile: 'Profile'
  },
  talk: {
    mute: 'Mute',
    unmute: 'Unmute',
    video: 'Show video',
    novideo: 'Hide video',
    disconnect: 'Disconnect',
    answer: 'Answer call',
    reject: 'Reject call',
    talk: 'Talk',
    startCall: 'Start calling',
    cancelCall: 'Cancel call'
  },
  survey: {
    topic: 'Topic: ',
    teacher: 'Teacher: ',
    date: 'Date of lesson: ',
    info: 'If you change the talk your progress won\'t be saved, to change doubleclick the desired talk',
    culture: 'Rate personal culture of teacher',
    lesson: 'Your overall lesson rating',
    teaching: 'Rate teaching abilites of teacher',
    knowledge: 'Rate the understanding of taught subject',
    comment: 'Here enter your comment...',

  },
  user: {
    sendmsg: 'Send message'
  }
};
ReactDOM.render((
  <HttpsRedirect>
    <Provider store={store}>
      <Router history={history}>
        <I18n locale={locale} messages={phrases}>
          <App />
        </I18n>
      </Router>
    </Provider>
  </HttpsRedirect>
), document.getElementById('root'));
