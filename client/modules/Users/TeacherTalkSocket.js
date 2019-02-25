import _ from 'lodash';
import history from '../../history';

class TeacherTalkSocket {
  constructor(props) {
    this.socket = props.socket;
  }

  setupListeners(initTeacherTalks, setState) {
    this.socket.removeListener('teacher_talks');
    this.socket.removeListener('selected_talk');
    this.socket.removeListener('starting_teaching');
    this.socket.removeListener('teacher_call');
    this.socket.removeListener('your_teacher_talk');
    this.socket.on('teacher_talks', (data) => {
      const talks = _.flatMap(data.teacherTalks, o => o.talks);
      setState({ dateDifference: data.date - Date.now });
      initTeacherTalks(talks);
      setState({ teacherModal: true });
    });
    this.socket.on('your_teacher_talk', (data) => {
      initTeacherTalks([data.talk]);
      setTimeout(() => {
        if (data.talk.teacher) {
          this.socket.emit('cancel_teacher_talk', { talk: data.talk });
          initTeacherTalks([]);
        } else {
          this.socket.emit('start_teacher_talk', { talk: data.talk });
        }
      }, 120000);
    });
    this.socket.on('selected_talk', (data) => {
      this.props.removeTeacherTalk(data.teacherTalk);
    });
    this.socket.on('starting_teaching', (data) => {
      initTeacherTalks([]);
      this.props.initTalk(data.talk, true);
      history.push('/talk');
    });
    this.socket.on('teacher_call', (data) => {
      this.props.initTalk(data.talk, false);
      initTeacherTalks([]);
      history.push('/talk');
    });
  }
}

export default TeacherTalkSocket;
