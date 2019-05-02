import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import bgTranslations from "./bg.signin.json";
import enTranslations from "./en.signin.json";
import * as ROUTES from '../../constants/routes';
import logo from '../../assets/logo-sq.png';
import Footer from './footer';



const SignInPage = () => (
  <SignInForm />
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.props.addTranslationForLanguage(bgTranslations, "bg");
    this.props.addTranslationForLanguage(enTranslations, "en");
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.TRIPS);
        window.location.reload();
      })
      .catch(error => {
        this.setState({ error });
      });


  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
        <div>
            <div className="jumbotron jumbotron-fluid">
              <div className="container">
              <br/>
              <br/>
              <center>
              <img className="signin-logo image-fluid" alt="BrumBrum" src={logo} />
              <h1 className="display-4"><Translate id="title" /></h1>
              <h5><Translate id="subtitle" /></h5>
              </center>
              <hr className="my-4"/>
              <div className="login-form">
                <div className="main-div">
                  <div className="panel">
                    {error && <p>{error.message}</p>}
                  </div>
                  <Translate>
                  {({translate}) =>
                  <form onSubmit={this.onSubmit} id="Login">
                    <div className="form-group">

                        <input className="form-control"
                          name="email"
                          value={email}
                          onChange={this.onChange}
                          type="text"
                          placeholder={translate('email')}
                        />

                    </div>
                    <div className="form-group">
                      <input className="form-control"
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        type="password"
                        placeholder={translate('password')}
                      />
                    </div>
                    <div className="forgot">
                      <PasswordForgetLink />
                    </div>
                    <button className="btn btn-primary" disabled={isInvalid} type="submit">
                      {translate('login_btn')}
                    </button>
                  </form>
                  }
                  </Translate>
                  <br/>
                  <hr/>
                  <SignUpLink />
                </div>
              </div>
            </div>
          </div>
          <Footer />
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase, withLocalize
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
