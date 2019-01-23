import React, { Component } from 'react';
import { connect } from 'react-redux';
// Import Style


// Import Components

// Import Actions

const TeachByTags = ({
  user, search, selectTag, selectedTags, tagsFilter, initFilter
}) => {
  const tagElements = [];
  const searchTags = [];
  user.tags.forEach((tag) => {
    if (tag.level >= 5) {
      if (selectedTags.filter(el => tag._id === el._id).length === 0) {
        if (tag.name.includes(tagsFilter)) {
          tagElements.push(
          <li key={tag._id} className="list-el">
              {tag.name}
              <button className="btn xsm" type="button" onClick={() => selectTag(tag)}>Select</button>
            </li>
          );
        }
      } else {
        searchTags.push(
          <li key={tag._id} className="list-el">
            {tag.name}
            <button className="btn xsm" type="button" onClick={() => selectTag(tag)}>Unselect</button>
          </li>
        );
      }
    }
  });
  return (
    <React.Fragment>
      <input type="text" className="input medium mt-2" placeholder="Enter name..." onChange={e => initFilter(e.target.value)} />
      <ul className="list" style={{ minWidth: '35rem' }}>
        {searchTags}
        {tagElements}
      </ul>
      <button className="btn mti-2" type="button" onClick={search}>Search</button>
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
