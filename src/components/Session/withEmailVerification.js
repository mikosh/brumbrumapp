import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (

        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <div className="page">
                <div className="section">
                <div className="container">
                <center>
                {this.state.isSent ? (
                  <div>
                  <h3>Check your email</h3>
                  <hr/>
                  <p>
                    Email confirmation sent: Check you mail (Spam
                    folder included) for a confirmation email.
                  </p>
                  <p>
                    Refresh this page once you clicked on the confirmation link.
                  </p>
                  </div>
                ) : (
                  <div>
                  <h3>Verify your account</h3>
                  <hr/>
                  <p>
                    Check your mail (Spam folder
                    included) for a confirmation email or send
                    another confirmation link.
                  </p>
                  </div>
                )}
                <hr/>

                <button className="btn btn-primary btn-brum"
                  type="button"
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                >
                  Send confirmation E-Mail
                </button>
                </center>
                </div>
                </div>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>

      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
