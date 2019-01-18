import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import iphoneX from '../../assets/images/iphoneX.png';
import perspectiveX from '../../assets/images/perspectiveX.png';
import dualphoneX from '../../assets/images/dualphoneX.png';
import screen1 from '../../assets/images/screen1.png';
import screen2 from '../../assets/images/screen2.png';
import screen3 from '../../assets/images/screen3.png';
import screen4 from '../../assets/images/screen4.png';
import screen5 from '../../assets/images/screen5.png';
import iphonexlogin from '../../assets/images/iphonexlogin.png';
import appStoreUK from '../../assets/images/appStoreUK.svg';
import appStoreBG from '../../assets/images/appStoreBG.svg';
import { FaFacebookSquare, FaInstagram, FaMobileAlt, FaRocket, FaCar, FaLeaf, FaPiggyBank, FaUserFriends, FaPhoneVolume, FaMapMarkerAlt, FaRegEnvelope } from "react-icons/fa";
import Slider from "react-slick";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import bgTranslations from "./bg.landing.json";
import enTranslations from "./en.landing.json";

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
  };

class Landing extends Component {

  constructor(props) {
    super(props);
    this.props.addTranslationForLanguage(bgTranslations, "bg");
    this.props.addTranslationForLanguage(enTranslations, "en");


  }

