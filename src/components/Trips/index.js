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
import LocationSearchInput from './places';
import { getLatLng } from 'react-places-autocomplete';
import { FaCarSide } from "react-icons/fa";
import MetaTags from 'react-meta-tags';

// calculate air distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

class TripsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      trips: [],
      searchTrips: [],
      searchActive: false,
      searchStartLat: '',
      searchStartLon: '',
      searchEndLat: '',
      searchEndLon: ''
    };
  }

  filterByDate(item) {
    const leaveTime = item.leaveDate.seconds *1e3;
    const returnTime = item.roundTrip? item.returnDate.seconds * 1e3 : null;
    const now = new Date().getTime();
    if ((!item.roundTrip && leaveTime >= now) || (item.roundTrip && returnTime >= now)) {
      return true;
    }
    return false;
  }

  filterByDistance  = (item) => {
    const distStart = calculateDistance(this.state.searchStartLat, this.state.searchStartLon, item.startLat, item.startLon);
    const distEnd = calculateDistance(this.state.searchEndLat, this.state.searchEndLon, item.endLat, item.endLon);
    if (distStart < 25.1 && distEnd < 25.1) {
      return true;
    }
    return false;
  }

  onCollectionUpdate = (querySnapshot) => {
    let trips = [];
    querySnapshot.forEach((doc) => {
      const tripsObject = doc.data();
      tripsObject.id = doc.id;
      tripsObject.leaveDateFormated = tripsObject.leaveDate.toDate().toISOString();
      //tripsObject.returnDateFormated = tripsObject.returnDate.toDate().toISOString();
      trips.push(tripsObject);
    });
    trips = trips.filter(this.filterByDate);

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

  onSearchSubmit = (e) => {
    e.preventDefault();
    let searchTrips = this.state.trips.filter(this.filterByDistance);

    searchTrips.sort((a,b) => {
      var c = a.leaveDate.toDate();
      var d = b.leaveDate.toDate();
      return c-d;
    });

    this.setState({
      loading: false,
      searchActive: true,
      searchTrips
    });
  }
  onRemoveFilter = (e) => {
    this.setState({
      searchActive: false,
      searchTrips: []

    });
  }

  setStartLocation = (googleLocation) => {
    getLatLng(googleLocation)
    .then(latLng => {
      this.setState({
        searchStartLat: latLng.lat,
        searchStartLon: latLng.lng
      })
      console.log('Success', latLng)
    })
    .catch(error => {
      console.error('Error', error)
    });
  }

  setEndLocation = (googleLocation) => {
    getLatLng(googleLocation)
    .then(latLng => {
      this.setState({
        searchEndLat: latLng.lat,
        searchEndLon: latLng.lng
      })
      console.log('Success', latLng)
    })
    .catch(error => {
      console.error('Error', error)
    });
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.trips().where("deleted", "==", false).onSnapshot(this.onCollectionUpdate);
  }

  render() {
    const { loading, searchActive, trips, searchTrips } = this.state;
    return (
      <div>
        <MetaTags>
          <title>Brumbrum Ridesharing -Active Trips</title>
          <meta property="og:type" content="website" />
          <meta property="og:title" content="BrumBrum Ridesharing - Active Trips" />
          <meta property="og:description" content="BrumBrum app connects drivers with free seats and people travelling the same way." />
          <meta property="og:image" content="logo1024.png" />
        </MetaTags>
        <div className="container">
          <div className="page">
            <Search
              searchActive={searchActive}
              setStartLocation={this.setStartLocation}
              setEndLocation={this.setEndLocation}
              onSearchSubmit={this.onSearchSubmit}
              onRemoveFilter={this.onRemoveFilter} />
            {loading && <div>Loading ...</div>}
            <TripsList loading={loading} trips={(searchActive)? searchTrips : trips} />
          </div>
        </div>
      </div>
    );
  }
}

const Search = ({setStartLocation, setEndLocation,  onSearchSubmit, searchActive, onRemoveFilter}) => (
  <form className="form-inline" onSubmit={onSearchSubmit}>
    <div className="form-group mb-2 mr-2">
      <LocationSearchInput setLocation={setStartLocation} text= "From" placeholder="From" />
    </div>
    <div className="form-group mb-2 mr-2">
      <LocationSearchInput setLocation={setEndLocation} placeholder="To" />
    </div>
    <div className="form-group mb-2 mr-2">
      <button type="submit" className="btn btn-primary btn-brum form-control">Search</button>
    </div>
    {
      (searchActive) ?
        <div className="form-group mb-2">
        <button type="button" className="btn btn-warning form-control" onClick={onRemoveFilter}>Remove filter</button>
        </div>
      : ""
    }
  </form>
);

const TripsList = ({ loading, trips }) => (
  <div>
    { (!loading && trips && trips.length === 0)?
      <div className="alert alert-info" role="alert">
        <h3>Oh no :(</h3>
        <p>No active trips found.</p>
      </div>
      : "" }
    <div className="list-group">
      {trips.map(trip => (
        <Link to={`/trips/${trip.id}`} key={trip.id} className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">
            <img src={trip.imageUrl? trip.imageUrl : profile} alt="Avatar" className="avatar"/>
            <span> {trip.driverName}, {trip.driverAge}</span></h5>
            <span>{trip.car} {trip.model} <FaCarSide className="prefs" /></span>
            <h5>{trip.price} {trip.currency}</h5>
          </div>
          <p className="mb-1">
            <span>{trip.startCity} - {(trip.roundTrip)? trip.endCity + " - " + trip.startCity : trip.endCity}</span>
            <span><img src={trip.smokingAllowed? smoking : nosmoking} alt="Smoking" className="prefs" title={trip.smokingAllowed? "Smoking is allowed" : "No smoking, sorry."}/></span>
            <span><img src={trip.petsAllowed? pets : nopets} alt="Pets" className="prefs" title={trip.petsAllowed? "Pets are allowed" : "No pets, sorry."}/></span>
            <span><img src={trip.musicAllowed? music : nomusic} alt="Music" className="prefs" title={trip.musicAllowed? "Music in the car" : "NO music, sorry."}/></span>
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
)(TripsPage);
