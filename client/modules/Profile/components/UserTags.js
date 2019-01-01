import React, { Component } from 'react';
import { connect } from 'react-redux';

const UserTags = ({
  user, editing = false, onChangeProp, updateExisting, filteredTags = []
}) => {
  const editingContent = [];
  const tagsProposal = [];
  if (editing) {
    filteredTags.forEach((tag) => {
      if (!user.tags.find(elem => elem._id === tag._id)) {
        tagsProposal.push(
          <li key={tag._id} className="tag">
            {tag.name}
            <button className="plus" onClick={() => onChangeProp({ _id: tag._id, level: 1, name: tag.name }, 'add')} />
          </li>
        );
      }
    });

    user.tags.forEach((tag, key) => {
      editingContent.push(
        <li key={tag._id} className="tag">
          {tag.name}
          <button onClick={() => onChangeProp({ _id: tag._id }, 'remove')} className="minus" />
          <input className="tag-input" value={tag.level} type="number" onChange={e => updateExisting({ _id: tag._id, level: e.target.value > 0 && e.target.value <= 10 ? e.target.value : tag.level, name: tag.name }, key)} />
        </li>
      );
    });
  } else {
    user.tags.forEach((tag, key) => {
      editingContent.push(
        <li key={tag._id} className="tag">
          {tag.name}
          <span className="badge">
            {tag.level}
          </span>
        </li>
      );
    });
  }
  return (
    <div className="row">
      <div className="col-10">
        <ul className="tags-list">
          {editingContent}
          <hr />
          {tagsProposal}
        </ul>
      </div>
    </div>
  );
};

export default UserTags;
