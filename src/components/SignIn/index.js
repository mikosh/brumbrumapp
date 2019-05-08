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
import fb_login from '../../assets/images/loginWithFB.png';
import Footer from './footer';



const SignInPage = () => (
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
              <SignInForm />
              <SignInFacebook />
            </div>
          </div>
        </div>
      </div>
      <Footer />
  </div>
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
        //window.location.reload();
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
    );
  }
}

class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        if (socialAuthUser.additionalUserInfo.isNewUser){
        // Create a user profile in your Firebase realtime database
          this.props.firebase
            .profile(socialAuthUser.user.uid)
            .set({
              userId: socialAuthUser.user.uid,
              created: new Date(),
              firstName: socialAuthUser.additionalUserInfo.profile.first_name,
              lastName: socialAuthUser.additionalUserInfo.profile.last_name,
              name: socialAuthUser.additionalUserInfo.profile.first_name + " " + socialAuthUser.additionalUserInfo.profile.last_name,
              age: '',
              car: '',
              model: '',
              phone: '',
              phoneCode: '',
              gender: '',
              location: '',
              url: "https://graph.facebook.com/"+ socialAuthUser.additionalUserInfo.profile.id + "/picture?type=large",
              facebookVerified: true
            });

        }

      }).then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.TRIPS);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" className="btn" title="Log in with Facebook"><img className="logo image-fluid" alt="Log in with Facebook" src={fb_login} /></button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase, withLocalize
)(SignInFormBase);

const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);


export default SignInPage;

export { SignInForm, SignInFacebook };
