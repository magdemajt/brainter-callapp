import React from 'react';
import { connect } from 'react-redux';
import { validateEmail, escapeRegExp } from '../../../components/validation';
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
                if (!validateEmail(input)) {
                    this.setState({emailError: 'Disallowed characters in email'});
                } else {
                    this.setState({emailError: ''});
                }
                break;
            }
            case 'passwordInput': {
                this.setState({ password: input });
                if (!escapeRegExp(input)) {
                    this.setState({passError: 'Disallowed characters in password'});
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
    loginSubmit = (e) => {
        e.preventDefault();
        if (this.state.email !== '' && this.state.password !== '' && this.state.emailError + this.state.passError === '') {
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
    }
    render () {
        return (
            <form className="form">
                <input type="email" placeholder="Enter your email..." id="emailInput" onChange={this.handleChange} name="emailInput" className="input" />
                <input type="password" placeholder="Enter your password..." id="passwordInput" onChange={this.handleChange} name="passwordInput" className="input" />
                <p>
                    {this.state.errorText}
                </p>
                <button className="btn default" onClick={this.loginSubmit}>Log in</button>
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
