import React, { Component } from 'react';
import { withLocalize, Translate } from "react-localize-redux";
import bgTranslations from "./bg.privacy.json";
import enTranslations from "./en.privacy.json";
import MetaTags from "react-meta-tags";

class PrivacyPage extends Component {

  constructor(props) {
    super(props);
    this.props.addTranslationForLanguage(bgTranslations, "bg");
    this.props.addTranslationForLanguage(enTranslations, "en");
  }

  render() {
    return (
    <div>
      <MetaTags>
        <title>Brumbrum Ridesharing - Privacy Policy</title>
        <meta property="og:type" content="website" />
        <meta property="og:description" content="BrumBrum app connects drivers with free seats and people travelling the same way." />
        <meta property="og:title" content="Brumbrum Ridesharing - Privacy Policy" />
        <meta property="og:image" content="https://brumbrum.club/logo1024.png" />
      </MetaTags>
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <br/>
          <br/>
          <center>
            <h1 className="display-4"><Translate id="title" /></h1>
            <p><Translate id="updated" /></p>
          </center>
        </div>
      </div>
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
