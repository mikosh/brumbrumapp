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
import Popup from "reactjs-popup";

const TripViewPage = () => (
  <TripView />
);

class TripViewBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      trip: {},
      profileDriver: null,
      profileVisitor: null,
    };
  }

  onDocUpdate = (doc) => {
    if (doc.exists) {
      const trip = doc.data();
      trip.id = doc.id;
      trip.leaveDateConverted = new Date(trip.leaveDate.seconds * 1000).toISOString();
      trip.returnDateConverted = new Date(trip.returnDate.seconds * 1000).toISOString();
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

      var distance = require('google-distance-matrix');
      distance.key('AIzaSyAZT2vJxlL6IcVGhJJEBBdyt7w8umi8DMs');
      const origin = trip.startLat + ',' + trip.startLon;
      const dest = trip.endLat + ',' + trip.endLon;
      var origins = [origin];
      var destinations = [dest];

      distance.matrix(origins, destinations, function (err, distances) {
        if (err) {
          return console.log(err);
        }
        if(!distances) {
            return console.log('no distances');
        }
        if (distances.status === 'OK') {
          if (distances.rows[0].elements[0].status === 'OK') {
            trip.distance = distances.rows[0].elements[0].distance.text;
            trip.duration = distances.rows[0].elements[0].duration.text;
          }
        } else{
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
          console.log(value.uid);
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
      name: trip.startCity + " " + trip.endCity,
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
      console.log("Conversation updated!");
      this.props.history.push(`/conversations/${docRef.id}/messages`);
    })
    .catch((error) => {
      console.error("Error adding message: ", error);
    });
  }

  render() {
    const { loading, trip, profileDriver } = this.state;

    const isDisabled = profileDriver && profileDriver.phone === '' && profileDriver.phoneCode === '';
    const phone = profileDriver && (profileDriver.phoneCode + profileDriver.phone)
    return (
        <div className="container">
        <div className="page">
          {loading && <div>Loading ...</div>}
          {!loading && trip &&

              <ul className="list-group">
                <li className="list-group-item active-brum"><center><h3><Moment format="dddd, MMMM Do, hh:mm">{trip.leaveDateConverted}</Moment></h3></center></li>
                <li className="list-group-item"><img src={startPin} alt="startPin" className="image-fluid logo"/><span className="list-span font-weight-bold">{trip.startAddress}, {trip.startCity}</span></li>
                <li className="list-group-item"><img src={strip} alt="strip" className="image-fluid logo" /><span className="list-span">Distance: {trip.distance}</span></li>
                <li className="list-group-item"><img src={strip} alt="strip" className="image-fluid logo" /><span className="list-span">Estimated time: {trip.duration}</span></li>
                <li className="list-group-item"><img src={endPin} alt="endPin" className="image-fluid logo" /><span className="list-span font-weight-bold">{trip.endAddress}, {trip.endCity}</span></li>
                <li className="list-group-item" hidden={!trip.roundTrip}><img src={strip} alt="strip" className="image-fluid logo" /><span className="list-span"><Moment format="dddd, MMMM Do, hh:mm">{trip.returnDateConverted}</Moment></span></li>
                <li className="list-group-item" hidden={!trip.roundTrip}><img src={startPin} alt="startPin" className="image-fluid logo"/><span className="list-span font-weight-bold">{trip.startAddress}, {trip.startCity}</span></li>
                <li className="list-group-item"><img src={trip.imageUrl? trip.imageUrl : profile} alt="avatar" className="avatar" /><span className="list-span">{trip.driverName}, {trip.driverAge}</span></li>
                <li className="list-group-item"><span className="list-span">Price: </span><span className="list-span font-weight-bold">{trip.price} {trip.currency}</span></li>
                <li className="list-group-item"><span className="list-span">Seats: </span><span className="list-span font-weight-bold">{trip.seats}</span></li>
                <li className="list-group-item"><span className="list-span">Pets allowed: </span><span className="list-span font-weight-bold">{trip.petsAllowed? "Yes":"No"}</span></li>
                <li className="list-group-item"><span className="list-span">Smoking allowed: </span><span className="list-span font-weight-bold">{trip.smokingAllowed? "Yes":"No"}</span></li>
                <li className="list-group-item"><span className="list-span">Trip description: </span><span className="list-span font-weight-lighter">{trip.description}</span></li>
                <li className="list-group-item">
                  <center>
                    <button className="btn btn-primary btn-brum" onClick={this.createConversation}>
                      Message
                      </button>

                    <span className="list-span"/>

                    <Popup trigger={<button className="btn btn-primary btn-brum" disabled={isDisabled}>Call</button>} modal>
                      <div>
                       <br/>
                        <p> {trip.driverName} number: {phone}</p>
                        <hr/>
                        <small>Use the call button on mobile.</small>
                        <br/>
                        <a className="btn btn-success"  href={"tel:"+ phone }>Call {phone}</a>
                        <br/>
                      </div>
                    </Popup>
                    </center>
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
