import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { flattenDeep } from 'lodash';

const TeacherOptions = ({
  socket, authUser
}) => {
  const [schedule, setSchedule] = useState([]);
  const [tagFilter, setTagFilter] = useState('');
  const [filteredTags, setFilteredTags] = useState([]);
  useEffect(() => {
    socket.on('found_tags', (data) => {
      setFilteredTags(data.tags);
    });
    socket.on('got_teaching_in', (data) => {
      setSchedule(flattenDeep(data.teachingIn));
    });
    return () => {
      socket.removeListnener('found_tags');
      socket.removeListnener('got_teaching_in');
    };
  }, [socket]);
  useEffect(() => {
    // Load user.teachingIn data from DB
    socket.emit('get_teaching_in');
  }, []);
  useEffect(() => {
    socket.emit('find_tags_with_filter', { tagFilter, forTeaching: true });
  }, [tagFilter]);

  function addTagToSchedule(index) {
    const found = schedule.find(tag => tag._id === filteredTags[index]._id);
    if (found === undefined) {
      setSchedule(schedule.concat({ ...filteredTags[index], price: null }));
    }
  }
  function removeTagFromSchedule(index) {
    setSchedule(schedule.filter((tag, ind) => ind !== index));
  }
  function editTagHoursInSchedule(value, index) {
    const scheduleWithEdittedTag = schedule.map((tag, ind) => {
      if (ind === index) {
        return { ...tag, price: value };
      }
      return tag;
    });
    setSchedule(scheduleWithEdittedTag);
  }
  function saveOptionsToDB() {
    if (schedule.length > 0) {
      socket.emit('save_teaching_in', { tags: schedule });
    }
  }
  return (
    <React.Fragment>
      <input className="input" type="text" placeholder="Search for tags..." value={tagFilter} onChange={e => setTagFilter(e.target.value)} />
      {'Select things you want to teach.'}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: '1.6rem', fontFamily: 'CooperHewittBook'
      }}
      >

        <ul style={{ listStyleType: 'none' }}>
          { filteredTags.filter(filteredTag => schedule.find(tag => tag._id === filteredTag._id) === undefined).map((tag, index) => (<li style={{ padding: '.5rem', cursor: 'pointer' }} key={tag.name} onClick={() => addTagToSchedule(index)}>{tag.name}</li>)) }
        </ul>
        <ul style={{ listStyleType: 'none' }}>
          { schedule.map((tag, index) => (
            <li key={tag._id} style={{ padding: '.5rem' }}>
              {tag.name}
              <input className="input" style={{ padding: '.5rem' }} type="number" onChange={e => editTagHoursInSchedule(e.target.value, index)} value={tag.price} placeholder="Lesson price" />
              <button className="btn warning xsm" type="button" onClick={() => removeTagFromSchedule(index)}>Remove</button>
            </li>
          )) }
        </ul>
      </div>
      <button className="btn success xsm" type="button" onClick={() => saveOptionsToDB()}>Save</button>
    </React.Fragment>
  );
};

// Retrieve data from store as props
const mapStateToProps = state => ({
  authUser: state.userData.user,
  socket: state.io.socket
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(TeacherOptions);
