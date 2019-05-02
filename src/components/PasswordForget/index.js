import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import bgTranslations from "./bg.passwordforget.json";
import enTranslations from "./en.passwordforget.json";
import Footer from '../SignIn/footer';

const PasswordForgetPage = () => (
    <PasswordForgetForm />
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
    this.props.addTranslationForLanguage(bgTranslations, "bg");
    this.props.addTranslationForLanguage(enTranslations, "en");
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <div>
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <br/>
          <br/>
          <center>
          <h1 className="display-4"><Translate id="title" /></h1>
          </center>
          <hr className="my-4"/>
          <div className="login-form">
            <div className="main-div">

              <div className="panel">
                {error && <p>{error.message}</p>}
              </div>
              <Translate>
              {({translate}) =>
              <form onSubmit={this.onSubmit} id="PasswordForget">
                <div className="form-group">
                  <input className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                    placeholder={translate('email')}
                  />
                </div>
                <button disabled={isInvalid} type="submit" className="btn btn-primary">
                  {translate('button')}
                </button>
              </form>
              }
              </Translate>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}><Translate id="forgot_password"/></Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(withLocalize(PasswordForgetFormBase));

export { PasswordForgetForm, PasswordForgetLink };
