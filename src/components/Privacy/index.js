import React, { Component } from 'react';
import { withLocalize, Translate } from "react-localize-redux";
import bgTranslations from "./bg.privacy.json";
import enTranslations from "./en.privacy.json";

class PrivacyPage extends Component {

  constructor(props) {
    super(props);
    this.props.addTranslationForLanguage(bgTranslations, "bg");
    this.props.addTranslationForLanguage(enTranslations, "en");
  }

  render() {
    return (
    <div>
    <header className="bg-gradient" id="privacy">
      <div className="container mt-5 transparent">
          <h1><Translate id="title" /></h1>
          <p className="tagline small"><Translate id="updated"/></p>
      </div>
  </header>
  <div className="section">
  <div className="container">
    <h3><Translate id="title1" /></h3>
    <div><Translate id="desc1" /></div>
    <div><Translate id="desc2" />
      <ul>
        <li>
          <Translate id="desc3" />
        </li>
        <li>
          <Translate id="desc4" />
        </li>
      </ul>
    </div>
    <hr/>
    <h3><Translate id="title2" /></h3>
    <div><Translate id="desc5" />
    </div>
    <hr/>
    <h3><Translate id="title3" /></h3>
    <div><Translate id="desc6" />
      <ul>
        <li><Translate id="desc7" />
        </li>
      </ul>
    </div>
    <div><Translate id="desc8" /></div>
    <hr/>
    <h3><Translate id="title4" /></h3>
    <div><Translate id="desc9" /></div>
    <hr/>
    <h3><Translate id="title5" /></h3>
    <div><Translate id="desc10" /></div>
    <hr/>
    <h3><Translate id="title6" /></h3>
    <div><Translate id="desc11" />
      <ul>
        <li>
          <Translate id="desc12" />
          <ul>
            <li><Translate id="desc13" /></li>
            <li><Translate id="desc14" /></li>
            <li><Translate id="desc15" /></li>
            <li><Translate id="desc16" /></li>
          </ul>
        </li>
      </ul>
    </div>
    <div><Translate id="desc17" /></div>
    <div><Translate id="desc18" /></div>
    <hr/>
    <h3><Translate id="title7" /></h3>
    <div><Translate id="desc19" /></div>
    <hr/>
    <h3><Translate id="title8" /></h3>
    <div><Translate id="desc20" /></div>
    </div>
    </div>
    </div>
  );
  }

}

export default withLocalize(PrivacyPage);
