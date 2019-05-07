import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import bgTranslations from "./bg.signup.json";
import enTranslations from "./en.signup.json";
import Footer from '../SignIn/footer';

const SignUpPage = () => (
  <SignUpForm />
);

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  phoneCode: '+359',
  phone: '',
  email: '',
  age: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.props.addTranslationForLanguage(bgTranslations, "bg");
    this.props.addTranslationForLanguage(enTranslations, "en");
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { firstName, lastName, phoneCode, phone, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .profile(authUser.user.uid)
          .set({
            userId: authUser.user.uid,
            created: new Date(),
            firstName: firstName,
            lastName: lastName,
            name: firstName + " " + lastName,
            age: '',
            car: '',
            model: '',
            phone: phone,
            phoneCode: phoneCode,
            gender: '',
            location: ''
          });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.TRIPS);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      firstName,
      lastName,
      phoneCode,
      phone,
      email,
      age,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      age === '' ||
      firstName === '' ||
      lastName === '' ||
      phoneCode === '' ||
      phone === '';

    return (
      <div>
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <br/>
          <br/>
          <center>
          <h1 className="display-4"><Translate id="title" /></h1>
          <h5><Translate id="subtitle" /></h5>
          </center>
          <hr className="my-4"/>
          <div className="login-form">
          <div className="main-div">
          <div className="panel">
            {error && <p>{error.message}</p>}
          </div>
          <Translate>
          {({translate}) =>
          <form onSubmit={this.onSubmit} id="Login">

            <div className="form-group">
              <input className="form-control"
                name="firstName"
                value={firstName}
                onChange={this.onChange}
                type="text"
                placeholder={translate('name')}
              />
            </div>
            <div className="form-group">
              <input className="form-control form-ctl"
                name="lastName"
                value={lastName}
                onChange={this.onChange}
                type="text"
                placeholder={translate('surname')}
              />
            </div>
            <div className="form-group input-group">
              <div className="input-group-prepend">
                  <select name="age" onChange={this.onChange} value={age} className="form-control" >
                    <option value="" defaultValue>Select age</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                    <option value="60">60</option>
                    <option value="61">61</option>
                    <option value="62">62</option>
                    <option value="63">63</option>
                    <option value="64">64</option>
                    <option value="65">65</option>
                  </select>
              </div>
            </div>
            <div className="form-group input-group mb-3">
              <div className="input-group-prepend">
                  <select name="phoneCode" onChange={this.onChange} value={phoneCode} className="form-control" >
                    <option value="+359" defaultValue>BG (+359)</option>
                    <option value="+355">AL (+355)</option>
                    <option value="+43">AT (+43)</option>
                    <option value="+387">BA (+387)</option>
                    <option value="+32">BE (+32)</option>
                    <option value="+41">CH (+41)</option>
                    <option value="+357">CY (+357)</option>
                    <option value="+420">CZ (+420)</option>
                    <option value="+49">DE (+49)</option>
                    <option value="+45">DK (+45)</option>
                    <option value="+372">EE (+372)</option>
                    <option value="+38">ES (+38)</option>
                    <option value="+358">FI (+358)</option>
                    <option value="+33">FR (+33)</option>
                    <option value="+30">GR (+30)</option>
                    <option value="+385">HR (+385)</option>
                    <option value="+36">HU (+36)</option>
                    <option value="+39">IT (+39)</option>
                    <option value="+370">LT (+370)</option>
                    <option value="+371">LV (+371)</option>
                    <option value="+373">MD (+373)</option>
                    <option value="+382">ME (+382)</option>
                    <option value="+389">MK (+389)</option>
                    <option value="+31">NL (+31)</option>
                    <option value="+47">NO (+47)</option>
                    <option value="+48">PL (+48)</option>
                    <option value="+351">PT (+351)</option>
                    <option value="+40">RO (+40)</option>
                    <option value="+381">RS (+381)</option>
                    <option value="+7">RU (+7)</option>
                    <option value="+46">SE (+46)</option>
                    <option value="+386">SL (+386)</option>
                    <option value="+421">SK (+421)</option>
                    <option value="+90">TU (+90)</option>
                    <option value="+44">UK (+44)</option>
                  </select>
              </div>
              <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                  name="phone" value={phone} onChange={this.onChange} placeholder={translate('phone')}/>
            </div>
            <div className="form-group">
              <input className="form-control"
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder={translate('email')}
              />
            </div>
            <div className="form-group">
              <input className="form-control"
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder={translate('password')}
              />
            </div>
            <div className="form-group">
              <input className="form-control"
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder={translate('confirm_password')}
              />
            </div>
            <button disabled={isInvalid} type="submit" className="btn btn-primary">
              {translate('signup')}
            </button>

            {error && <p>{error.message}</p>}
          </form>
          }
          </Translate>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    <Translate id="no_account"/> <Link className="brumbrum-a" to={ROUTES.SIGN_UP}><Translate id="signup_btn"/></Link>
  </p>
);
const SignUpForm = compose(
  withRouter,
  withFirebase, withLocalize
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };
