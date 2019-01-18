import React from 'react';
import { withFirebase } from '../Firebase';
import { withLocalize, Translate } from  'react-localize-redux';

const SignOutButton = ({ firebase }) => (
  <a href='/' className="nav-link" onClick={firebase.doSignOut}>
    <Translate id="logout_btn" />
  </a>
);

export default withLocalize(withFirebase(SignOutButton));
