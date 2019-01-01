import React, { Component } from 'react';
import InputField from './InputField';

const SetPass = ({ onChangeOld, onChange,  defaultValue, confirm, disabled }) => {
    return (
        <React.Fragment>
            <InputField text={''} inputProps={{name: 'password', defaultValue, onChange: (e) => onChangeOld(e.target.value), type: 'password', placeholder: 'Enter current password...' }}/>
            <InputField text={''} inputProps={{name: 'password', defaultValue, onChange: (e) => onChange(e.target.value), type: 'password', placeholder: 'Enter new password...' }}/>
            <button className={disabled ? 'btn disabled' : 'btn'} onClick={confirm}>Confirm</button>
        </React.Fragment>
    );
};

export default SetPass;