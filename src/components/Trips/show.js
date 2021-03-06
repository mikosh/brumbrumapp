import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization, withEmailVerification } from '../Session';
import { AuthUserContext } from '../Session';
import Moment from 'react-moment';
import endPin from '../../assets/endPin.png';
import startPin from '../../assets/startPin.png';
import strip from '../../assets/strip.png';
import profile from '../../assets/profile.png';
import smoking from '../../assets/pref-smoking-yes.png';
import nosmoking from '../../assets/pref-smoking-no.png';
import pets from '../../assets/pref-pet-yes.png';
import nopets from '../../assets/pref-pet-no.png';
import music from '../../assets/pref-music-yes.png';
import nomusic from '../../assets/pref-music-no.png';
import Popup from "reactjs-popup";
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Map from './MapComponent';
import { FaCarSide } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import MetaTags from 'react-meta-tags';


const TripViewPage = () => (
  <TripView />
);

const INITIAL_STATE = {
  loading: false,
  trip: {},
  profileDriver: null,
  profileVisitor: null,
}

class TripViewBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }

  onDocUpdate = (doc) => {
    if (doc.exists) {
      const trip = doc.data();
      trip.id = doc.id;
      trip.leaveDateConverted = trip.leaveDate.toDate().toISOString();
      trip.returnDateConverted = (trip.returnDate && trip.returnDate.toDate().toISOString());
      trip.distance = "calculating...";
      trip.duration = "calculating...";

      this.props.firebase.profiles().where("userId", "==", trip.driver).get().then((querySnapshot) => {
          var profile = {};
          querySnapshot.forEach((doc) => {
              profile = doc.data();
              profile.id = doc.id;
              return;
          });
          if (profile) {
            this.setState({
              profileDriver: profile
            });
          }
      }).catch(function(error) {
          console.log("Error getting conversations:", error);
      });

      const origin = trip.startLat + ',' + trip.startLon;
      const dest = trip.endLat + ',' + trip.endLon;
      var origins = [origin];
      var destinations = [dest];

      var service = new window.google.maps.DistanceMatrixService();

      service.getDistanceMatrix({
        origins: origins,
          destinations: destinations,
          travelMode: 'DRIVING',
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {

          if (status === 'OK') {
            if (response.rows[0].elements[0].status === 'OK') {
              trip.distance = response.rows[0].elements[0].distance.text;
              trip.duration = response.rows[0].elements[0].duration.text;
              //directionsDisplay = new google.maps.DirectionsRenderer();
            }
          } else{
            alert('Error was: ' + status);
            trip.distance = "not calculated";
            trip.duration = "not calculated";
          }
        });

      this.setState({
        trip,
        loading: false
      });

    } else {
      console.log("No such document!");
      this.setState({
        trip: null,
        loading: false
      });
    }
  }

  onProfileSet = (querySnapshot) => {
    var profile = {};
    querySnapshot.forEach((doc) => {
      profile = doc.data();
      profile.id = doc.id;
      return;
    });
    if (profile) {
      this.setState({
        profileVisitor: profile
      });
    }
 }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.setState({ loading: true });
    this.props.firebase.trip(params.id).onSnapshot(this.onDocUpdate);

    if (localStorage.hasOwnProperty('authUser')) {
        // get the key's value from localStorage
        let value = localStorage.getItem('authUser');

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          //console.log(value.uid);
          this.setState({ driver: value.uid });
          this.props.firebase.profiles().where("userId", "==", value.uid).onSnapshot(this.onProfileSet);

        } catch (e) {
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }

  }

  callDriver = (e) => {
    const { profileDriver } = this.state
    profileDriver && alert(profileDriver.phoneCode + profileDriver.phone);
  }

  createConversation = (e) => {
    const {trip, profileDriver, profileVisitor } = this.state
    this.props.firebase.conversations().add({
      lastMessage: '',
      deleted: false,
      deletedBy: '',
      recipient: trip.driver,
      recipientName: trip.driverName,
      recipientProfileId: profileDriver.id,
      recipientUrl: profileDriver.url,
      start_city: trip.startCity,
      end_city: trip.endCity,
      recipientRead: false,
      senderRead: true,
      sender: profileVisitor.userId,
      senderName: profileVisitor.name,
      senderProfileId: profileVisitor.id,
      senderUrl: profileVisitor.url,
      tripId: trip.id,
      backseat: trip.backseat,
      updated: new Date(),
      created: new Date(),
    }).then((docRef) => {
      console.log("Conversation created!");
      this.props.history.push(`/conversations/${docRef.id}/messages`);
    })
    .catch((error) => {
      console.error("Error adding message: ", error);
    });
  }

  createReservation = (e) => {
    const {trip, profileDriver, profileVisitor } = this.state
    this.props.firebase.conversations().add({
      reservation: true,
      reservation_id: '',
      lastMessage: '',
      deleted: false,
      deletedBy: '',
      recipient: trip.driver,
      recipientName: trip.driverName,
      recipientProfileId: profileDriver.id,
      recipientUrl: profileDriver.url,
      start_city: trip.startCity,
      end_city: trip.endCity,
      recipientRead: false,
      senderRead: true,
      sender: profileVisitor.userId,
      senderName: profileVisitor.name,
      senderProfileId: profileVisitor.id,
      senderUrl: profileVisitor.url,
      tripId: trip.id,
      updated: new Date(),
      created: new Date(),
    }).then((docRef) => {
      console.log("Conversation created!");
      this.props.history.push(`/conversations/${docRef.id}/messages`);
    })
    .catch((error) => {
      console.error("Error adding message: ", error);
    });
  }

  onDelete = (e) => {
    e.preventDefault();
    const { trip } = this.state;
    const updateRef = this.props.firebase.trip(trip.id);
    updateRef.update({
      deleted: true
    }).then((docRef) => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.TRIPS)
    })
    .catch((error) => {
      console.error("Error editing document: ", error);
    });
  }

  render() {
    const { loading, trip, profileDriver } = this.state;
    const driverId = profileDriver && profileDriver.userId
    const isDisabled = profileDriver && profileDriver.phone === '' && profileDriver.phoneCode === '';
    const phone = profileDriver && (profileDriver.phoneCode + profileDriver.phone)
    return (
        <div className="container">
          <MetaTags>
            <title>Brumbrum Ridesharing - {`${trip.startCity} - ${trip.endCity}`}</title>
            <meta property="og:type" content="website" />
            <meta property="og:description" content={trip.description} />
            <meta property="og:title" content={`${trip.startCity} - ${trip.endCity}`} />
            <meta property="og:image" content="https://brumbrum.club/logo1024.png" />
          </MetaTags>
        <div className="page">
          {loading && <div>Loading ...</div>}
          {!loading && trip &&

              <ul className="list-group">
                <li className="list-group-item active-brum">
                  <center>
                    <h3>
                    <Moment format="dddd, MMMM Do, HH:mm">{trip.leaveDateConverted}</Moment>
                    </h3>
                  </center>
                </li>
                <li className="list-group-item" title="Start location" >
                  <Popup trigger={<img src={startPin} alt="startPin" className="image-fluid logo"/>} modal>
                    {close => (
                      <div>
                      <Map
                        id="map"
                        options={{
                          center: { lat: trip.startLat, lng: trip.startLon },
                          zoom: 8
                        }}
                        onMapLoad={map => {
                          new window.google.maps.Marker({
                            position: { lat: trip.startLat, lng: trip.startLon },
                            map: map,
                            title: trip.startCity
                          });
                        }}
                      />
                      </div>
                    )}
                  </Popup>
                  <span className="list-span font-weight-bold">{trip.startAddress}, {trip.startCity}</span>
                </li>
                <li className="list-group-item"><img src={strip} alt="strip" className="image-fluid logo" />
                  <span className="list-span">Distance: {trip.distance}</span>
                  <Popup trigger={<button className="btn btn-primary btn-map">Show route</button>} modal>
                    {close => (
                      <div>
                      <Map
                        id="map"
                        options={{
                          center: { lat: (trip.startLat + trip.endLat)/2, lng: (trip.startLon +trip.endLon)/2 },
                          zoom: 8
                        }}
                        onMapLoad={map => {

                          var directionsService = new window.google.maps.DirectionsService();
                          var directionsDisplay = new window.google.maps.DirectionsRenderer();

                          directionsDisplay.setMap(map);
                          var start = new window.google.maps.LatLng(trip.startLat, trip.startLon);
                          var end = new window.google.maps.LatLng(trip.endLat, trip.endLon);
                          var request = {
                              origin: start,
                              destination: end,
                              travelMode: 'DRIVING'
                          };
                          directionsService.route(request, function(response, status) {
                            if (status === 'OK') {
                              directionsDisplay.setDirections(response);
                            }
                          });
                        }}
                      />
                      </div>
                    )}
                  </Popup>
                  </li>
                <li className="list-group-item"><img src={strip} alt="strip" className="image-fluid logo" /><span className="list-span">Estimated time: {trip.duration}</span></li>
                <li className="list-group-item" title="End location">
                  <Popup trigger={<img src={endPin} alt="endPin" className="image-fluid logo" />} modal>
                    {close => (
                      <div>
                      <Map
                        id="map"
                        options={{
                          center: { lat: trip.endLat, lng: trip.endLon },
                          zoom: 8
                        }}
                        onMapLoad={map => {
                          new window.google.maps.Marker({
                            position: { lat: trip.endLat, lng: trip.endLon },
                            map: map,
                            title: trip.endCity
                          });
                        }}
                      />
                      </div>
                    )}
                  </Popup>
                  <span className="list-span font-weight-bold">{trip.endAddress}, {trip.endCity}</span>
                </li>
                <li className="list-group-item" hidden={!trip.roundTrip}><img src={strip} alt="strip" className="image-fluid logo" /><span className="list-span"><Moment format="dddd, MMMM Do, hh:mm">{trip.returnDateConverted}</Moment></span></li>
                <li className="list-group-item" hidden={!trip.roundTrip}><img src={startPin} alt="startPin" className="image-fluid logo"/><span className="list-span font-weight-bold">{trip.startAddress}, {trip.startCity}</span></li>
                <li className="list-group-item">
                  <Link to={`/profile/${trip.driver}`} key={trip.driver} className="brum-link" title="View Profile">
                  <img src={trip.imageUrl? trip.imageUrl : profile} alt="avatar" className="avatar" />
                  <span className="list-span">{trip.driverName}, {trip.driverAge}</span>
                  </Link>
                </li>
                <li className="list-group-item"><span className="list-span">Price: </span><span className="list-span font-weight-bold">{trip.price} {trip.currency}</span></li>
                {(trip.backseat) && <li className="list-group-item"><span className="list-span"><strong>Max. 2</strong> in the back seat guaranteed.</span></li>}
                <li className="list-group-item">
                  <span className="list-span">Seats: </span><span className="list-span font-weight-bold">{trip.seats}</span>
                  <span className="list-span">
                  <AuthUserContext.Consumer>
                    {authUser =>
                      (authUser.uid !== trip.driver) && (Number(trip.seats) !== 0) &&
                      <button className="btn btn-warning" onClick={this.createReservation}>Reserve a seat</button>
                    }
                  </AuthUserContext.Consumer>
                  {(Number(trip.seats) === 0) && <span className="btn btn-danger">Trip is booked!</span>}
                  </span>
                </li>
                <li className="list-group-item">
                  <span><img src={trip.smokingAllowed? smoking : nosmoking} alt="Smoking" className="prefs" title={trip.smokingAllowed? "Smoking is allowed" : "No smoking, sorry."}/></span>
                  <span><img src={trip.petsAllowed? pets : nopets} alt="Pets" className="prefs" title={trip.petsAllowed? "Pets are allowed" : "No pets, sorry."}/></span>
                  <span><img src={trip.musicAllowed? music : nomusic} alt="Music" className="prefs" title={trip.musicAllowed? "Music in the car" : "NO music, sorry."}/></span>
                  <span className="second-el" title="Driver's car" >{trip.car} {trip.model} </span><FaCarSide className="prefs" />
                </li>
                <li className="list-group-item"><span className="list-span">Trip description: </span><span className="list-span font-weight-lighter">{trip.description}</span></li>
                <li className="list-group-item">

                  <AuthUserContext.Consumer>
                    {authUser =>
                      (driverId && authUser.uid !== driverId) ?
                        <center>
                        <button className="btn btn-primary btn-brum" onClick={this.createConversation}>
                          Message
                        </button>
                        <span className="list-span"/>
                        <Popup trigger={<button className="btn btn-primary btn-brum" disabled={isDisabled}>Call</button>} position="top center">
                          {close => (
                          <div>
                            <button className="close" onClick={close}>
                              &times;
                            </button>
                            <div>
                             <br/>
                              <p> {trip.driverName} number: {phone}</p>
                              <hr/>
                              <small>Use the call button on mobile.</small>
                              <br/>
                              <a className="btn btn-success"  href={"tel:"+ phone }>Call {phone}</a>
                              <br/>
                            </div>
                          </div>
                          )}
                        </Popup>
                        </center>
                        : (driverId && authUser.uid === driverId) ?
                          <center>
                            <Link className="btn btn-primary btn-brum" to={`/edit_trip/${trip.id}`} >Edit</Link>
                            <span className="list-span"/>
                            <Popup trigger={<button className="btn btn-primary btn-brum">Delete</button>} position="top center">
                              {close => (
                                <div>
                                <button className="close" onClick={close}>
                                  &times;
                                </button>
                                <div style={{padding: "0 20px"}}>
                                  <br/>
                                  <p>Are you sure you want to delete your trip?</p>
                                  <button className="btn btn-success" onClick={this.onDelete}>Delete</button>
                                </div>
                                </div>
                              )}
                            </Popup>
                          </center>
                          : ""
                      }
                    </AuthUserContext.Consumer>

                </li>
              </ul>

            }
            {!loading && trip == null && <div> No such trip! </div>}
          </div>
          </div>
    );
  }
}

const condition = authUser => !!authUser;

const TripView = compose(
  withRouter,
  withEmailVerification,
  withAuthorization(condition),
)(TripViewBase);

export default (TripViewPage);

export {TripView};
