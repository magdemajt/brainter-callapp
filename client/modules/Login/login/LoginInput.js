import React from 'react';
import { connect } from 'react-redux';
import { validateEmail, validatePassword } from '../../../components/validation';
import { login } from '../../../axiosWrappers/login';
import history from '../../../history';
class LoginInput extends React.Component {
    state = {
        email: '',
        emailError: '',
        passError: '',
        password: '',
        errorText: ''
    }
    handleChange = (e) => {
        const input = e.target.value;
        switch (e.target.name) {
            case 'emailInput': {
                this.setState({ email: input });
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
        this.handleChange(e);
        switch (e.target.name) {
            case 'emailInput': {
                if (!validateEmail(this.state.email)) {
                    this.setState({emailError: 'Disallowed characters in email'});
                } else {
                    this.setState({emailError: ''});
                }
                break;
            }
            case 'passwordInput': {
                if (!validatePassword(this.state.password)) {
                    this.setState({passError: 'Disallowed characters in password'});
                } else {
                    this.setState({passError: ''});
                }
                break;
            }
        }
    }
    loginSubmit = (e) => {
        e.preventDefault();
        login(this.state.email, this.state.password, (response) => {
            if (!response.data.hasOwnProperty('statusCode')) {
                const event = new CustomEvent('setupToken');
                this.props.initUser(response.data);
                window.dispatchEvent(event);
                history.push('/');
            } else {
                this.setState({errorText: response.data.status});
            }
        })
    }
    render () {
        const combinedErrors = this.state.emailError + this.state.passError;
        return (
            <form className="form">
                <input type="text" placeholder="Enter your email..." id="emailInput" onChange={this.handleChange} onBlur={this.handleBlur} name="emailInput" className="input" />
                <input type="password" placeholder="Enter your password..." id="passwordInput" onChange={this.handleChange} onBlur={this.handleBlur} name="passwordInput" className="input" />
                <p>
                    {this.state.errorText}
                </p>
                {!combinedErrors && this.state.email !== '' && this.state.password !== '' ? <button className="btn default" onClick={this.loginSubmit}>Log in</button> : null}
            </form>
        );
    }
}
const mapStateToProps = (state) => {
    return {};
};
const mapDispatchToProps = (dispatch) => {
    return {
        initUser: (user) => dispatch({
            type: 'TOGGLE_INIT_USER',
            user
        })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginInput);
