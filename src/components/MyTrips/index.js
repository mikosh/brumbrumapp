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


class MyTripsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      trips: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    let trips = [];
    querySnapshot.forEach((doc) => {
      const tripsObject = doc.data();
      tripsObject.id = doc.id;
      tripsObject.leaveDateFormated = tripsObject.leaveDate.toDate().toISOString();
      tripsObject.returnDateFormated = tripsObject.returnDate.toDate().toISOString();
      trips.push(tripsObject);
    });
    //trips = trips.filter(this.filterByDate);

    trips.sort((a,b) => {
      var c = a.leaveDate.toDate();
      var d = b.leaveDate.toDate();
      return c-d;
    });

    this.setState({
      loading: false,
      trips
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
          this.props.firebase.trips().where("driver", "==", value.uid).where("deleted", "==", false).onSnapshot(this.onCollectionUpdate);

        } catch (e) {
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }


  }

  render() {
    const { loading, trips } = this.state;
    return (
      <div className="container">
        <div className="page">
          {loading && <div>Loading ...</div>}
          <TripsList loading={loading} trips={trips} />
        </div>
      </div>
    );
  }
}

const TripsList = ({ loading, trips }) => (
  <div>
    <h2>My trips</h2>
    { (!loading && trips && trips.length === 0)?
      <div className="alert alert-info" role="alert">
        <h3>Oh no :(</h3>
        <p>You have no trips.</p>
      </div>
      : "" }
    <div className="list-group">
      {trips.map(trip => (
        <Link to={`/trips/${trip.id}`} key={trip.id} className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">
            <img src={trip.imageUrl? trip.imageUrl : profile} alt="Avatar" className="avatar"/>
            <span> {trip.driverName}, {trip.driverAge}</span></h5>
            <h5>{trip.price} {trip.currency}</h5>
          </div>
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
