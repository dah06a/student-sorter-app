import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Auth.css';
import Button from '../../components/UI/Button/Button';
import * as authActions from '../../store/actions/indexActions';

class Auth extends Component {
    state = {
        isSignUp: false,
        email: "",
        password: "",
        localError: ""
    }

    switchIsSignUp = () => {
        const prevState = this.state.isSignUp;
        this.setState({isSignUp: !prevState});
    }

    inputChangeHandler = (inputType, inputValue) => {
        this.setState({[inputType]: inputValue});
    }

    checkFormIsValid = () => {
        // eslint-disable-next-line
        const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailPattern.test(this.state.email)) {
            this.setState({localError: "Must enter a valid email."});
            return false;
        } else if (this.state.password.length < 8) {
            this.setState({localError: "Password must be at least 8 characters."});
            return false;
        } else {
            this.setState({localError: null});
            return true;
        }
    }

    authSubmitHandler = (event) => {
        event.preventDefault(); //Prevents "Form Not Connected ..." Error
        const formIsValid = this.checkFormIsValid();
        if (formIsValid) {
            this.props.onAuthInit(this.state.email, this.state.password, this.state.isSignUp);
            this.props.history.replace("/start");
        }
    }

    render () {
        let message = null;
        if (this.state.localError) message = <p style={{color: "red"}}>{this.state.localError}</p>;
        if (this.props.networkError) message = <p style={{color: "red"}}>{this.props.networkError}</p>;
        if (this.props.isAuthenticated) message = <p style={{color: "green"}}>SUCCESS!</p>

        let pageTitle = this.state.isSignUp ? "Sign Up Today!" : "Login To Continue!";
        let sendFormButton = this.state.isSignUp ? "SIGN UP" : "LOG IN";
        let switchMessage = this.state.isSignUp ? "Already have an account?" : "Don't have an account yet?";
        let switchUserButton = this.state.isSignUp ? "Go To Login" : "Go To Signup";

        return (
            <div className="Auth">
                <h2>{pageTitle}</h2>

                <form className="FormArea" onSubmit={(event) => this.authSubmitHandler(event)} target="_blank">
                    {message}

                    <div className="EmailArea">
                        <input
                            type="email"
                            value={this.state.email}
                            placeholder="Email Address"
                            onChange={(event) => this.inputChangeHandler("email", event.target.value)}
                        />
                    </div>

                    <div className="PasswordArea">
                        <input
                        type="password"
                        value={this.state.password}
                        placeholder="Password"
                        onChange={(event) => this.inputChangeHandler("password", event.target.value)}
                        />
                    </div>

                    <input className="Submit" type="submit" value={sendFormButton} />
                    <div className="Line" />
                    <p>{switchMessage}</p>
                    <Button type="Info" clicked={this.switchIsSignUp}>{switchUserButton}</Button>
                </form>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        loading: state.auth.loading,
        networkError: state.auth.authError
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuthInit: (email, password, isSignUp) => dispatch(authActions.authInit(email, password, isSignUp))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
