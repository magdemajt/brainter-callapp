import React, { Component } from 'react';
import { connect } from 'react-redux';
// Import Style


// Import Components

// Import Actions

const SearchUserByTags = ({
  user, search, selectTag, selectedTags, changeTopic
}) => {
  const tagElements = [];
  const searchTags = [];
  user.tags.forEach((tag) => {
    if (selectedTags.filter(el => tag._id === el._id).length === 0) {
      tagElements.push(
        <li key={tag._id} className="list-el">
          {tag.name}
          <button className="btn xsm" type="button" onClick={() => selectTag(tag)}>Select</button>
        </li>
      );
    } else {
      searchTags.push(
        <li key={tag._id} className="list-el">
          {tag.name}
          <button className="btn xsm" type="button" onClick={() => selectTag(tag)}>Unselect</button>
        </li>
      );
    }
  });
  return (
    <React.Fragment>
      <input type="text" className="input medium mt-2" placeholder="Enter name..." onChange={e => initFilter(e.target.value)} />
      <input type="text" className="input medium" placeholder="Enter topic..." onChange={e => changeTopic(e.target.value)} />
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
