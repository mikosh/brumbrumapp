import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import './material_green.css'

import Flatpickr from 'react-flatpickr'

const INITIAL_STATE = {
  key: '',
  startAddress: '',
  startCity: '',
  startLat: '',
  startLon: '',
  endAddress: '',
  endCity: '',
  endLat: '',
  endLon: '',
  leaveDate: '',
  returnDate: new Date(),
  roundTrip: false,
  smokingAllowed: false,
  petsAllowed: false,
  musicAllowed: false,
  deleted: false,
  driver: '',
  driverName: '',
  driverAge: '',
  price: '',
  currency: 'лв.',
  seats: '1',
  description: '',
  imageUrl: ''
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
        this.setState({
          key: doc.id,
          startAddress: trip.startAddress,
          startCity: trip.startCity,
          startLat: trip.startLat,
          startLon: trip.startLon,
          endAddress: trip.endAddress,
          endCity: trip.endCity,
          endLat: trip.endLat,
          endLon: trip.endLon,
          leaveDate: new Date(trip.leaveDate.seconds * 1000),
          returnDate: new Date(trip.returnDate.seconds * 1000),
          roundTrip: trip.roundTrip,
          smokingAllowed: trip.smokingAllowed,
          petsAllowed: trip.petsAllowed,
          musicAllowed: trip.musicAllowed,
          deleted: trip.deleted,
          driver: trip.driver,
          driverName: trip.driverName,
          driverAge: trip.driverAge,
          price: trip.price,
          currency: trip.currency,
          seats: trip.seats,
          description: trip.description,
          imageUrl: trip.imageUrl
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  onChange = (e) => {
    const state = this.state;
    console.log("Print: ", e.target.name);
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

    const { leaveDate, returnDate, seats, price, currency, description, smokingAllowed, roundTrip, petsAllowed, musicAllowed } = this.state;

    const updateRef = this.props.firebase.trip(this.state.key);
    updateRef.update({
      leaveDate, returnDate, seats, price, currency, description, smokingAllowed, roundTrip, petsAllowed, musicAllowed
    }).then((docRef) => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push("/trips/"+this.props.match.params.id)
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  render() {
    const { startAddress, endAddress, startCity, endCity, leaveDate, returnDate, seats, price, currency, description, smokingAllowed, roundTrip, petsAllowed, musicAllowed } = this.state;

    const isInvalid = startAddress === '' || endAddress === '' || leaveDate === '' || seats === '' || price === '' || description === '';
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
                value={leaveDate}
                onChange={this.onLeaveDateChange} />
            </div>
            <div hidden={!roundTrip} className="form-group">
              <Flatpickr data-enable-time className="form-control" placeholder="Select leave date"
                value={returnDate}
                onChange={this.onReturnDateChange} />
            </div>
            <div className="form-group">
              <span className="form-control">
                <input type="checkbox" name="roundTrip" checked={roundTrip} value={roundTrip} onChange={this.onToggleChange} /> Round trip
              </span>
            </div>
            <div className="form-group">
              <span className="form-control">
                <input type="checkbox" name="petsAllowed" onChange={this.onToggleChange} checked={petsAllowed} value={petsAllowed} /> Pets allowed
              </span>
            </div>
            <div className="form-group">
              <span className="form-control">
                <input type="checkbox" name="smokingAllowed" onChange={this.onToggleChange} checked={smokingAllowed} value={smokingAllowed} /> Smoking allowed
              </span>
            </div>
            <div className="form-group">
              <span className="form-control">
                <input type="checkbox" name="musicAllowed" onChange={this.onToggleChange} checked={musicAllowed} value={musicAllowed} /> Music
              </span>
            </div>
            <div className="form-group">
              <select name="seats" onChange={this.onChange} value={seats} className="form-control width40" >
                <option defaultValue disabled>Select number of seats</option>
                <option value="1">1 Seat</option>
                <option value="2">2 Seats</option>
                <option value="3">3 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5+">5+ Seats</option>
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
