import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import './material_green.css'
import smoking from '../../assets/pref-smoking-yes.png';
import nosmoking from '../../assets/pref-smoking-no.png';
import pets from '../../assets/pref-pet-yes.png';
import nopets from '../../assets/pref-pet-no.png';
import music from '../../assets/pref-music-yes.png';
import nomusic from '../../assets/pref-music-no.png';

import Flatpickr from 'react-flatpickr'

const INITIAL_STATE = {
  trip_id: '',
  startAddress: '',
  startCity: '',
  endAddress: '',
  endCity: '',
  leaveDate: '',
  seats: '',
  currency: '',
  price: '',
  smokingAllowed: '',
  petsAllowed: '',
  musicAllowed: '',
  description: ''
};

class EditTrip extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE};
  }

  componentDidMount() {
    const ref = this.props.firebase.trip(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        const trip = doc.data();
        trip.id = doc.id;
        this.setState({trip_id: trip.id, startAddress: trip.startAddress, startCity: trip.startCity, endAddress: trip.endAddress, endCity: trip.endCity, leaveDate: trip.leaveDate, seats: trip.seats, price: trip.price, currency: trip.currency,
        smokingAllowed: trip.smokingAllowed, petsAllowed: trip.petsAllowed, musicAllowed: trip.musicAllowed, description: trip.description});
      } else {
        console.log("No such document!");
      }
    });
  }

  onChange = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onLeaveDateChange = (e) => {
    const state = this.state;
    console.log("Print: ", e[0]);
    state["leaveDate"] = e[0];
    this.setState(state);
  }

  onReturnDateChange = (e) => {
    const state = this.state;
    state["returnDate"] = e[0];
    this.setState(state);
  }

  onToggleChange = (e) => {
    const state = this.state;
    state[e.target.name] = !JSON.parse(e.target.value);
    this.setState(state);
  }


  onSubmit = (e) => {
    e.preventDefault();
    //removed returnDate, roundTrip
    const { trip_id, leaveDate, seats, price, currency, description, smokingAllowed, musicAllowed, petsAllowed } = this.state;

    const updateRef = this.props.firebase.trip(trip_id);
    updateRef.update({
      leaveDate, seats, price, currency, description, smokingAllowed, petsAllowed, musicAllowed }).then((docRef) => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push("/trips/"+ trip_id)
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  render() {

    const { startAddress, startCity, endAddress, endCity, leaveDate, seats, price, currency, description, smokingAllowed, musicAllowed, petsAllowed } = this.state;

    const isInvalid = leaveDate === '' || seats === '' || price === '' || description === '';
    return (
      <div className="container">
      <div className="panel panel-default page">
        <div className="panel-heading">
        <center>
          <h3 className="panel-title">
            Edit your trip
          </h3>
        </center>
        </div>
        <div className="panel-body">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <div className="form-control">From: <strong>{startAddress}, {startCity}</strong></div>
            </div>
            <div className="form-group">
              <div className="form-control">To: <strong>{endAddress}, {endCity}</strong></div>
            </div>
            <div className="form-group">
              <Flatpickr data-enable-time className="form-control" placeholder="Select leave date"
                value={leaveDate.seconds * 1000}
                onChange={this.onLeaveDateChange} />
            </div>
            {/*<div hidden={!roundTrip} className="form-group">
              <Flatpickr data-enable-time className="form-control" placeholder="Select leave date"
                value={returnDate}
                onChange={this.onReturnDateChange} />
            </div>
            <div className="form-group">
              <span className="form-control">
                <input type="checkbox" name="roundTrip" checked={roundTrip} value={roundTrip} onChange={this.onToggleChange} /> Round trip
              </span>
            </div>*/}
            <div className="form-group">
              <span className="form-control">
              <input type="checkbox" name="petsAllowed" onChange={this.onToggleChange} checked={petsAllowed} value={petsAllowed} />
              <img src={petsAllowed? pets : nopets} alt="Pets" className="prefs" title={petsAllowed? "Pets are allowed" : "No pets, sorry."}/>
              <input type="checkbox" name="smokingAllowed" onChange={this.onToggleChange} checked={smokingAllowed} value={smokingAllowed} />
              <img src={smokingAllowed? smoking : nosmoking} alt="Smoking" className="prefs" title={smokingAllowed? "Smoking is allowed" : "No smoking, sorry."}/>
              <input type="checkbox" name="musicAllowed" onChange={this.onToggleChange} checked={musicAllowed} value={musicAllowed} />
              <img src={musicAllowed? music : nomusic} alt="Music" className="prefs" title={musicAllowed? "Music playing" : "No music, sorry."}/>
              </span>
            </div>
            <div className="form-group">
              <select name="seats" onChange={this.onChange} value={seats} className="form-control width40" >
                <option defaultValue disabled>Select number of seats</option>
                <option value="1">1 Seat</option>
                <option value="2">2 Seats</option>
                <option value="3">3 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="6">6 Seats</option>
              </select>
            </div>
            <div className="form-group">
              <input type="number" className="form-control width30" name="price" value={price} onChange={this.onChange} placeholder="Seat price" />
              <select name="currency" onChange={this.onChange} value={currency} className="form-control width10">
                <option value="лв.">лв.</option>
                <option value="€">€</option>
                <option value="$">$</option>
                <option value="£">£</option>
              </select>
            </div>
            <div className="form-group">

            </div>
            <div className="form-group">
              <textarea className="form-control" name="description" onChange={this.onChange} placeholder="Description" value={description} cols="80" rows="3"></textarea>
            </div>

            <button type="submit" disabled={isInvalid} className="btn btn-primary btn-brum">Update Trip</button>
          </form>
        </div>
      </div>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(EditTrip);
