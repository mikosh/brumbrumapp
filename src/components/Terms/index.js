import React, { Component } from 'react';
import { withLocalize, Translate } from "react-localize-redux";
import bgTranslations from "./bg.terms.json";
import enTranslations from "./en.terms.json";

class TermsPage extends Component {

  constructor(props) {
    super(props);
    this.props.addTranslationForLanguage(bgTranslations, "bg");
    this.props.addTranslationForLanguage(enTranslations, "en");
  }

  render () {
    return (
    <div>
    <header className="bg-gradient" id="terms">
      <div className="container mt-5 transparent">
          <h1><Translate id="title" /></h1>
          <p className="tagline small"><Translate id="updated" /></p>
      </div>
    </header>
    <div className="section section-terms">
    <div className="container">
    <h3><Translate id="title1" /></h3>
    <p><Translate id="desc1" /></p>
    <p><Translate id="desc2" /></p>
    <hr/>
    <h3><Translate id="title2" /></h3>
    <p><Translate id="desc3" /></p>
    <p><Translate id="desc4" /></p>
    <hr/>
    <h3><Translate id="title3" /></h3>
    <p><Translate id="desc5" /></p>
    <p><Translate id="desc6" /></p>
    <p><Translate id="desc7" /></p>
    <hr/>
    <h3><Translate id="title4" /></h3>
    <p><Translate id="desc8" /></p>
    <p><Translate id="desc9" /></p>
    <hr/>
    <h3><Translate id="title5" /></h3>
    <p><Translate id="desc10" /></p>
    <hr/>
    <h3><Translate id="title6" /></h3>
    <p><Translate id="desc11" /></p>
    <p><Translate id="desc12" /></p>
    <p><Translate id="desc13" /></p>
    <p><Translate id="desc14" /></p>

    <h3><Translate id="title7" /></h3>
    <p><Translate id="desc15" /></p>
    <p><Translate id="desc16" /></p>
    <p><Translate id="desc17" /></p>
    <hr/>
    <h3><Translate id="title8" /></h3>
    <p><Translate id="desc18" /></p>
    <p><Translate id="desc19" /></p>
    <p><Translate id="desc20" /></p>
    <p><Translate id="desc21" /></p>
    <p><Translate id="desc22" /></p>
    <p><Translate id="desc23" /></p>
    <p><Translate id="desc24" /></p>
    <p><Translate id="desc25" /></p>
    <p><Translate id="desc26" /></p>
    <hr/>
    <h3><Translate id="title9" /></h3>
    <p><Translate id="desc27" /></p>

    </div>
    </div>
    </div>
  );
  }

}

export default withLocalize(TermsPage);
