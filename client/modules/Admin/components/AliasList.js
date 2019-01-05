import React, { Component } from 'react';

const AliasList = ({ editAlias, removeAlias, aliases }) => {
  const tags = [];
  aliases.forEach((alias, index) => {
    tags.push((
      <li key={alias} className="list-el">
        {alias}
        <button className="btn xsm" type="button" onClick={() => editAlias(index)}>Edit</button>
        <button className="btn xsm" type="button" onClick={() => removeAlias(index)}>Remove</button>
      </li>
    ));
  })
  return (
    <ul className="list" style={{ maxHeight: '15rem' }}>
      {tags}
    </ul>
  )
};

export default AliasList;
