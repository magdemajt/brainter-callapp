import React, { useState } from 'react';
import { connect } from 'react-redux';
import { fade, withStyles } from '@material-ui/core/styles';
import { validateEmail, escapeRegExp } from '../../../components/validation';
import { login } from '../../../axiosWrappers/login';
import history from '../../../history';
import { TextField, Button } from '@material-ui/core';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
        // flexWrap: 'wrap',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: theme.spacing(1)
    },
    margin: {
        margin: theme.spacing(1)
    },
    loginButton: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginTop: theme.spacing(2)
    }
});

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'green',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'red',
        },
        '&:hover fieldset': {
          borderColor: 'yellow',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'green',
        },
      },
    },
})(TextField);

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
        const { classes } = this.props;
        return (
            <form className="form" className={classes.root}>
                <div className={classes.flexRow}>
                    <CssTextField
                        className={classes.margin}
                        label="Email"
                        type="email"
                        id="emailInput"
                        name="emailInput"
                        onChange={this.handleChange}
                    />
                </div>
                <div className={classes.flexRow}>
                    <CssTextField
                        className={classes.margin}
                        label="Password"
                        id="passwordInput"
                        name="passwordInput"
                        type="password"
                        onChange={this.handleChange}
                    />
                </div>
                <div className={classes.flexRow}>
                    <Button variant="contained" color="primary" onClick={this.loginSubmit} className={classes.loginButton}>
                        Log in
                    </Button>
                </div>
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LoginInput));
