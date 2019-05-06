import React, { Component } from 'react';
import { compose } from 'recompose';
import { withAuthorization, withEmailVerification } from '../Session';
import profile from '../../assets/profile.png';
import StarRatings from 'react-star-ratings';
import Moment from 'react-moment';

class RatingsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ratings: []
    };
  }


  onRatingsUpdate = (querySnapshot) => {
    let ratings = this.state.ratings;
    querySnapshot.forEach((doc) => {
      const rating = doc.data();
      rating.id = doc.id;
      if (!Array.prototype.includes(this.ratings, rating)) {
        ratings.push(rating);
        ratings.sort((a,b) => {
          var c = new Date(a.created.seconds * 1000);
          var d = new Date(b.created.seconds * 1000);
          return c-d;
        });
        this.setState({ratings});
      }
    });
    this.setState({
      loading: false
    });

  }

  componentDidMount() {
    this.setState({ loading: true });
    const { match: { params } } = this.props;
    this.ratingsListener = this.props.firebase.ratings().where("reviewed", "==", params.id).onSnapshot(this.onRatingsUpdate);
  }

  componentWillUnmount() {
    this.ratingsListener();
  }

  render () {
    const { loading, ratings } = this.state;

    return (
      <div className="container">
        <div className="page">
          <div>
            <h3>Reviews</h3>
            { (loading) && <p>Loading...</p> }
            { (!loading && ratings && ratings.length === 0) &&
              <div className="alert alert-info" role="alert">
                <p>The user has no reviews.</p>
              </div>
            }
            <div className="list-group">
              {ratings.map(rating => (
                <div className=" flex-column align-items-start list-group-item list-group-item-action" key={rating.id} >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">
                      <img src={rating.reviewer_url? rating.reviewer_url : profile} alt="Avatar" className="avatar"/>
                      <span> {rating.reviewer_name}</span>
                    </h5>
                    <small>
                      <StarRatings
                        rating={rating.star}
                        starRatedColor="orange"
                        starDimension="25px"
                        numberOfStars={5}
                        name='star'
                      />
                    </small>
                  </div>
                  <div className="mb-1">
                    <span>{rating.comment}</span>
                    <span className="reservationButtons btn-sm"><Moment format="DD MMM YYYY, HH:mm">{new Date(rating.created.seconds * 1000).toISOString()}</Moment></span>
                  </div>
                </div>
              ))
              }
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
)(RatingsPage);
