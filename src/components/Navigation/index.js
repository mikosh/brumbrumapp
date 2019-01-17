import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';
import logo from '../../assets/logo.png';
import { FaHome, FaRegComments, FaUserCircle, FaPlus } from "react-icons/fa";


class Navigation extends Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);

    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  closeNavbar() {
    if (!this.state.collapsed === true) {
      this.toggleNavbar();
    }
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg bg-brum navbar-dark fixed-top">
        <AuthUserContext.Consumer>
          {authUser =>
            (authUser) ?
            <div className="container-fluid">
              <Link className="navbar-brand" onClick={this.closeNavbar} to={ROUTES.TRIPS}><img className="image-fluid logo" alt="logo" src={logo} /><span id="logo">BrumBrum</span></Link>
              <button className="navbar-toggler" type="button" onClick={this.toggleNavbar} >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className={!this.state.collapsed ? "collapse show navbar-collapse" : "collapse navbar-collapse"} id="collapsibleNavbar">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.TRIPS} title="Trips"><FaHome /></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.NEW_TRIP} title="Add trip"><FaPlus /></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.CONVERSATIONS} title="Messaging"><FaRegComments /></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.ACCOUNT} title="Profile"><FaUserCircle/></Link>
                </li>
                {authUser.email.includes(ROLES.ADMIN) && (
                  <li>
                    <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.ADMIN}>Admin</Link>
                  </li>
                )}
                <li className="nav-item">
                  <SignOutButton className="nav-link" />
                </li>
              </ul>
              </div>
            </div>
            :
            <div className="container-fluid">
              <a className="navbar-brand" onClick={this.closeNavbar} href="/"><img className="image-fluid logo" alt="logo" src={logo} /><span id="logo">BrumBrum</span></a>
              <button className="navbar-toggler" type="button" onClick={this.toggleNavbar}>
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className={!this.state.collapsed ? "collapse show navbar-collapse" : "collapse navbar-collapse"} id="collapsibleNavbar">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.LANDING}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.TERMS}>Terms</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.PRIVACY}>Privacy</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning btn-web" onClick={this.closeNavbar} to={ROUTES.SIGN_IN}>Login</Link>
                </li>
              </ul>
              </div>
            </div>
          }
        </AuthUserContext.Consumer>
      </nav>
    );
  }
}

export default Navigation;
