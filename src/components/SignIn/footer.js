import React from 'react';
import { withLocalize } from "react-localize-redux";
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { Translate } from "react-localize-redux";

const Footer = ({ setActiveLanguage }) => (
      <div className="container" id="page-footer">
      <Translate>
      {({translate}) =>
        <small>
          <ul className="selector-list">
            <li className="first"><Link className="brumbrum-a" to={ROUTES.SIGN_IN} onClick={() => {setActiveLanguage("en");localStorage.setItem("lang", "en");}}>English (UK)</Link></li>
            <li><Link className="brumbrum-a" to={ROUTES.SIGN_IN} onClick={() => {setActiveLanguage("bg");localStorage.setItem("lang", "bg");}}>Български</Link>
              </li>
          </ul>
          <hr />
          <ul className="selector-list">
            <li className="first"><Link className="brumbrum-a" to={ROUTES.SIGN_UP} title={translate('signup_btn')}><Translate id="signup_btn" /></Link></li>
            <li><Link className="brumbrum-a" to={ROUTES.SIGN_IN} title={translate('login_btn')}><Translate id="login_btn" /></Link></li>
            <li><Link className="brumbrum-a" to={ROUTES.ABOUT} title={translate('home_btn')}><Translate id="home_btn" /></Link></li>
            <li><Link className="brumbrum-a" to={ROUTES.TERMS} title={translate('terms_btn')}><Translate id="terms_btn" /></Link></li>
            <li><Link className="brumbrum-a" to={ROUTES.PRIVACY} title={translate('privacy_btn')}><Translate id="privacy_btn" /></Link></li>
          </ul>
          <span>BrumBrum © 2019</span>
        </small>
      }
      </Translate>
    </div>
)


export default withLocalize(Footer);
