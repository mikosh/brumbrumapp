import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <div className="password-form">
          <div className="panel">
            <h2>Change account password</h2>
            <hr/>
            {error && <p>{error.message}</p>}
          </div>
          <form onSubmit={this.onSubmit} id="PasswordChange">
            <div className="form-group">
              <input className="form-control"
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="New Password"
              />
            </div>
            <div className="form-group">
              <input className="form-control"
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder="Confirm New Password"
              />
            </div>
            <button disabled={isInvalid} type="submit" className="btn btn-primary btn-brum">
              Change My Password
            </button>
          </form>
        </div>
    );
  }
}

export default withFirebase(PasswordChangeForm);
