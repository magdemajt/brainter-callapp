export const init = (socket, callbacks) => {
  callbacks.forEach((cb) => {
    socket.on(cb.eventName, cb.func);
  });
  socket.on('message');
};
export const emitMessage = (socket, eventName, data) => {
  socket.emit(eventName, data);
};
export const onMessage = (socket, eventName, callback) => {
  socket.on(eventName, callback);
};
