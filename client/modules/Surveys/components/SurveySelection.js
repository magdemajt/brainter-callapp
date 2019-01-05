import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';

const SurveySelection = ({ t, edited = false, talks = [], currentId, onChangeCurrent  }) => {
  const mappedTalks = talks.map((talk, index) => {
    const date = new Date(talk.createdAt);
    return (
      <li className="list-el" key={talk._id} onClick={() => { !edited ? onChangeCurrent(index) : (() => {})(); }} onDoubleClick={() => { edited ? onChangeCurrent(index) : (() => {})(); }}>
          {t('survey.topic')}{talk.topic}
          {t('survey.date')}{date.getHours()} : {date.getMinutes()}  {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
          {t('survey.teacher')}{talk.caller.name}
      </li>
    );
  });
  return (
    <ul className="list">
      {mappedTalks}
    </ul>
  );
};

export default translate()(SurveySelection);
