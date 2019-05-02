import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';

class ResultsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      results: [],
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({id: doc.id, data: doc.data()});
    });
    this.setState({
      loading: false,
      results
    });
 }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.results().onSnapshot(this.onCollectionUpdate);
  }



  render() {
    const { loading, results } = this.state;
    console.log("Number of profiles in render: ", results.length);
    return (
      <div className="container">
      <div className="page">
        <h1>Survey users: {results.length}</h1>

        {loading && <div>Loading ...</div>}

        <ResultsList results={results} />
      </div>
      </div>
    );
  }
}

const ResultsList = ({ results }) => (
  <table>
  <tr>
    <th>Age</th>
    <th>Gender</th>
    <th>Country</th>
    <th>Driver</th>
    <th>Carpooled</th>
    <th>Carpooling reason</th>
    <th>Barriers:</th>
    <th>Companion info:</th>
    <th>Book:</th>
    <th>Post:</th>
  </tr>

    {results.map(profile => (
      <tr key={profile.id}>
        <td>
          {profile.data.age}
        </td>
        <td>
          {profile.data.gender}
        </td>
        <td>
          {profile.data.country}
        </td>
        <td>
          {profile.data.driver}
        </td>
        <td>
          {profile.data.carpooled}
        </td>
        <td>
          {profile.data.carpooling_reason}
        </td>
        <td>
          {profile.data.barriers}
        </td>
        <td>
          {profile.data.companion_info}
        </td>
        <td>
          {profile.data.book_a_trip}
        </td>
        <td>
          {profile.data.post_a_trip}
        </td>
      </tr>
    ))}
  </table>
);

const condition = authUser =>
  authUser && authUser.email.includes(ROLES.ADMIN);

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withFirebase,
)(ResultsPage);
