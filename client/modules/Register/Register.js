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
                break;
            }
            case 'nameInput': {
              this.setState({ name: input });
              break;
            }
            case 'passwordInput': {
                this.setState({ password: input });
                break;
            }
            default: {
                break;
            }
        }
    }
    handleBlur = (e) => {
        switch (e.target.name) {
            case 'emailInput': {
                checkIfEmailAvailable(this.state.email, (response) => {
                    if (!response.data) {
                        this.setState({emailError: 'Email already taken'});
                    }
                });
                if (!validateEmail(this.state.email)) {
                  this.setState({emailError: 'Invalid email'});
                } else {
                    this.setState({emailError: ''});
                }
                break;
            }
            case 'nameInput': {
                if (!validateName(this.state.name)) {
                    this.setState({nameError: 'Invalid name'});
                } else {
                    this.setState({nameError: ''});
                }
              break;
            }
            case 'passwordInput': {
                if (!validatePassword(this.state.password)) {
                    console.log(this.state.password)
                    this.setState({passError: 'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'});
                } else {
                    this.setState({passError: ''});
                }
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
            <div className="container center">
                <div className="form">
                  <input type="text" placeholder="Enter your email..." id="emailInput" onChange={this.handleChange} onBlur={this.handleBlur} name="emailInput" className="input" />
                    {emailError ? 
                    <div>
                        <span className="warning-input-text">{emailError}</span>
                        <span className="warning-input-icon"><i className="icon warning"/></span>
                    </div> : null}
                  <input type="text" placeholder="Enter your name..." id="nameInput" onChange={this.handleChange} onBlur={this.handleBlur} name="nameInput" className="input" />
                  {nameError ? 
                    <div>
                        <span className="warning-input-text">{nameError}</span>
                        <span className="warning-input-icon"><i className="icon warning"/></span>
                    </div> : null}
                  <input type="password" placeholder="Enter your password..." id="passwordInput" onChange={this.handleChange} onBlur={this.handleBlur} name="passwordInput" className="input" />
                  {passError ? 
                    <div>
                        <span className="warning-input-text">{passError}</span>
                        <span className="warning-input-icon"><i className="icon warning"/></span>
                    </div> : null}
                    {this.checkIfInputsCorrect() ? 
                    <button className="btn float-right" onClick={this.handleClick}>
                        Register
                    </button> : 
                    <button className="btn disabled float-right">
                        Register
                    </button>}
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
