import React from 'react';
import { withFirebase } from '../Firebase';
import { withLocalize } from  'react-localize-redux';
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const SignOutButton = ({ firebase }) => (
  <Link className="nav-link" onClick={firebase.doSignOut} to={ROUTES.SIGN_IN} title="Log out"><FaSignOutAlt/></Link>
);

export default withLocalize(withFirebase(SignOutButton));
