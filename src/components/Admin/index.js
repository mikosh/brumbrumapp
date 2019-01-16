import React, { Component } from 'react';
import { compose } from 'recompose';
import Moment from 'react-moment';
import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      profiles: [],
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const profiles = [];
    querySnapshot.forEach((doc) => {
      profiles.push(doc.data());
    });
    this.setState({
      loading: false,
      profiles
    });
 }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.profiles().onSnapshot(this.onCollectionUpdate);
  }



  render() {
    const { loading, profiles } = this.state;
    console.log("Number of profiles in render: ", profiles.length);
    return (
      <div className="container">
      <div className="page">
        <h1>Registered profiles: {profiles.length}</h1>

        {loading && <div>Loading ...</div>}

        <ProfileList profiles={profiles} />
      </div>
      </div>
    );
  }
}

const ProfileList = ({ profiles }) => (
  <ul>
    {profiles.map(profile => (
      <li key={profile.userId}>
        <span>
          <strong>User ID:</strong> {profile.userId}
        </span>
        <span>
          <strong>Name:</strong> {profile.name}
        </span>
        <span>
          <strong>Age:</strong> {profile.age}
        </span>
        <span>
          <strong>Sex:</strong> {profile.gender}
        </span>
        <span>
          <strong>Created:</strong> <Moment>{new Date(profile.created.seconds * 1000).toString()}</Moment>
        </span>
      </li>
    ))}
  </ul>
);

const condition = authUser =>
  authUser && authUser.email.includes(ROLES.ADMIN);

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withFirebase,
)(AdminPage);
