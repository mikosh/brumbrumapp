import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { withAuthorization, withEmailVerification } from '../Session';

//import 'moment/locale/bg';
import profile from '../../assets/profile.png';


class NotificationsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      reservations: [],
      user_id: ''
    };
  }

  onReservationsUpdate = (querySnapshot) => {
    let reservations = [];
    querySnapshot.forEach((doc) => {
      const reservationObject = doc.data();
      reservationObject.id = doc.id;
      reservationObject.updated = reservationObject.updated.toDate().toISOString();
      reservations.push(reservationObject);
    });
    //trips = trips.filter(this.filterByDate);

    reservations.sort((a,b) => {
      var c = a.updated.toDate();
      var d = b.updated.toDate();
      return c-d;
    });

    this.setState({
      loading: false,
      reservations
    });
  }

  updateReservation = (id, accepted) => (e) => {
    e.preventDefault();
    const updateRef = this.props.firebase.reservation(id);
    updateRef.update({
      accepted: accepted
    }).then((docRef) => {
    })
    .catch((error) => {
      console.error("Error editing document: ", error);
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
          this.props.firebase.reservations().where("driver", "==", value.uid).onSnapshot(this.onReservationsUpdate);

        } catch (e) {
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }


  }

  render() {
    const { loading, reservations, user_id } = this.state;
    return (
      <div className="container">
        <div className="page">
          <RatingsList loading={loading} reservations={reservations} user_id={user_id} />
          <br/>

            { (!loading && reservations && reservations.length === 0)?
              <div className="alert alert-info" role="alert">
                <h3>Oh no :(</h3>
                <p>You have no requests.</p>
              </div>
              : "" }
              <div>
                <h5>Reservations requests</h5>
                <div className="list-group">
                  {reservations.map(r => (
                    <div className="list-group-item list-group-item-action flex-column align-items-start" key={r.id}>

                        <div className="d-flex w-100 justify-content-between">
                          <div className="mb-1">
                            <Link to={`/profile/${r.passenger}`} className="brum-link" title="View Profile">
                            <img src={r.passenger_url? r.passenger_url : profile} alt="Avatar" className="avatar"/>
                            <span> {r.passenger_name} </span>
                            </Link>
                            <span> wants to travel with you from {r.start_city} to {r.end_city} </span>
                          </div>
                          <div className="reservationButtons">
                            {r.accepted === 0 &&
                              <Link className="btn btn-warning btn-sm" to={`/conversations/${r.conversation_id}/messages`} >Review</Link>
                            }
                            {r.accepted === 1 && <h6>Accepted</h6>}
                            {r.accepted > 1 && <h6>Declined</h6>}
                          </div>
                        </div>
                    </div>
                  ))}
                </div>
          </div>
        </div>
      </div>
    );
  }
}

const RatingsList = ({loading, user_id, reservations }) => (
  <div>
  { reservations && reservations.length > 0 &&
    <div>
      <h5>Pending Ratings</h5>
      <div className="list-group">
        {reservations.map(r => (
          <div className="list-group-item list-group-item-action flex-column align-items-start" key={r.id}>
              <div className="d-flex w-100 justify-content-between">
                <div className="mb-1">
                  <span>Rate </span>
                  <Link to={user_id === r.driver? `/profile/${r.driver}` : `/profile/${r.passenger}`  } className="brum-link" title="View Profile">
                  <img src={user_id === r.driver? (r.driver_url? r.driver_url : profile) : (r.passenger_url? r.passenger_url : profile)} alt="Avatar" className="avatar"/>
                  <span> {user_id === r.driver? r.driver_name : r.passenger_name} </span>
                  </Link>
                  <span> for your trip from {r.start_city} to {r.end_city} </span>
                </div>
                <div className="reservationButtons">
                  <Link className="btn btn-warning btn-sm" to={`/reservations/${r.id}/ratings`} >Rate</Link>
                </div>
              </div>

          </div>
        ))}
      </div>
    </div>
  }
  </div>
);



const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(NotificationsPage);
