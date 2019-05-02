import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import profile from '../../assets/profile.png';
import StarRatings from 'react-star-ratings';
import * as ROUTES from '../../constants/routes';


class ReservationsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      reservations: [],
      currentUser: '',
      comment: '',
      star: 0,
    };
  }

  onReservationsUpdate = (querySnapshot) => {
    let reservations = this.state.reservations;
    querySnapshot.forEach((doc) => {
      const reservation = doc.data();
      reservation.id = doc.id;
      console.log(reservation);
      reservation.createDateFormated = reservation.created.toDate().toISOString();
      if (!Array.prototype.includes(reservations, reservation)) {
        reservations.push(reservation);
        reservations.sort((a,b) => {
          var c = a.created.toDate();
          var d = b.created.toDate();
          return c-d;
        });
        this.setState({reservations});
      }

    });

    this.setState({
      loading: false
    });
  }

  onSubmit = (reservation) => (e) => {
    e.preventDefault();
    const {comment, currentUser, star} = this.state;

    var driverRating = ''
    var passengerRating = ''

    this.props.firebase.ratings().add({
      comment,
      reviewed: (currentUser === reservation.driver)? reservation.passenger : reservation.driver,
      reviewer: currentUser,
      reviewer_url: (currentUser === reservation.driver)? reservation.driver_url : reservation.passenger_url,
      reviewer_name: (currentUser === reservation.driver)? reservation.driver_name : reservation.passenger_name,
      reservation_id: reservation.id,
      trip_id: reservation.trip_id,
      created: new Date(),
      star: parseInt(star, 10)
    }).then((docRef) => {
      if (currentUser === reservation.driver) {
        passengerRating = docRef.id
      } else {
        driverRating = docRef.id
      }
      this.props.firebase.reservation(reservation.id).update({
        driver_rating: driverRating,
        passenger_rating: passengerRating,
        updated: new Date()
      }).then((docRef) => {
        console.log("Reservation updated!");
        this.props.history.push(ROUTES.MY_TRIPS)
      })
      .catch((error) => {
        console.error("Error adding message: ", error);
      });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

  };

  changeRating = ( newRating, name ) => {
    this.setState({
      star: newRating
    });
  }

  onChange = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }


  componentDidMount() {
    this.setState({ loading: true });

    if (localStorage.hasOwnProperty('authUser')) {
        // get the key's value from localStorage
        let value = localStorage.getItem('authUser');
        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({currentUser: value.uid});
          this.reservationsDriver = this.props.firebase.reservations().where("driver", "==", value.uid).where("passenger_rating", "==", "").onSnapshot(this.onReservationsUpdate);
          this.reservationsPassenger = this.props.firebase.reservations().where("passenger", "==", value.uid).where("driver_rating", "==", "").onSnapshot(this.onReservationsUpdate);
        } catch (e) {
          console.log("parsing error! ", e);
        }
    } else {
      //console.log("User not found");
    }
  }

  componentWillUnmount() {
    this.reservationsDriver();
    this.reservationsPassenger();
  }

  render() {
    const { loading, reservations, currentUser, comment, star } = this.state;

    const isInvalid = star === 0 || comment === '';

    return (
      <div className="container">
        <div className="page">
        { (!loading && reservations && reservations.length === 0)?
          <div className="alert alert-info" role="alert">
            <h3>Thank you for rating your companion</h3>
            <p>You have no pending trip ratings.</p>
          </div>
          : "" }
        <div className="list-group">
          {reservations.map(reservation => (
            <div key={reservation.id} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                {currentUser === reservation.driver &&
                  <h5 className="mb-1">
                    <img src={reservation.passenger_url? reservation.passenger_url : profile} alt="Avatar" className="avatar"/>
                    <span> {reservation.passenger_name}</span>
                  </h5>
                }
                {currentUser === reservation.passenger &&
                  <h5 className="mb-1">
                    <img src={reservation.driver_url? reservation.driver_url : profile} alt="Avatar" className="avatar"/>
                    <span> {reservation.driver_name}</span>
                  </h5>
                }
              </div>
              <p className="mb-1">
                <span>{reservation.start_city} - {reservation.end_city}</span>
              </p>
              <form onSubmit={this.onSubmit(reservation)} className="mb-1">
                <div className="form-group">
                  <input type="text" className="form-control" name="comment" onChange={this.onChange} value={comment} placeholder="How was your companion?" />
                </div>
                <div className="form-group">
                  <StarRatings
                    rating={this.state.star}
                    starRatedColor="orange"
                    starHoverColor="orange"
                    starDimension="35px"
                    changeRating={this.changeRating}
                    numberOfStars={5}
                    name='star'
                  />
                </div>
                <button type="submit" disabled={isInvalid} className="btn btn-primary btn-brum">Rate</button>
              </form>
            </div>
          ))
          }
        </div>
        </div>
      </div>
    );
  }
}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(ReservationsPage);
