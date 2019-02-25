import React from 'react';
import { connect } from 'react-redux';
import { validateEmail, validatePassword, validateName } from '../../components/validation';
import { TOGGLE_INIT_USER } from '../../store/LoginActions';
import history from '../../history';
import { register, checkIfEmailAvailable } from '../../axiosWrappers/login';

class Register extends React.Component {
    state = {
        email: '',
        emailError: '',
        name: '',
        nameError: '',
        password: '',
        passError: '',
    }
    handleChange = (e) => {
        const input = e.target.value;
        switch (e.target.name) {
            case 'emailInput': {
                this.setState({ email: input });
                checkIfEmailAvailable(input, (response) => {
                    if (!response.data) {
                        this.setState({emailError: 'Email already taken'});
                    }
                });
                if (!validateEmail(input)) {
                  this.setState({emailError: 'Invalid email'});
                } else {
                    this.setState({emailError: ''});
                }
                break;
            }
            case 'nameInput': {
                this.setState({ name: input });
                if (!validateName(input)) {
                this.setState({nameError: 'Invalid name'});
                } else {
                    this.setState({nameError: ''});
                }
              break;
            }
            case 'passwordInput': {
                this.setState({ password: input });
                if (!validatePassword(input)) {
                    this.setState({passError: 'Password must contain minimum eight characters, at least one letter and one number.'});
                } else {
                    this.setState({passError: ''});
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    handleClick = (e) => {
        if (this.checkIfInputsCorrect()) {
            register({name: this.state.name, email: this.state.email, pass: this.state.password}, (response) => {
                if (response.data) { 
                    this.props.initUser(response.data);
                    history.push('/');
                }
            });
        }
    }
    checkIfInputsCorrect = () => {
        return this.state.emailError + this.state.nameError + this.state.passError === '' && 
        this.state.name !== '' && this.state.password !== '' && this.state.email !== '';
    }

    render () {
        const { emailError, nameError, passError } = this.state;
        return (
            <div className="container center offset-8">
                <div className="form">
                  <input type="email" placeholder="Enter your email..." id="emailInput" onChange={this.handleChange} name="emailInput" className="input" />
                    {emailError ? 
                    <div>
                        <span className="warning-input-text">{emailError}</span>
                        <span className="warning-input-icon"><i className="icon warning"/></span>
                    </div> : null}
                  <input type="text" placeholder="Enter your name..." id="nameInput" onChange={this.handleChange} name="nameInput" className="input" />
                  {nameError ? 
                    <div>
                        <span className="warning-input-text">{nameError}</span>
                        <span className="warning-input-icon"><i className="icon warning"/></span>
                    </div> : null}
                  <input type="password" placeholder="Enter your password..." id="passwordInput" onChange={this.handleChange} name="passwordInput" className="input" />
                  {passError ? 
                    <div>
                        <span className="warning-input-text">{passError}</span>
                        <span className="warning-input-icon"><i className="icon warning"/></span>
                    </div> : null}
                    <button className="btn float-right" onClick={this.handleClick}>
                        Register
                    </button>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {};
};
const mapDispatchToProps = (dispatch) => {
    return {
        initUser: (user) => dispatch({
            type: TOGGLE_INIT_USER,
            user
        })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
