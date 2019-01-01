import React, { Component } from 'react';
import { connect } from 'react-redux';
// Import Style


// Import Components

// Import Actions

const SearchUserByTags = ({
  user, search, selectTag, selectedTags
}) => {
  const tagElements = [];
  const searchTags = [];
  user.tags.forEach((tag) => {
    if (selectedTags.filter(el => tag._id === el._id).length === 0) {
      tagElements.push(
        <li key={tag._id}>
          {tag.name}
          <button onClick={() => selectTag(tag)}>Select</button>
        </li>
      );
    } else {
      searchTags.push(
        <li key={tag._id}>
          {tag.name}
          <button onClick={() => selectTag(tag)}>Unselect</button>
        </li>
      );
    }
  });
  return (
    <React.Fragment>
      <input type="text" placeholder="Enter name..." onChange={e => initFilter(e.target.value)} className="mt-2" />
      <ul>
        {searchTags}
        {tagElements}
      </ul>
      <button className="mti-2 btn" onClick={search}>Search</button>
    </React.Fragment>
  );
};

// Retrieve data from store as props
const mapStateToProps = state => ({
  selectedTags: state.search.selectedTags,
  user: state.userData.user
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    selectTag: (tag) => dispatch({
      type: 'SELECT_TAG',
      tag
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(SearchUserByTags);
