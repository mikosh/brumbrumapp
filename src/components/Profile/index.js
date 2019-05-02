import React, { Component } from 'react';
import { compose } from 'recompose';
import { withAuthorization, withEmailVerification } from '../Session';
import profile from '../../assets/profile.png';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';

class ProfilePage extends Component {

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
      gender: '',
      location: '',
      userId: '',
      ratings: [],
      stars: ''
    };
  }

  onProfileSet = (querySnapshot) => {
    var profile = {};
    querySnapshot.forEach((doc) => {
      profile = doc.data();
      this.setState({key: doc.id});
      return;
    });
    if (profile) {
      this.setState({
        loading: false,
        url: profile.url? profile.url : '',
        name: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age,
        car: profile.car,
        gender: profile.gender,
        location: profile.location,
        userId: profile.userId,
        stars: ''
      });
    }
  }

  onRatingsUpdate = (querySnapshot) => {
    let ratings = this.state.ratings;
    querySnapshot.forEach((doc) => {
      const rating = doc.data();
      if (!Array.prototype.includes(this.ratings, rating)) {
        ratings.push(rating);
        let totalAmount = 0;
        ratings.forEach( data => totalAmount = totalAmount + data.star);
        this.setState({ratings, stars: (totalAmount/ratings.length).toFixed(1)});
      }
    });

  }

  componentDidMount() {
    if (localStorage.hasOwnProperty('authUser')) {
      this.setState({ loading: true });
      const { match: { params } } = this.props;
        // parse the localStorage string and setState
        this.setState({ userId: params.id });
        try {
          this.profileListener = this.props.firebase.profiles().where("userId", "==", params.id).onSnapshot(this.onProfileSet);
          this.ratingsListener = this.props.firebase.ratings().where("reviewed", "==", params.id).onSnapshot(this.onRatingsUpdate);
        } catch (e) {
          // handle empty string
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }
  }

  componentWillUnmount() {
    this.profileListener();
    this.ratingsListener();
  }

  render () {
    const { loading, url, firstName, lastName, age, location, car, gender, ratings, stars, userId } = this.state;

    return (
      <div className="container">
      {loading && <div className="page">Loading ...</div>}
      {!loading && firstName &&
        <div className="row justify-content-md-center page">
        <div className="col-lg-6">
          <div className="panel panel-default profile-page">
            <div className="panel-heading">
            <center>
              <img src={url? url : profile} alt="avatar" className="avatar-big"/>
            </center>
            </div>
            <center>
              <StarRatings
                rating={Number(stars) + 0.0}
                starRatedColor="orange"
                numberOfStars={5}
                name='star'
              />
              <div>
                <span>Rating {stars} - </span> <span> <Link to={`/ratings/${userId}`} > {ratings.length} Reviews</Link></span>

              </div>
            </center>

            <br/>
            <div className="panel-body">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                  </div>
                  <div name="firstName" className="form-control" >
                    {firstName}
                  </div>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Surname</span>
                  </div>
                  <div name="lastName" className="form-control" >
                    {lastName}
                  </div>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Gender</span>
                  </div>
                  <div name="gender" className="form-control" >
                    {gender}
                  </div>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Age</span>
                  </div>
                  <div name="age" className="form-control" >
                    {age}
                  </div>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Location</span>
                  </div>
                  <div name="location" className="form-control" >
                    {location}
                  </div>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Car</span>
                  </div>
                  <div name="car" className="form-control" >
                    {car}
                  </div>
                </div>
            </div>
          </div>
          </div>

      </div>
    }
    {!loading && !firstName && <div className="row justify-content-md-center page"> No such profile! </div>}
      </div>
    );
  }
}

// short for const condition = authUser => authUser != null;
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ProfilePage);
