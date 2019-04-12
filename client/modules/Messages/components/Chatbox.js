import React, {
  Component, useState, useEffect, useRef
} from 'react';
import { connect } from 'react-redux';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import Messagebox from './Messagebox';

const Chatbox = (props) => {
  if (props.user && props.user.hasOwnProperty('_id')) {
    return (
      <React.Fragment>
        <Messagebox className="message-container" messages={props.messages} />
        <ChatInput disabled={props.disabledInput} className="container fixed bottom full-70 flex justify-center" />
      </React.Fragment>
    );
  }
  return null;
};

// class Chatbox extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       messageText: '',
//       previousLength: 0,
//       manualScroll: false,
//       loadingData: false,
//       uploadFiles: false,
//     };
//     this.messageRef = React.createRef();
//   }


//   // endDrag = () => {

//   // }

//   // componentDidMount () {
//   //   window.addEventListener('dragstart', this.startDrag);
//   //   window.addEventListener('dragend', this.endDrag);
//   // }

//   // componentWillUnmount () {
//   //   window.removeEventListener('dragstart', this.startDrag);
//   //   window.removeEventListener('dragend', this.endDrag);
//   // }

//   handleScroll = () => {
//     if (this.props.messages.length < 25) {
//       return null;
//     }
//     if (!this.state.loadingData && this.messageRef.scrollTop < 20) {
//       this.setState({loadingData: true});
//       this.props.socket.emit('get_messages', {messageUser: this.props.user._id, part: this.props.messages.length});
//     }
//     if (!this.state.manualScroll) {
//       this.setState({ manualScroll: true });
//     }
//   }
//   componentDidUpdate (prevProps) {
//     if (prevProps.user._id !== this.props.user._id) {
//       this.setState({ loadingData: false, manualScroll: false, previousLength: 0, messageText: '' });
//       let element = this.messageRef.current;
//       element.scrollTop = element.scrollHeight - element.clientHeight;
//     }
//     if (this.props.messages.length !== this.state.previousLength) {
//       if (!this.state.manualScroll) {
//         let element = this.messageRef.current;
//         element.scrollTop = element.scrollHeight - element.clientHeight;
//       }
//       this.setState({previousLength: this.props.messages.length, loadingData: false});
//     }
//   }

//   filesUpload = (files) => {
//     console.log(files)
//   };

//   formatMessage = () => {
//     let seenNewLine = 0;
//     let newMessageText = '';
//     for(let i = 0; i < messageText.length; i++) {
//       if (messageText.charAt(i) === '\n') {
//         seenNewLine = 0;
//       }
//       if(seenNewLine > 0 && seenNewLine % 46 === 0) {
//         newMessageText += '\n';
//       }
//       newMessageText += messageText.charAt(i);
//       seenNewLine++;
//     }
//     return newMessageText;
//   }

//   send = (e) => {
//     if (this.state.messageText.trim() !== '') {
//       const messageText = this.formatMessage();
//       const message = {sender: this.props.authUser._id, text: messageText, messageUser: this.props.user._id};
//       this.props.socket.emit('create_message', message);
//       this.setState({messageText: '', manualScroll: false});
//       e.preventDefault();
//     }
//   }

//   onEdit = (value) => {
//     this.setState({messageText: value});
//   };

//   render() {
//     if (this.props.user.hasOwnProperty('_id')) {
//       const messages = this.props.messages.map((message, index, arr) => (<ChatMessage message={message} key={message._id} float={message.sender === this.props.authUser._id} bottom={index === arr.length - 1 ? true : false} />));
//       return (
//         <React.Fragment>
//           <ul ref={this.messageRef} className="message-container" onScroll={this.handleScroll}>
//             {this.state.loadingData ?
//             <li>...</li>
//              : null}
//             {messages}
//           </ul>
//           <ChatInput disabled={this.props.disabledInput} messageText={this.state.messageText} send={this.send} onEdit={this.onEdit} onDrop={this.filesUpload} dragAndDrop={this.state.uploadFiles} changeUploadFiles={this.changeUploadFiles}/>
//         </React.Fragment>
//       );
//     } else {
//       return null;
//     }
//   }
// }

const mapStateToProps = state => ({
  authUser: state.userData.user,
  user: state.messages.user,
  socket: state.io.socket
});
export default connect(mapStateToProps)(Chatbox);
