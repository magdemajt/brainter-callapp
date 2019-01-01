import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

const ProfileIcon = ({ editing, user, onDrop }) => {
  let content;
  if (editing) { /* eslint-disable */
    content = (
      <React.Fragment>
        <Dropzone onDrop={onDrop} id="dropzone-image">
          <img id="profile-image" src={`/api/user/photo/${user._id}`} alt="Profile" />
          Drop photo right here
        </Dropzone>
      </React.Fragment>
    );
  } else { /* eslint-enable */
    content = (
      <React.Fragment>
        <img id="profile-image" src={`/api/user/photo/${user._id}`} alt="Profile" />
      </React.Fragment>
    );
  }
  return (
    <div className="col-3 image">
      {content}
    </div>
  );
};

export default ProfileIcon;
