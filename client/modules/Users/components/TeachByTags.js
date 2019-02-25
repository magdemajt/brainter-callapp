import React, { Component } from 'react';
import { connect } from 'react-redux';
// Import Style


// Import Components

// Import Actions

const TeachByTags = ({
  user, search, selectTag, selectedTags, tagsFilter, initFilter, userAmount, changeUserAmount, changeTopic
}) => {
  const tagElements = [];
  const searchTags = [];
  user.tags.forEach((tag) => {
    if (tag.level >= 5) {
      if (selectedTags.filter(el => tag._id === el._id).length === 0) {
        if (tag.name.includes(tagsFilter)) {
          tagElements.push(
            <li key={tag._id} className="list-el" onClick={() => selectTag(tag)}>
              {tag.name}
            </li>
          );
        }
      } else {
        searchTags.push(
          <li key={tag._id} className="list-el selected-el" onClick={() => selectTag(tag)}>
            {tag.name}
          </li>
        );
      }
    }
  });
  return (
    <React.Fragment>
      <input type="text" className="input mt-2" placeholder="Enter name..." onChange={e => initFilter(e.target.value)} />
      {userAmount ? <input type="text" className="input" placeholder="Enter topic..." onChange={e => changeTopic(e.target.value)} /> : null}


      Multiperson lesson
<input type="radio" checked={userAmount === true} onChange={() => changeUserAmount(true)} />



      One user lesson
<input type="radio" checked={userAmount === false} onChange={() => changeUserAmount(false)} />
      <ul className="list" style={{ minWidth: '35rem' }}>
        {searchTags}
        {tagElements}
      </ul>
      <button className="btn mti-2" type="button" onClick={() => search(false)}>Teach</button>
      <button className="btn default" type="button" onClick={() => search(true)}>Paid teaching</button>
    </React.Fragment>
  );
};

// Retrieve data from store as props
const mapStateToProps = state => ({
  selectedTags: state.search.teacherTags,
  user: state.userData.user
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    selectTag: (tag) => dispatch({
      type: 'SELECT_TEACHER_TAG',
      tag
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(TeachByTags);
