import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { withAuthorization, withEmailVerification } from '../Session';
import Moment from 'react-moment';
import profile from '../../assets/profile.png';

class TripsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      trips: [],
    };
  }

  filterByDate(item) {
    const leaveTime = item.leaveDate.seconds *1e3;
    const returnTime = item.returnDate.seconds * 1e3;
    const now = new Date().getTime();
    if ((!item.roundtrip && leaveTime >= now) || (item.roundtrip && returnTime >= now)) {
      return true;
    }
    return false;
  }

  onCollectionUpdate = (querySnapshot) => {
    var trips = [];
    querySnapshot.forEach((doc) => {
      const tripsObject = doc.data();
      tripsObject.id = doc.id;
      trips.push(tripsObject);
    });
    //trips = trips.filter(this.filterByDate);

    trips.sort((a,b) => {
      var c = new Date(a.leaveDate.seconds * 1000);
      var d = new Date(b.leaveDate.seconds * 1000);
      return c-d;
    });
    this.setState({
      loading: false,
      trips
    });
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.trips().where("deleted", "==", false).onSnapshot(this.onCollectionUpdate);
  }



  render() {
    const { loading, trips } = this.state;
    return (
      <div className="container">
        <div className="page">
          {loading && <div>Loading ...</div>}
          <TripsList trips={trips} />
        </div>
      </div>
    );
  }
}

const TripsList = ({ trips }) => (
  <div className="list-group">
    {trips.map(trip => (
      <Link to={`/trips/${trip.id}`} key={trip.id} className="list-group-item list-group-item-action flex-column align-items-start">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">
          <img src={trip.imageUrl? trip.imageUrl : profile} alt="Avatar" className="avatar"/>
          <span> {trip.driverName}, {trip.driverAge}</span></h5>
          <h5>{trip.price} {trip.currency}</h5>
        </div>
        <p className="mb-1">{trip.startCity} - {trip.endCity}</p>
        <small><Moment format="dddd, MMM Do, hh:mm">{new Date(trip.leaveDate.seconds * 1000).toISOString()}</Moment></small>
      </Link>
    ))}
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(TripsPage);
