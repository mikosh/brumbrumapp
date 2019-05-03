import React, { Component } from 'react';
import { compose } from 'recompose';
import PasswordChangeForm from '../PasswordChange';
import { withAuthorization, withEmailVerification } from '../Session';
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
      firstName: '',
      lastName: '',
      age: '',
      car: '',
      model: '',
      gender: '',
      phone: '',
      phoneCode: '',
      location: '',
      userId: '',
      isUploading: false,
      progress: 0,
      batch: '',
      currentUser: ''
    };
  }

  onChange = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onProfileSet = (querySnapshot) => {
    var profile = {};
    var batch = this.state.batch;
    querySnapshot.forEach((doc) => {
      batch.delete(this.props.firebase.profile(doc.id));
      profile = doc.data();
      this.setState({batch, key: doc.id});
      return;
    });
    if (profile) {
      this.setState({
        url: profile.url? profile.url : '',
        name: profile.name? profile.name : '',
        firstName: profile.firstName? profile.firstName : '',
        lastName: profile.lastName? profile.lastName : '',
        age: profile.age,
        car: profile.car,
        model: profile.model,
        gender: profile.gender? profile.gender: '',
        phone: profile.phone,
        phoneCode: profile.phoneCode,
        location: profile.location,
        userId: profile.userId
      });
    }
  }

  onTripsUpdate = (querySnapshot) => {
    var batch = this.state.batch;
    querySnapshot.forEach((doc) => {
      batch.delete(this.props.firebase.trip(doc.id));
      this.setState({batch});
    });
  }

  onRatingsUpdate = (querySnapshot) => {
    var batch = this.state.batch;
    querySnapshot.forEach((doc) => {
      batch.delete(this.props.firebase.rating(doc.id));
      this.setState({batch});
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { currentUser, firstName, lastName, age, gender, car, location, phone, phoneCode, url, model} = this.state;
    const name = firstName + " " + lastName
    const updateRef = this.props.firebase.profile(this.state.key);
    updateRef.set({userId: currentUser, model: ''});
    updateRef.update({
      name, firstName, lastName, age, gender, car, location, phone, phoneCode, url, model
    }).then((docRef) => {

    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  onDeleteUser = () => {
    this.profileListener();
    this.tripsListener();
    this.ratingsListener();
    this.state.batch.commit().then(() => {
      this.props.firebase.doDeleteUser();
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
          this.setState({ currentUser: value.uid, batch: this.props.firebase.batch() });
          this.profileListener = this.props.firebase.profiles().where("userId", "==", value.uid).onSnapshot(this.onProfileSet);
          this.tripsListener = this.props.firebase.trips().where("driver", "==", value.uid).onSnapshot(this.onTripsUpdate);
          this.ratingsListener = this.props.firebase.ratings().where("reviewed", "==", value.uid).onSnapshot(this.onRatingsUpdate);

        } catch (e) {
          // handle empty string
          //this.setState({ [key]: value });
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }
  }

  componentWillUnmount() {
    this.profileListener();
    this.tripsListener();
    this.ratingsListener();
  }

  render () {
    const { url, firstName, lastName, age, location, car, phone, phoneCode, gender, model } = this.state;
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
                    <option value>Select</option>
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
                    <div className="input-group-prepend">
                        <select name="car" onChange={this.onChange} value={car} className="form-control" >
                          <option value>Select</option>
                          <option value="Alpina">Alpina</option>
                          <option value="Alfa Romeo">Alfa Romeo</option>
                          <option value="Aston martin">Aston martin</option>
                          <option value="Audi">Audi</option>
                          <option value="BMW">BMW</option>
                          <option value="Bentley">Bentley</option>
                          <option value="Bugatti">Bugatti</option>
                          <option value="Buick">Buick</option>
                          <option value="Cadillac">Cadillac</option>
                          <option value="Chevrolet">Chevrolet</option>
                          <option value="Chrysler">Chrysler</option>
                          <option value="Citroen">Citroen</option>
                          <option value="Corvette">Corvette</option>
                          <option value="Dacia">Dacia</option>
                          <option value="Daewoo">Daewoo</option>
                          <option value="Daihatsu">Daihatsu</option>
                          <option value="Daimler">Daimler</option>
                          <option value="Datsun">Datsun</option>
                          <option value="Dodge">Dodge</option>
                          <option value="Ferrari">Ferrari</option>
                          <option value="Fiat">Fiat</option>
                          <option value="Ford">Ford</option>
                          <option value="Great Wall">Great Wall</option>
                          <option value="Honda">Honda</option>
                          <option value="Hummer">Hummer</option>
                          <option value="Hyundai">Hyundai</option>
                          <option value="Infiniti">Infiniti</option>
                          <option value="Isuzu">Isuzu</option>
                          <option value="Iveco">Iveco</option>
                          <option value="Jaguar">Jaguar</option>
                          <option value="Jeep">Jeep</option>
                          <option value="Kia">Kia</option>
                          <option value="Lada">Lada</option>
                          <option value="Lamborghini">Lamborghini</option>
                          <option value="Lancia">Lancia</option>
                          <option value="Land Rover">Land Rover</option>
                          <option value="Lexus">Lexus</option>
                          <option value="Lincoln">Lincoln</option>
                          <option value="Lotus">Lotus</option>
                          <option value="Maserati">Maserati</option>
                          <option value="Maybach">Maybach</option>
                          <option value="Mazda">Mazda</option>
                          <option value="McLaren">McLaren</option>
                          <option value="Mercedes-Benz">Mercedes-Benz</option>
                          <option value="Mercury">Mercury</option>
                          <option value="Mg">Mg</option>
                          <option value="Microcar">Microcar</option>
                          <option value="Mini">Mini</option>
                          <option value="Mitsubishi">Mitsubishi</option>
                          <option value="Morgan">Morgan</option>
                          <option value="Moskvich">Moskvich</option>
                          <option value="Nissan">Nissan</option>
                          <option value="Opel">Opel</option>
                          <option value="Peugeot">Peugeot</option>
                          <option value="Pontiac">Pontiac</option>
                          <option value="Porsche">Porsche</option>
                          <option value="Renault">Renault</option>
                          <option value="Rolls-Royce">Rolls-Royce</option>
                          <option value="Rover">Rover</option>
                          <option value="Seat">Seat</option>
                          <option value="Skoda">Skoda</option>
                          <option value="Smart">Smart</option>
                          <option value="Ssang yong">Ssang yong</option>
                          <option value="Subaru">Subaru</option>
                          <option value="Suzuki">Suzuki</option>
                          <option value="Tesla">Tesla</option>
                          <option value="Toyota">Toyota</option>
                          <option value="Triumph">Triumph</option>
                          <option value="VW">VW</option>
                          <option value="Volvo">Volvo</option>
                      </select>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                      name="model" value={model} onChange={this.onChange}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                      <select name="phoneCode" onChange={this.onChange} value={phoneCode} className="form-control" >
                      <option value>Select</option>
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
                      name="phone" value={phone} onChange={this.onChange} placeholder="Enter phone number"/>
                </div>

                <button type="submit" className="btn btn-primary btn-brum">Update Profile</button>
              </form>
            </div>
          </div>
          <div className="panel panel-default">
            <PasswordChangeForm />
          </div>
          <div className="panel panel-default">
            <div className="panel-title">
              <h2>Delete your BrumBrum account</h2>
            </div>
            <hr/>
            <div className="panel-body">
              <button className="btn btn-danger btn-sm" onClick={() => {if(window.confirm('Are you sure you want to delete your account?')){ this.onDeleteUser()};}}>
                Delete account
              </button>
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
)(AccountPage);
