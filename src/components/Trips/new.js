import React, { Component } from 'react';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import { withAuthorization, withEmailVerification } from '../Session';
import LocationSearchInput from './places';
import './material_green.css'
import smoking from '../../assets/pref-smoking-yes.png';
import nosmoking from '../../assets/pref-smoking-no.png';
import pets from '../../assets/pref-pet-yes.png';
import nopets from '../../assets/pref-pet-no.png';
import music from '../../assets/pref-music-yes.png';
import nomusic from '../../assets/pref-music-no.png';
import { FaUserFriends } from "react-icons/fa";

import Flatpickr from 'react-flatpickr'

import { getLatLng } from 'react-places-autocomplete';

const INITIAL_STATE = {
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
  daily: false,
  driver: '',
  driverName: '',
  driverAge: '',
  price: '',
  currency: 'лв.',
  seats: '1',
  description: '',
  imageUrl: '',
  car: '',
  model: '',
  backseat: false
};

class NewTrip extends Component {

  constructor(props) {
    super(props);
    this.ref = this.props.firebase.trips();
    this.state = { ...INITIAL_STATE };
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

  setStartLocation = (googleLocation) => {
    getLatLng(googleLocation)
    .then(latLng => {
      this.setState({
        startLat: latLng.lat,
        startLon: latLng.lng
      })
      console.log('Success', latLng)
    })
    .catch(error => {
      console.error('Error', error)
    });
    //console.log(googleLocation);
    for (var i = 0; i < googleLocation.address_components.length; i++) {
      if (googleLocation.address_components[i].types[0] === "locality"){
        this.setState({
          startCity: googleLocation.address_components[i].short_name,
          startAddress: googleLocation.formatted_address
        })
        return;
      }
    }
  }

  setEndLocation = (googleLocation) => {
    getLatLng(googleLocation)
    .then(latLng => {
      this.setState({
        endLat: latLng.lat,
        endLon: latLng.lng
      })
      console.log('Success', latLng)
    })
    .catch(error => {
      console.error('Error', error)
    });
    //console.log(googleLocation);
    for (var i = 0; i < googleLocation.address_components.length; i++) {
      if (googleLocation.address_components[i].types[0] === "locality"){
        this.setState({
          endCity: googleLocation.address_components[i].short_name,
          endAddress: googleLocation.formatted_address
        })
        return;
      }
    }
  }

  onProfileSet = (querySnapshot) => {
    var profile = {};
    querySnapshot.forEach((doc) => {
      profile = doc.data();
      return;
    });
    if (profile) {
      this.setState({
        driver: profile.userId,
        driverName: profile.name,
        driverAge: profile.age,
        imageUrl: profile.url,
        car: profile.car,
        model: profile.model
      });
    }
 }

  componentDidMount() {
    if (localStorage.hasOwnProperty('authUser')) {
        // get the key's value from localStorage
        let value = localStorage.getItem('authUser');

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ driver: value.uid });
          this.props.firebase.profiles().where("userId", "==", value.uid).onSnapshot(this.onProfileSet);

        } catch (e) {
          // handle empty string
          //this.setState({ [key]: value });
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    //removed returnDate, roundTrip
    const { startAddress, startCity, startLat, startLon, endAddress, endCity, endLat, endLon,
       smokingAllowed, petsAllowed, musicAllowed, deleted, driver, driverName, driverAge,
       leaveDate, seats, price, currency, description, imageUrl, daily, returnDate, roundTrip, car, model, backseat } = this.state;

    this.ref.add({
      startAddress,
      startCity,
      startLat,
      startLon,
      endAddress,
      endCity,
      endLat,
      endLon,
      leaveDate,
      returnDate,
      roundTrip,
      smokingAllowed,
      petsAllowed,
      musicAllowed,
      deleted,
      driver,
      driverName,
      driverAge,
      price: parseInt(price, 10),
      currency,
      seats,
      description,
      imageUrl,
      daily,
      car,
      model,
      backseat
    }).then((docRef) => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.TRIPS)
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  render() {
    // removed: roundTrip, returnDate
    const { startAddress, endAddress, leaveDate, seats, price, currency, description, smokingAllowed, musicAllowed, petsAllowed, backseat } = this.state;

    const isInvalid = startAddress === '' || endAddress === '' || leaveDate === '' || seats === '' || price === '' || description === '';

    return (
      <div className="container">
        <div className="panel panel-default page">
          <div className="panel-heading">
          <center>
            <h3 className="panel-title">
              New trip
            </h3>
          </center>
          </div>
          <div className="panel-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <LocationSearchInput setLocation={this.setStartLocation} placeholder="Select start address" />
              </div>
              <div className="form-group">
                <LocationSearchInput setLocation={this.setEndLocation} placeholder="Select end address" />
              </div>
              <div className="form-group">
                <Flatpickr data-enable-time className="form-control" placeholder="Select leave date"
                  value={leaveDate}
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
              </div>
              */}
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
                <div className="card alert-info">
                    <div className="card-body">
                      <input type="checkbox" name="backseat" onChange={this.onToggleChange} checked={backseat} value={backseat} />
                      <FaUserFriends className="prefs"/>
                      <stong> Max. 2 in the back seat</stong>
                      <br/>
                      <small>You guarantee that max. 2 people seat in the back (travellers prefer this).</small>
                    </div>
                </div>
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

              <button type="submit" disabled={isInvalid} className="btn btn-primary btn-brum">Add Trip</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(NewTrip);
