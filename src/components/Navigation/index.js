import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';
import logo from '../../assets/logo.png';
import { FaHome, FaRegComments, FaUserCircle, FaPlus, FaRoad } from "react-icons/fa";
import LanguageToggle from './languageToggle';
import { renderToStaticMarkup } from "react-dom/server";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import globalTranslations from "../../constants/global.json";


class Navigation extends Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);

    this.state = {
      collapsed: true
    };

    const languages = [
      { name: "English", code: "en" },
      { name: "Български", code: "bg" }
    ];
    const defaultLanguage =
      localStorage.getItem("lang") || languages[0].code;

    this.props.initialize({
      languages,
      translation: globalTranslations,
      options: { renderToStaticMarkup, defaultLanguage }
    });
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
              <Link className="navbar-brand" onClick={this.closeNavbar} to={ROUTES.TRIPS}><img className="image-fluid logo" alt="logo" src={logo} /><span id="logo"><Translate id="brumbrum" /></span></Link>
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
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.MY_TRIPS} title="My trips"><FaRoad/></Link>
                </li>
                {authUser.email.includes(ROLES.ADMIN) && (
                  <li>
                    <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.ADMIN}>Admin</Link>
                  </li>
                )}
                <li className="nav-item">
                  <SignOutButton className="nav-link" />
                </li>
                <LanguageToggle />
              </ul>
              </div>
            </div>
            :
            <div className="container-fluid">
              <a className="navbar-brand" onClick={this.closeNavbar} href="/"><img className="image-fluid logo" alt="logo" src={logo} /><span id="logo"><Translate id="brumbrum" /></span></a>
              <button className="navbar-toggler" type="button" onClick={this.toggleNavbar}>
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className={!this.state.collapsed ? "collapse show navbar-collapse" : "collapse navbar-collapse"} id="collapsibleNavbar">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.LANDING}><Translate id="home_btn"/></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.TERMS}><Translate id="terms_btn"/></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.PRIVACY}><Translate id="privacy_btn"/></Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning btn-web" onClick={this.closeNavbar} to={ROUTES.SIGN_IN}><Translate id="login_btn"/></Link>
                </li>
                <LanguageToggle />
              </ul>
              </div>
            </div>
          }
        </AuthUserContext.Consumer>
      </nav>
    );
  }
}

export default withLocalize(Navigation);
