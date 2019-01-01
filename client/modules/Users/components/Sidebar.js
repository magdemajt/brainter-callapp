import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';

const ProfileSidebar = ({ sendMessage, t }) => (
  <div className="sidebar right small flex">
    <Tooltip trigger={['hover']} placement="left" overlay={t('talk.talk')}>
      <button className="call-button" onClick={() => sendMessage(true)} />
    </Tooltip>
    <Tooltip trigger={['hover']} placement="left" overlay={t('user.sendmsg')}>
      <button className="messageButton" onClick={() => sendMessage(false)} />
    </Tooltip>
  </div>
);

export default translate()(ProfileSidebar);
