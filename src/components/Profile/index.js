import React, { Component } from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';
import profile from '../../assets/profile.png';

class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: '',
      loading: false,
      url: '',
      name: '',
      firstName: '',
      lastName: '',
      age: '',
      car: '',
      gender: '',
      phone: '',
      phoneCode: '',
      location: '',
      userId: '',
      isUploading: false,
      progress: 0
    };
  }

  onChange = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onProfileSet = (querySnapshot) => {
    var profile = {};
    querySnapshot.forEach((doc) => {
      profile = doc.data();
      this.setState({key: doc.id});
      return;
    });
    if (profile) {
      this.setState({
        url: profile.url? profile.url : '',
        name: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age,
        car: profile.car,
        gender: profile.gender,
        phone: profile.phone,
        phoneCode: profile.phoneCode,
        location: profile.location,
        userId: profile.userId
      });
    }
  }


  componentDidMount() {
    if (localStorage.hasOwnProperty('authUser')) {
        // get the key's value from localStorage
        let value = localStorage.getItem('authUser');

        const { match: { params } } = this.props;

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          console.log(value.uid);
          this.props.firebase.profiles(params.id).onSnapshot(this.onProfileSet);

        } catch (e) {
          // handle empty string
          //this.setState({ [key]: value });
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }
  }

  render () {
    const { url, firstName, lastName, age, location, car, phone, phoneCode, gender } = this.state;
    return (
      <div className="container">
      <div className="row justify-content-md-center page">
        <div className="col-lg-6">
          <div className="panel panel-default profile-page">
            <div className="panel-heading">
            <center>
              <img src={url? url : profile} alt="avatar" className="avatar-big"/>
              {this.state.isUploading &&
                <p>Progress: {this.state.progress}</p>
              }
            </center>
            </div>
            <br/>
            <div className="panel-body">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                      name="firstName" value={firstName} onChange={this.onChange}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Surname</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                      name="lastName" value={lastName} onChange={this.onChange}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Gender</span>
                  </div>
                  <select name="gender" onChange={this.onChange} value={gender} className="form-control" >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Age</span>
                    </div>
                    <input type="number" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                      name="age" value={age} onChange={this.onChange}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Location</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                      name="location" value={location} onChange={this.onChange}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Car</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                      name="car" value={car} onChange={this.onChange}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                      <select name="phoneCode" onChange={this.onChange} value={phoneCode} className="form-control" >
                        <option value="+359" defaultValue>BG (+359)</option>
                        <option value="+43">AT (+43)</option>
                        <option value="+32">BE (+32)</option>
                        <option value="+41">CH (+41)</option>
                        <option value="+49">DE (+49)</option>
                        <option value="+33">FR (+33)</option>
                        <option value="+30">GR (+30)</option>
                        <option value="+38">ES (+38)</option>
                        <option value="+36">HU (+36)</option>
                        <option value="+39">IT (+39)</option>
                        <option value="+40">RO (+40)</option>
                        <option value="+44">UK (+44)</option>
                      </select>
                  </div>
                  <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                      name="phone" value={phone} onChange={this.onChange} placeholder="Enter phone number"/>
                </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

// short for const condition = authUser => authUser != null;
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ProfilePage);