  render() {
    return (
      <div>
      <header className="bg-gradient" id="home">
        <div className="container mt-5 transparent">
            <h1><Translate id="title" /></h1>
            <p className="tagline"><Translate id="desc" /></p>
            <hr/>
            <span>
            <a href="https://itunes.apple.com/us/app/brumbrum/id1447012069?ls=1&mt=8">
                <img src={(this.props.language === "en") ? appStoreUK : appStoreBG} alt="appStore" />
            </a>
            </span><span> <Translate id="web" /> </span>
            <span><Link className="btn-lg btn btn-warning btn-web" to={ROUTES.SIGN_IN}><Translate id="webLogin"/></Link></span>
        </div>
        <div className="img-holder mt-3"> <img src={iphoneX} alt="phone" className="img-fluid" /></div>
      </header>
      <div className="section light-bg" id="features">
        <div className="container">
            <div className="section-title">
                <small><Translate id="highlights" /></small>
                <h3><Translate id="featuresTitle" /></h3>
            </div>
            <div className="row">
                <div className="col-12 col-lg-3">
                    <div className="card features">
                        <div className="card-body">
                            <div className="media">
                                <FaCar className="gradient-fill ti-3x mr-3"/>
                                <div className="media-body">
                                    <h4 className="card-title"><Translate id="feature1title" /></h4>
                                    <p className="card-text"><Translate id="feature1desc" /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-3">
                    <div className="card features">
                        <div className="card-body">
                            <div className="media">
                                <FaUserFriends className="gradient-fill ti-3x mr-3"/>
                                <div className="media-body">
                                  <h4 className="card-title"><Translate id="feature2title" /></h4>
                                  <p className="card-text"><Translate id="feature2desc" />.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-3">
                    <div className="card features">
                        <div className="card-body">
                            <div className="media">
                                <FaPiggyBank className="gradient-fill ti-3x mr-3"/>
                                <div className="media-body">
                                  <h4 className="card-title"><Translate id="feature3title" /></h4>
                                  <p className="card-text"><Translate id="feature3desc" /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-3">
                    <div className="card features">
                        <div className="card-body">
                            <div className="media">
                                <FaLeaf className="gradient-fill ti-3x mr-3"/>
                                <div className="media-body">
                                  <h4 className="card-title"><Translate id="feature4title" /></h4>
                                  <p className="card-text"><Translate id="feature4desc" /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="section">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-6">
                    <div className="box-icon"><FaMobileAlt/></div>
                    <h2><Translate id="discoverTitle" /></h2>
                    <p className="mb-4"><Translate id="discoverDesc" /></p>
                    <a href="https://itunes.apple.com/us/app/brumbrum/id1447012069?ls=1&mt=8" className="btn btn-primary btn-brum"><Translate id="downloadNow" /></a>
                </div>
            </div>
            <div className="perspective-phone">
               <img src={perspectiveX} alt="perspective phone" className="img-fluid"/>
            </div>
        </div>
      </div>
      <div className="section">
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <img src={dualphoneX} alt="dual phone" className="img-fluid"/>
                </div>
                <div className="col-md-6 d-flex align-items-center">
                    <div>
                        <div className="box-icon"><FaRocket/></div>
                        <h2><Translate id="launchTitle" /></h2>
                        <p className="mb-4"><Translate id="launchDesc" /></p>
                        <a href="#steps" className="btn btn-primary btn-brum"><Translate id="readMore" /></a></div>
                </div>
            </div>
        </div>
      </div>
      <div className="section light-bg" id="steps">
        <div className="container">
            <div className="row">
                <div className="col-md-8 d-flex align-items-center">
                    <ul className="list-unstyled ui-steps">
                        <li className="media">
                            <div className="circle-icon mr-4">1</div>
                            <div className="media-body">
                                <h5><Translate id="start1title" /></h5>
                                <p><Translate id="start1desc" /></p>
                            </div>
                        </li>
                        <li className="media my-4">
                            <div className="circle-icon mr-4">2</div>
                            <div className="media-body">
                                <h5><Translate id="start2title" /></h5>
                                <p><Translate id="start2desc" /></p>
                            </div>
                        </li>
                        <li className="media">
                            <div className="circle-icon mr-4">3</div>
                            <div className="media-body">
                                <h5><Translate id="start3title" /></h5>
                                <p><Translate id="start3desc" /></p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-md-4">
                    <img src={iphonexlogin} alt="iphonex" className="img-fluid" />
                </div>
            </div>
        </div>
      </div>
      <div className="section light-bg" id="gallery">
        <div className="container">
            <div className="section-title">
                <small><Translate id="gallery" /></small>
                <h3><Translate id="screenshots" /></h3>
            </div>
            <Slider {...settings} className="img-gallery">
              <div>
                <img src={screen1} alt="screen1" />
              </div>
              <div>
                <img src={screen2} alt="screen2" />
              </div>
              <div>
                <img src={screen3} alt="screen3" />
              </div>
              <div>
                <img src={screen4} alt="screen4" />
              </div>
              <div>
                <img src={screen5} alt="screen5" />
              </div>
            </Slider>
        </div>
      </div>
      <div className="section bg-gradient">
        <div className="container">
            <div className="call-to-action transparent">
                <div className="box-icon"><FaMobileAlt /></div>
                <h2><Translate id="downloadAnywhere" /></h2>
                <p><Translate id="downloadDesc" /></p>
                <div className="my-4">
                    <a href="https://itunes.apple.com/us/app/brumbrum/id1447012069?ls=1&mt=8">
                        <img src={(this.props.language === "en") ? appStoreUK : appStoreBG} alt="appStore"/>
                    </a>
                </div>
                <small><i><Translate id="downloadNote" /></i></small>
            </div>
        </div>
      </div>
      <div className="light-bg py-5" id="contact">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 text-center text-lg-left">
                    <p className="mb-2"><FaMapMarkerAlt /> <Translate id="address" /></p>
                    <div className=" d-block d-sm-inline-block">
                        <p className="mb-2">
                            <FaRegEnvelope /> <a className="mr-4 brum-link" href="mailto:brumbrumapp@gmail.com">brumbrumapp@gmail.com</a>
                        </p>
                    </div>
                    <div className="d-block d-sm-inline-block">
                        <p className="mb-0">
                            <FaPhoneVolume /> <a className="brum-link" href="tel:+359896756176">+359 896 756 176</a>
                        </p>
                    </div>

                </div>
                <div className="col-lg-6">
                    <div className="social-icons">
                        <a href="https://www.facebook.com/brumbrumapp/" title="BrumBrum on Facebook"><FaFacebookSquare /></a>
                        <span> </span>
                        <a href="https://www.instagram.com/brumbrumapp/" title="BrumBrum on Instagram"><FaInstagram /></a>
                    </div>
                </div>
            </div>
        </div>
      </div>
      </div>
    );
  }
}


export default withLocalize(Landing);
