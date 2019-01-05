import React, { Component } from 'react';
import InputField from '../../Settings/components/InputField';

const AddTag = ({ changeValue, confirm, addAlias, changeAlias, alias, tagName }) => (
  <React.Fragment>
    <InputField inputProps={{placeholder: 'Enter name of tag...', onChange: (e) => changeValue(e.target.value), value: tagName}} text={''} />
    <InputField inputProps={{placeholder: 'Enter alias...', onChange: (e) => changeAlias(e.target.value), value: alias}} text={''} />
    <div className="row justify-center">
      <button className="btn secondary" type="button" onClick={addAlias}>Confirm alias</button>
    </div>
    <div className="row justify-center">
      <button type="button" className="btn" onClick={confirm}>Add tag</button>
    </div>
  </React.Fragment>
);

export default AddTag;
