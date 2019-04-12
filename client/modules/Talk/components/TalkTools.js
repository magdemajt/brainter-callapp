import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import Tooltip from 'rc-tooltip';
// Import Style

// Lista osób do stworzenia peerów w reducerze i event globalny dodawania peerów, obsługa eventów peerów, sprawdzenie czy został uzyskany token
// Dla remoteStreamów id użytownika (w p2p.on('stream'))
// W addToPeerList event stworzenie akcji 'ADD' rozesłanie tej action storage do wszystkich

const TalkTools = ({
  onMute, onVideoMute, onEndCall, t, muted, videoMuted
}) => (
  <div id="buttonsDiv">
    <Tooltip trigger={['hover']} placement="top" overlay={t('talk.disconnect')}>
      <button id="disconnectButton" onClick={onEndCall} />
    </Tooltip>
    <Tooltip trigger={['hover']} placement="top" overlay={muted ? t('talk.unmute') : t('talk.mute')}>
      <button id={muted ? 'unmuteButton' : 'muteButton'} onClick={onMute} />
    </Tooltip>
    <Tooltip trigger={['hover']} placement="top" overlay={videoMuted ? t('talk.video') : t('talk.novideo')}>
      <button id={videoMuted ? 'novideoButton' : 'videoButton'} onClick={onVideoMute} />
    </Tooltip>
  </div>
);

export default translate()(TalkTools);
