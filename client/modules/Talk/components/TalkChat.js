import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { chunk } from '../util';

class TalkChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageText: '',
      previousLength: 0,
      manualScroll: false,
      loadingData: false
    };
  }

  startDrag = () => {

  }

  endDrag = () => {

  }

  componentDidMount () {
    window.addEventListener('dragstart', this.startDrag);
    window.addEventListener('dragend', this.endDrag);
  }

  componentWillUnmount () {
    window.removeEventListener('dragstart', this.startDrag);
    window.removeEventListener('dragend', this.endDrag);
  }

  handleScroll = () => {
    if (this.props.messages.length < 25) {
      return null;
    }
    if (!this.state.loadingData && this.refs.messages.scrollTop < 10) {
      this.setState({loadingData: true});
      this.props.socket.emit('get_messages', {messageUser: this.props.user._id, part: this.props.messages.length});
    }
    if (!this.state.manualScroll) {
      this.setState({ manualScroll: true });
    }
  }
  componentDidUpdate (prevProps) {
    if (prevProps.user._id !== this.props.user._id) {
      this.setState({ loadingData: false, manualScroll: false, previousLength: 0, messageText: '' });
    }
    if (this.props.messages.length !== this.state.previousLength) {
      if (!this.state.manualScroll) {
        let element = document.getElementById('bottom')
        if(element !== null) {
          element.scrollIntoView();
        }
      }
      this.setState({previousLength: this.props.messages.length, loadingData: false});
    }
  }

  filesUpload = (files) => {

  };

  formatMessage = () => {
    let seenNewLine = 0;
    const messageText = this.state.messageText;
    let newMessageText = '';
    for(let i = 0; i < messageText.length; i++) {
      if (messageText.charAt(i) === '\n') {
        seenNewLine = 0;
      }
      if(seenNewLine > 0 && seenNewLine % 46 === 0) {
        newMessageText += '\n';
      }
      newMessageText += messageText.charAt(i);
      seenNewLine++;
    }
    return newMessageText;
  }

  send = (e) => {
    if (this.state.messageText.trim() !== '') {
      const messageText = this.formatMessage();
      const message = {sender: this.props.authUser._id, text: messageText, messageUser: this.props.user._id};
      this.props.socket.emit('create_message', message);
      this.setState({messageText: '', manualScroll: false});
      e.preventDefault();
    }
  }

  onEdit = (value) => {
    this.setState({messageText: value});
  };

  render() {
    if (this.props.user.hasOwnProperty('_id')) {
      const messages = this.props.messages.map((message, index, arr) => (<ChatMessage message={message} key={message._id} float={message.sender === this.props.authUser._id} bottom={index === arr.length - 1 ? true : false} />));
      return (
        <React.Fragment>
          <ul ref="messages" className="message-container" onScroll={this.handleScroll}>
            {this.state.loadingData ? 
            <li>...</li>
             : null}
            {messages}
          </ul>
          <ChatInput disabled={this.props.disabledInput} messageText={this.state.messageText} send={this.send} onEdit={this.onEdit} />
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  authUser: state.userData.user,
  user: state.messages.user,
  socket: state.io.socket
});
export default connect(mapStateToProps)(TalkChat);
