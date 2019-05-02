import React, { Component } from 'react';
import { withAuthorization, withEmailVerification } from '../Session';

import { compose } from 'recompose';
import ConversationList from './ConversationList';



class Conversations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      conversations: [],
      currentUser: ''
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const conversations = [];
    querySnapshot.forEach((doc) => {
      const conversation = doc.data();
      conversation.id = doc.id;
      if ((conversation.deleted === false) || (conversation.deleted === true && conversation.deletedBy !== this.state.currentUser)) {
        conversations.push(conversation);
      }

      conversations.sort((a,b) => {
        var c = a.updated.toDate();
        var d = b.updated.toDate();
        return d-c;
      });
      this.setState({
          conversations
      });
    });
    this.setState({
        loading: false
    });

  }

  componentDidMount() {
    if (localStorage.hasOwnProperty('authUser')) {
        // get the key's value from localStorage
        let value = localStorage.getItem('authUser');
        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          const userId = value.uid;
          this.setState({ loading: true, currentUser: userId });
          this.senderListener = this.props.firebase.conversations().where("sender", "==", userId).onSnapshot(this.onCollectionUpdate);
          this.recipientListener = this.props.firebase.conversations().where("recipient", "==", userId).onSnapshot(this.onCollectionUpdate);
        } catch (e) {
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }
  }

  componentWillUnmount() {
    this.senderListener();
    this.recipientListener();
    this.setState({
      loading: false,
      updated: false,
      conversations: [],
      currentUser: ''
    });
  }

  render() {
    const { loading, conversations, currentUser } = this.state;
    return (
      <div className="container">
        <div id="conversations" className="page">

          {loading && <div>Loading ...</div>}
          {!loading && conversations && conversations.length === 0 &&
            <div className="alert alert-info" role="alert">
              <center>You have no messages.</center>
            </div>
          }
          <ConversationList conversations={conversations} currentUser={currentUser} />
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
