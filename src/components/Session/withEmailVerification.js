import React from 'react';
import Footer from '../SignIn/footer';
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
              <div>
              <div className="jumbotron jumbotron-fluid">
                <div className="container">
                  <br/>
                  <br/>
                  <center>

                  {this.state.isSent ? (
                    <div>
                      <h1 className="display-4">Check your email</h1>

                      <p className="lead">
                        Email confirmation sent: Check you mail (Spam
                        folder included) for a confirmation email.
                      </p>
                      <p>
                        Refresh this page once you clicked on the confirmation link.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h1 className="display-4">Verify your account</h1>
                      <p className="lead">
                        Check your mail (Spam folder
                        included) for a confirmation email or send
                        another confirmation link.
                      </p>
                    </div>
                  )}


                  <hr className="my-4"/>
                  <p className="lead">
                    <button className="btn btn-primary btn-brum"
                      type="button"
                      onClick={this.onSendEmailVerification}
                      disabled={this.state.isSent}
                    >
                      Send confirmation E-Mail
                    </button>
                  </p>
                  </center>
                </div>
              </div>
              <Footer />
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
