import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import bgTranslations from "./bg.signup.json";
import enTranslations from "./en.signup.json";

const SignUpPage = () => (
  <SignUpForm />
);

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  phoneCode: '+359',
  phone: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.props.addTranslationForLanguage(bgTranslations, "bg");
    this.props.addTranslationForLanguage(enTranslations, "en");
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { firstName, lastName, phoneCode, phone, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .profile(authUser.user.uid)
          .set({
            userId: authUser.user.uid,
            created: new Date(),
            firstName: firstName,
            lastName: lastName,
            name: firstName + " " + lastName,
            age: '',
            car: '',
            phone: phone,
            phoneCode: phoneCode,
            gender: '',
            location: ''
          });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.TRIPS);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      firstName,
      lastName,
      phoneCode,
      phone,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstName === '' ||
      lastName === '' ||
      phoneCode === '' ||
      phone === '';

    return (
      <div className="login-form">
      <div className="main-div">
      <div className="panel">
        <h2><Translate id="title"/></h2>
        <hr/>
        {error && <p>{error.message}</p>}
      </div>
      <Translate>
      {({translate}) =>
      <form onSubmit={this.onSubmit} id="Login">

        <div className="form-group">
          <input className="form-control"
            name="firstName"
            value={firstName}
            onChange={this.onChange}
            type="text"
            placeholder={translate('name')}
          />
        </div>
        <div className="form-group">
          <input className="form-control"
            name="lastName"
            value={lastName}
            onChange={this.onChange}
            type="text"
            placeholder={translate('surname')}
          />
        </div>
        <div className="form-group input-group mb-3">
          <div className="input-group-prepend">
              <select name="phoneCode" onChange={this.onChange} value={phoneCode} className="form-control" >
                <option value="+359" defaultValue>BG (+359)</option>
                <option value="+43">AT (+43)</option>
                <option value="+32">BE (+32)</option>
                <option value="+41">CH (+41)</option>
                <option value="+49">DE (+49)</option>
                <option value="+33">FR (+33)</option>
                <option value="+30">GR (+30)</option>
                <option value="+38">ES (+38)</option>
                <option value="+36">HU (+36)</option>
                <option value="+39">IT (+39)</option>
                <option value="+40">RO (+40)</option>
                <option value="+44">UK (+44)</option>
              </select>
          </div>
          <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
              name="phone" value={phone} onChange={this.onChange} placeholder={translate('phone')}/>
        </div>
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
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder={translate('password')}
          />
        </div>
        <div className="form-group">
          <input className="form-control"
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder={translate('confirm_password')}
          />
        </div>
        <button disabled={isInvalid} type="submit" className="btn btn-primary">
          {translate('signup')}
        </button>

        {error && <p>{error.message}</p>}
      </form>
      }
      </Translate>
      </div>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    <Translate id="no_account"/> <Link to={ROUTES.SIGN_UP}><Translate id="signup"/></Link>
  </p>
);
const SignUpForm = compose(
  withRouter,
  withFirebase, withLocalize
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };
