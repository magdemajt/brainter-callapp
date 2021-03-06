import React, { Component } from 'react';

const InputField = ({ inputProps, text }) => {
    return (
        <div className="row-3">
            <p className="text">
                {text}
            </p>
            <input className="input" {...inputProps} />
        </div>
    );
};

export default InputField;