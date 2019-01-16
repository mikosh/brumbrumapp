import React from 'react';
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
var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
  };

const Landing = () => (

  <div>
  <header className="bg-gradient" id="home">
    <div className="container mt-5">
        <h1>Share your journey</h1>
        <p className="tagline">By having more people using one vehicle, carpooling reduces each person’s travel costs such as fuel costs, tolls, and the stress of driving. Sharing your journeys is also a more environmentally friendly and sustainable way to travel as it reduces carbon emissions, traffic congestion on the roads, and the need for parking spaces.</p>
        <hr/>
        <span>
        <a href="https://itunes.apple.com/us/app/brumbrum/id1447012069?ls=1&mt=8">
            <img src={appStoreUK} />
        </a>
        </span><span> or </span>
        <span><Link className="btn-lg btn btn-warning btn-web" to={ROUTES.SIGN_IN}>Web Login</Link></span>

    </div>
    <div className="img-holder mt-3"> <img src={iphoneX} alt="phone" className="img-fluid" /></div>
  </header>
  <div className="section light-bg" id="features">
    <div className="container">
        <div className="section-title">
            <small>Carpooling highlights</small>
            <h3>FEATURES YOU WILL LOVE</h3>
        </div>
        <div className="row">
            <div className="col-12 col-lg-3">
                <div className="card features">
                    <div className="card-body">
                        <div className="media">
                            <FaCar className="gradient-fill ti-3x mr-3"/>
                            <div className="media-body">
                                <h4 className="card-title">Share your trip</h4>
                                <p className="card-text">You travel by car daily or occasionally? Share your trip and let other people to join your ride.</p>
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
                              <h4 className="card-title">Make new friends</h4>
                              <p className="card-text">The trip will be more fun with friends. Find your travelling companions.</p>
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
                              <h4 className="card-title">Save money</h4>
                              <p className="card-text">Travels are getting more and more expensive? Share costs with your new friends.</p>
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
                              <h4 className="card-title">Eco-friendly</h4>
                              <p className="card-text">Less cars, less traffic and less stress. Make your trip more enjoyable and help the environment.</p>
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
                <h2>Discover our mobile app</h2>
                <p className="mb-4">BrumBrum connects drivers with free seats and people travelling the same way. The BrumBrum app is currently available for iOS devices.</p>
                <a href="#" className="btn btn-primary btn-brum">Download now</a>
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
                    <h2>Launch the BrumBrum App</h2>
                    <p className="mb-4">You are just a one step away from sharing your first trip.</p>
                    <a href="#steps" className="btn btn-primary btn-brum">Read more</a></div>
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
                            <h5>Create an Account</h5>
                            <p>It is very easy. Just sign in with your email and password.</p>
                        </div>
                    </li>
                    <li className="media my-4">
                        <div className="circle-icon mr-4">2</div>
                        <div className="media-body">
                            <h5>Add your first trip</h5>
                            <p>Tell us about your next journey and share it.</p>
                        </div>
                    </li>
                    <li className="media">
                        <div className="circle-icon mr-4">3</div>
                        <div className="media-body">
                            <h5>Enjoy your ride</h5>
                            <p>Your trip is shared with all the brum-brum users. They can now contact you.</p>
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
            <small>GALLERY</small>
            <h3>App Screenshots</h3>
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
        <div className="call-to-action">
            <div className="box-icon"><FaMobileAlt /></div>
            <h2>Download Anywhere</h2>
            <p className="tagline">Available for all iOS devices.</p>
            <div className="my-4">
                <a href="https://itunes.apple.com/us/app/brumbrum/id1447012069?ls=1&mt=8">
                    <img src={appStoreUK} />
                </a>
            </div>
            <small><i>*Works on iOS 11.0 and above.</i></small>
        </div>
    </div>
  </div>
  <div className="light-bg py-5" id="contact">
    <div className="container">
        <div className="row">
            <div className="col-lg-6 text-center text-lg-left">
                <p className="mb-2"><FaMapMarkerAlt /> Rayska gradina 51, 1619 Sofia, Bulgaria</p>
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
                    <a href="#" title="BrumBrum on Instagram"><FaInstagram /></a>
                </div>
            </div>
        </div>
    </div>
  </div>
  </div>
);

export default Landing;
