import React from 'react';
import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <a href='/' className="nav-link" onClick={firebase.doSignOut}>
    Logout
  </a>
);

export default withFirebase(SignOutButton);
