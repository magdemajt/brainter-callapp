/* eslint-disable */
import React from 'react';

const Modal = (props) => {
  if (props.opened) {
    return (
      <div className="modal-background">
        <div className="modal">
          <div className="header">
            {props.modalHeader}
          </div>
          <div className="content">
            {props.children}
          </div>
          <div className="footer">
            <button id={props.calling ? 'modalAnswerButton' : 'modalConfirmButton'} onClick={props.onConfirmModal}>
              <i className="border" /> 
            </button>
            <button id={props.calling ? 'modalRejectButton' : 'modalCancelButton'} onClick={props.onCancelModal}>
              <i className="border" />
            </button>
          </div>
        </div>
      </div>
      );
  }
  return null;
};


export default (Modal);
/* eslint-enable */
