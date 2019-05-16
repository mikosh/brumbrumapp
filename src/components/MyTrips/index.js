import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { withAuthorization, withEmailVerification } from '../Session';
import Moment from 'react-moment';
//import 'moment/locale/bg';
import profile from '../../assets/profile.png';
import smoking from '../../assets/pref-smoking-yes.png';
import nosmoking from '../../assets/pref-smoking-no.png';
import pets from '../../assets/pref-pet-yes.png';
import nopets from '../../assets/pref-pet-no.png';
import music from '../../assets/pref-music-yes.png';
import nomusic from '../../assets/pref-music-no.png';
import { FaCarSide, FaFacebook } from "react-icons/fa";
import { FacebookProvider, Share } from 'react-facebook';
import MetaTags from 'react-meta-tags';

class MyTripsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      trips: [],
      pastTrips: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    let trips = [];
    let pastTrips = [];
    querySnapshot.forEach((doc) => {
      const tripsObject = doc.data();
      tripsObject.id = doc.id;
      tripsObject.leaveDateFormated = tripsObject.leaveDate.toDate().toISOString();
      tripsObject.returnDateFormated = (tripsObject.returnDate && tripsObject.returnDate.toDate().toISOString());
      (tripsObject.leaveDate.seconds * 1000 > Date.now()) ? trips.push(tripsObject) : pastTrips.push(tripsObject);

    });
    //trips = trips.filter(this.filterByDate);

    trips.sort((a,b) => {
      var c = a.leaveDate.toDate();
      var d = b.leaveDate.toDate();
      return c-d;
    });

    pastTrips.sort((a,b) => {
      var c = a.leaveDate.toDate();
      var d = b.leaveDate.toDate();
      return c-d;
    });

    this.setState({
      loading: false,
      trips,
      pastTrips
    });
  }

  onReservationsUpdate = (querySnapshot) => {
    let trips = this.state.trips;
    let pastTrips = this.state.pastTrips;
    querySnapshot.forEach((doc) => {
      const reservationObject = doc.data();

      this.props.firebase.trip(reservationObject.trip_id).get().then((doc) => {
          if (doc.exists) {
              const trip = doc.data();
              trip.id = doc.id;
              trip.leaveDateFormated = trip.leaveDate.toDate().toISOString();
              trip.returnDateFormated = trip.returnDate.toDate().toISOString();
              if (!Array.prototype.includes(this.trips, trip) && trip.leaveDate.seconds * 1000 > Date.now()) {
                trips.push(trip);
                trips.sort((a,b) => {
                  var c = a.leaveDate.toDate();
                  var d = b.leaveDate.toDate();
                  return c-d;
                });
                this.setState({trips});
              } else if (!Array.prototype.includes(this.pastTrips, trip)) {
                pastTrips.push(trip);
                pastTrips.sort((a,b) => {
                  var c = a.leaveDate.toDate();
                  var d = b.leaveDate.toDate();
                  return c-d;
                });
                this.setState({pastTrips});
              }

          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting messages:", error);
      });
    });

    this.setState({
      loading: false
    });
  }

  componentDidMount() {
    this.setState({ loading: true });

    if (localStorage.hasOwnProperty('authUser')) {
        // get the key's value from localStorage
        let value = localStorage.getItem('authUser');
        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.user_id = value.uid;
          this.tripsListener = this.props.firebase.trips().where("driver", "==", value.uid).where("deleted", "==", false).onSnapshot(this.onCollectionUpdate);
          this.reservationsListener = this.props.firebase.reservations().where("passenger", "==", value.uid).onSnapshot(this.onReservationsUpdate);
        } catch (e) {
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }
  }

  componentWillUnmount() {
    this.tripsListener();
    this.reservationsListener();
  }

  render() {
    const { loading, trips, pastTrips } = this.state;
    return (
      <div>
        <MetaTags>
          <title>Brumbrum Ridesharing - My trips</title>
          <meta property="og:type" content="website" />
          <meta property="og:title" content="BrumBrum Ridesharing - My Trips" />
          <meta property="og:description" content="BrumBrum app connects drivers with free seats and people travelling the same way." />
          <meta property="og:image" content="logo1024.png" />
        </MetaTags>
      <div className="container">
        <div className="page">
          <TripsList title="Upcoming trips" loading={loading} trips={trips} ratings={false} />
          <br/>
          <TripsList title="Past trips" loading={loading} trips={pastTrips} ratings={true} />
        </div>
      </div>
      </div>
    );
  }

}

const TripsList = ({ title, loading, trips, ratings}) => (
  <div>
    <h3>{title}</h3>
    { (!loading && trips && trips.length === 0)?
      <div className="alert alert-info" role="alert">
        <p>You have no {title}.</p>
      </div>
      : "" }
    <div className="list-group">
      {trips.map(trip => (
        <div key={trip.id} className="conv-container">
        <Link className="flex-column align-items-start list-group-item list-group-item-action" to={`/trips/${trip.id}`} >
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">
            <img src={trip.imageUrl? trip.imageUrl : profile} alt="Avatar" className="avatar"/>
            <span> {trip.driverName}, {trip.driverAge}</span></h5>
            <h6>{trip.car} {trip.model} <FaCarSide className="prefs" /></h6>
            <h5>{trip.price} {trip.currency}</h5>
          </div>
          {trip.leaveDate.seconds * 1000 > Date.now() && <div className="reservationButtons"><Moment date={trip.leaveDateFormated} fromNow /></div>}
          <p className="mb-1">
            <span>{trip.startCity} - {(trip.roundTrip)? trip.endCity + " - " + trip.startCity : trip.endCity}</span>
            <span><img src={trip.smokingAllowed? smoking : nosmoking} alt="Smoking" className="prefs"/></span>
            <span><img src={trip.petsAllowed? pets : nopets} alt="Pets" className="prefs"/></span>
            <span><img src={trip.musicAllowed? music : nomusic} alt="Music" className="prefs"/></span>
          </p>

          {(trip.roundTrip) ?
            <small>
              <Moment format="ddd, MMM Do, HH:mm">{trip.leaveDateFormated}</Moment>
              <span> - </span>
              <Moment format="ddd, MMM Do, HH:mm">{trip.returnDateFormated}</Moment>
            </small>
            :
            <small><Moment format="ddd, MMM Do, HH:mm">{trip.leaveDateFormated}</Moment></small>
          }

        </Link>
        <div className="rating-button">
          <div className="reservationButtons">
          <FacebookProvider appId="798061646982916">
            <Share href={`https://brumbrum.club/trips/${trip.id}`}>
              {({ handleClick, loading }) => (
                <button type="button" className="btn btn-sm btn-primary btn-brum" onClick={handleClick}><FaFacebook/> Share</button>
              )}
            </Share>
          </FacebookProvider>
          <span> </span>
          {ratings && <Link className="btn btn-warning btn-sm" to={`/reservations`} >Rate your trip</Link>}
          </div>
        </div>
        </div>
      ))
      }
    </div>
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(MyTripsPage);
