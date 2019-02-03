import React, { Component } from 'react';
import { withAuthorization, withEmailVerification } from '../Session';

import { compose } from 'recompose';
import ConversationList from './ConversationList';



class Conversations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      updated: false,
      conversations: [],
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const conversations = [];
    querySnapshot.forEach((doc) => {
      const conversationsObject = doc.data();
      conversationsObject.id = doc.id;
      conversations.push(conversationsObject);
    });
    conversations.sort((a,b) => {
      var c = a.updated.toDate();
      var d = b.updated.toDate();
      return d-c;
    });
    if (this.state.updated) {
      var allConversations = this.state.conversations;

      Array.prototype.push.apply(allConversations, conversations);
      allConversations.sort((a,b) => {
        var c = a.updated.toDate();
        var d = b.updated.toDate();
        return d-c;
      });
      this.setState({
        loading: false,
        updated: false,
        conversations: allConversations
      });
    } else {
      this.setState({
        updated: true,
        conversations
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
          const userId = value.uid;
          this.setState({ loading: true });
          this.props.firebase.conversations().where("sender", "==", userId).onSnapshot(this.onCollectionUpdate);
          this.props.firebase.conversations().where("recipient", "==", userId).onSnapshot(this.onCollectionUpdate);
        } catch (e) {
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }
  }

  componentWillUnmount() {

  }

  render() {
    const { loading, conversations } = this.state;
    return (
      <div className="container">
        <div id="conversations" className="page">

          {loading && <div>Loading ...</div>}

          <ConversationList conversations={conversations} />

        </div>
      </div>
    );
  }
}


const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Conversations);
