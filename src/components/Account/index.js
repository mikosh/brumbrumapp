import React, { Component } from 'react';
import { compose } from 'recompose';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';
import profile from '../../assets/profile.png';
import FirebaseFileUploader from '../FileUploader';

class AccountPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: '',
      loading: false,
      url: '',
      name: '',
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
    console.log("Print: ", e.target.name);
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onProfileSet = (querySnapshot) => {
    var profile = {};
    querySnapshot.forEach((doc) => {
      profile = doc.data();
      this.setState({key: doc.id});
      console.log(profile);
      return;
    });
    if (profile) {
      this.setState({
        url: profile.url,
        name: profile.name,
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

  onSubmit = (e) => {
    e.preventDefault();

    const { name, age, gender, car, location, phone, phoneCode, url } = this.state;

    const updateRef = this.props.firebase.profile(this.state.key);
    updateRef.update({
      name, age, gender, car, location, phone, phoneCode, url
    }).then((docRef) => {

    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }


  handleUploadStart = () => this.setState({isUploading: true, progress: 0});

  handleProgress = (progress) => this.setState({progress});

  handleUploadError = (error) => {
    this.setState({isUploading: false});
    console.error(error);
  }

  handleUploadSuccess = (filename) => {
    this.setState({progress: 100, isUploading: false});
    this.props.firebase.storage.ref('users/' + this.state.userId).child(filename).getDownloadURL().then(url => this.setState({url: url}));
  };

  componentDidMount() {
    if (localStorage.hasOwnProperty('authUser')) {
        // get the key's value from localStorage
        let value = localStorage.getItem('authUser');

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          console.log(value.uid);
          this.props.firebase.profiles().where("userId", "==", value.uid).onSnapshot(this.onProfileSet);

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
    const { url, name, age, location, car, phone, phoneCode, gender } = this.state;
    return (
      <div className="container">
      <div className="row justify-content-md-center page">
        <div className="col-lg-6">
          <div className="panel panel-default account-page">
            <div className="panel-heading">
            <center>
              <img src={url? url : profile} alt="avatar" className="avatar-big"/>
              {this.state.isUploading &&
                <p>Progress: {this.state.progress}</p>
              }
              <br/>
              <label>
                Change profile photo
                <FirebaseFileUploader
                  hidden
                  accept="image/*"
                  name="avatar"
                  filename="profile"
                  storageRef={this.props.firebase.storage.ref('users/' + this.state.userId)}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleUploadSuccess}
                  onProgress={this.handleProgress}
                />
              </label>
            </center>
            </div>
            <br/>
            <div className="panel-body">
              <form onSubmit={this.onSubmit}>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                      name="name" value={name} onChange={this.onChange}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Sex</span>
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
                        <option value="+44">UK (+44)</option>
                      </select>

                  </div>
                  <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                      name="phone" value={phone} onChange={this.onChange} placeholder="Enter phone number"/>
                </div>

                <button type="submit" className="btn btn-primary btn-brum">Update Profile</button>
              </form>
            </div>
          </div>
          <div className="panel panel-default">
            <PasswordChangeForm />
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
)(AccountPage);
