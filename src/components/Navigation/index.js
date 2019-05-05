import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';
import logo from '../../assets/logo.png';
import { FaHome, FaRegComments, FaUserCircle, FaPlus, FaRoad, FaSignOutAlt } from "react-icons/fa";
import LanguageToggle from './languageToggle';
import { renderToStaticMarkup } from "react-dom/server";
import { withLocalize } from "react-localize-redux";

import { withFirebase } from '../Firebase';
import { Translate } from "react-localize-redux";
import globalTranslations from "../../constants/global.json";

function BreakExit() {
     this.message = "break occurred.";
     this.name = "BreakExit";
}

class Navigation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      newMessage: false,
      currentUser: ''
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



  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  closeNavbar = () => {
    if (!this.state.collapsed === true) {
      this.toggleNavbar();
    }
  }

  onLogout = () => {
    this.toggleNavbar();
    this.props.firebase.doSignOut();

  }

  componentDidMount() {
    if (localStorage.hasOwnProperty('authUser')) {

        // get the key's value from localStorage
        let value = localStorage.getItem('authUser');

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          //console.log(value.uid);
          this.setState({ currentUser: value.uid });
          this.senderListener = this.props.firebase.conversations().where("sender", "==", value.uid).onSnapshot(this.onConversationsUpdate);
          this.recipientListener = this.props.firebase.conversations().where("recipient", "==", value.uid).onSnapshot(this.onConversationsUpdate);

        } catch (e) {
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }
  }

  componentWillUnmount() {
    this.senderListener();
    this.recipientListener();
  }

  onConversationsUpdate = (querySnapshot) => {

    try {
      querySnapshot.forEach((doc) => {
        const conversation = doc.data();
        if (conversation.sender === this.state.currentUser && conversation.senderRead === false) {
          this.setState({
            newMessage: true
          });
          throw new BreakExit();
        }
        else if (conversation.recipient === this.state.currentUser && conversation.recipientRead === false) {
          this.setState({
            newMessage: true
          });
          throw new BreakExit();
        } else {
          this.setState({
            newMessage: false
          });
        }
      });
    } catch(exception) {
      // If the exception thrown is not our BreakExit type, then re throw,
      // otherwise resume as if look with terminated
      if (exception instanceof BreakExit === false) {
        throw exception
      }
  }


  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg bg-brum navbar-dark fixed-top">
        <AuthUserContext.Consumer>
          {authUser =>
            (authUser && authUser.emailVerified) ?
            <div className="container-fluid">
              <Link className="navbar-brand" onClick={this.closeNavbar} to={ROUTES.TRIPS}><img className="image-fluid logo" alt="logo" src={logo} /><span id="logo"><Translate id="brumbrum" /></span></Link>
              <button className="navbar-toggler" type="button" onClick={this.toggleNavbar} >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className={!this.state.collapsed ? "collapse show navbar-collapse" : "collapse navbar-collapse"} id="collapsibleNavbar">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.TRIPS} title="Trips">
                      <FaHome /><span className="nav-text"><Translate id="home"/></span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.NEW_TRIP} title="Add trip">
                      <FaPlus /><span className="nav-text"><Translate id="add"/></span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.CONVERSATIONS} title="Messaging">
                      <FaRegComments /><span className={this.state.newMessage? 'notify-badge': ''} /><span className="nav-text"><Translate id="messages"/></span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.ACCOUNT} title="Profile">
                      <FaUserCircle/><span className="nav-text"><Translate id="profile"/></span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.MY_TRIPS} title="My trips">
                      <FaRoad/><span className="nav-text"><Translate id="trips"/></span>
                    </Link>
                  </li>
                  {authUser.email.includes(ROLES.ADMIN) && (
                    <li>
                      <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.ADMIN}>Admin</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link className="nav-link" onClick={this.onLogout} to={ROUTES.SIGN_IN} title="Log out">
                      <FaSignOutAlt/><span className="nav-text"><Translate id="logout_btn"/></span>
                    </Link>
                  </li>
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
                  <Link className="nav-link" onClick={this.closeNavbar} to={ROUTES.ABOUT}><Translate id="home_btn"/></Link>
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

export default withLocalize(withFirebase(Navigation));
