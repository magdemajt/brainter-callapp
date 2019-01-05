import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';

const SurveyInputs = ({ t, knowledge = 0, onChangeKnowledge, culture = 0, onChangeCulture, teaching = 0, onChangeTeaching, lesson = 0, onChangeLesson, comment = '', onChangeComment  }) => {
  const options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(opt => {
    return (
      <option value={opt}>
        {opt}
      </option>
    );
  });
  return (
    <React.Fragment>
      <div className="row">
        {t('survey.knowledge')}
      </div>
      <div className="row">
        <select className="select horizontal" value={knowledge} onChange={(e) => onChangeKnowledge(e.target.value)}>
          {options}
        </select>
      </div>
      <div className="row">
        {t('survey.culture')}
      </div>
      <div className="row">
        <select className="select horizontal" value={culture} onChange={(e) => onChangeCulture(e.target.value)}>
          {options}
        </select>
      </div>
      <div className="row">
        {t('survey.teaching')}
      </div>
      <div className="row">
        <select className="select horizontal" value={teaching} onChange={(e) => onChangeTeaching(e.target.value)}>
          {options}
        </select>
      </div>
      <div className="row">
        {t('survey.lesson')}
      </div>
      <div className="row">
        <select className="select horizontal" value={lesson} onChange={(e) => onChangeLesson(e.target.value)}>
          {options}
        </select>
      </div>
      <textarea value={comment} onChange={(e) => onChangeComment(e.target.value)} />
    </React.Fragment>
  );
};

export default translate()(SurveyInputs);