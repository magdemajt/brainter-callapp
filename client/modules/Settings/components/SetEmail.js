import React, { Component } from 'react';
import InputField from './InputField';

const SetEmail = ({ onChange, defaultValue, confirm, available }) => {
    return (
        <React.Fragment>
            <InputField text={''} inputProps={{name: 'email', defaultValue, onChange: (e) => onChange(e.target.value), type: 'email' }}/>
            <button className={available ? 'btn' : 'btn disabled'} onClick={confirm}>Confirm</button>
        </React.Fragment>
    );
};

export default SetEmail;