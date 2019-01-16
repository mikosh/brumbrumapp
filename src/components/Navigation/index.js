import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';
import logo from '../../assets/logo.png';
import { FaHome, FaRegComments, FaUserCircle, FaPlus } from "react-icons/fa";


const Navigation = () => (
  <nav className="navbar navbar-expand-lg bg-brum navbar-dark fixed-top">
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </nav>
);

const NavigationAuth = ({authUser}) => (

  <div className="container-fluid">
    <Link className="navbar-brand" to={ROUTES.TRIPS}><img className="image-fluid logo" alt="logo" src={logo} /><span id="logo">BrumBrum</span></Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="collapsibleNavbar">
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.TRIPS} title="Trips"><FaHome /></Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.NEW_TRIP} title="Add trip"><FaPlus /></Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.CONVERSATIONS} title="Messaging"><FaRegComments /></Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.ACCOUNT} title="Profile"><FaUserCircle/></Link>
      </li>
      {authUser.email.includes(ROLES.ADMIN) && (
        <li>
          <Link className="nav-link" to={ROUTES.ADMIN}>Admin</Link>
        </li>
      )}
      <li className="nav-item">
        <SignOutButton className="nav-link" />
      </li>
    </ul>
    </div>
  </div>

);

const NavigationNonAuth = () => (
  <div className="container-fluid">
    <a className="navbar-brand" href="/"><img className="image-fluid logo" alt="logo" src={logo} /><span id="logo">BrumBrum</span></a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="collapsibleNavbar">
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.LANDING}>Home</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.TERMS}>Terms</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.PRIVACY}>Privacy</Link>
      </li>
      <li className="nav-item">
        <Link className="btn btn-warning btn-web" to={ROUTES.SIGN_IN}>Login</Link>
      </li>
    </ul>
    </div>
  </div>
);

export default Navigation;
