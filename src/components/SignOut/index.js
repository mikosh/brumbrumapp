import React from 'react';
import { withFirebase } from '../Firebase';
import { withLocalize } from  'react-localize-redux';
import { FaSignOutAlt } from "react-icons/fa";

const SignOutButton = ({ firebase }) => (
  <a href='/' className="nav-link" onClick={firebase.doSignOut} title="Log out">
    <FaSignOutAlt/>
  </a>
);

export default withLocalize(withFirebase(SignOutButton));
