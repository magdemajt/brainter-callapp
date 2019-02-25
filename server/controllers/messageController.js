const Message = require('../models/message');
const User = require('../models/user');
const MessageUser = require('../models/messageUser');

exports.beginChat = (io, socket, data) => {
  const participants = data.participants.find(part => part === socket.authUser._id) !== undefined ? data.participants : data.participants.concat(socket.authUser._id);
  MessageUser.createOrReturn(participants, socket.authUser._id, (messageUsers) => {
    // Poprawić na messageUser, gdzie jest dwóch użytkowników
    socket.emit('message_user_new', { messageUser: messageUsers[0], talk: data.talk });
  });
};
exports.createNewMessage = (io, socket, data) => {
  const message = new Message({
    sender: socket.authUser._id,
    seen: [],
    text: data.text,
    messages: []
  });
  message.save().then(() => {
    socket.emit('message', {
      messageUser: data.messageUser,
      sender: socket.authUser._id,
      text: data.text,
      _id: message._id,
      seen: []
    });
    MessageUser.addMessage(data.messageUser, message._id, (mu) => {
      mu.participants.forEach((part) => {
        if (part.toString() !== socket.authUser._id.toString()) {
          io.to(`room_${part}`).emit('message', {
            messageUser: data.messageUser,
            sender: socket.authUser._id,
            text: data.text,
            _id: message._id,
            seen: []
          });
        }
      });
    });
  });
};

exports.seenMessages = (io, socket, data) => {
  const messagesFromData = data.messages || [];
  messagesFromData.forEach((msg) => {
    let count = 0;
    Message.updateOne({ _id: msg._id, seen: { $ne: socket.authUser._id } }, { $push: { seen: socket.authUser._id } }).then((t) => {
      count++;
    })
      .catch(err => console.log(err));
  });
};

exports.getMessages = (io, socket, data) => {
  MessageUser.findMessages(data.messageUser, data.part || 0, (messages) => {
    socket.emit('messages', messages);
  });
};

exports.getMessageUsers = (io, socket, data) => {
  MessageUser.findMessageUsers(socket.authUser._id, data.part, (messageUsers) => {
    socket.emit('message_users', messageUsers);
  });
};
