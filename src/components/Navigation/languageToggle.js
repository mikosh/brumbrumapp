import React from "react";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";

const LanguageToggle = ({ languages, activeLanguage, setActiveLanguage }) => (
  <li className="nav-item dropdown">
    <button className="link-button nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <Translate id="language"/>
    </button>
    <div className="dropdown-menu">
      {languages.map(lang => (
          <button className="dropdown-item" key={lang.code} onClick={() => {setActiveLanguage(lang.code);localStorage.setItem("lang", lang.code);}}>
            {lang.name}
          </button>
      ))}
    </div>
  </li>
);

export default withLocalize(LanguageToggle);
