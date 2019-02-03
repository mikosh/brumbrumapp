import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuthorization, AuthUserContext } from '../Session';
import Moment from 'react-moment';
import profile from '../../assets/profile.png';


class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversation_id: null
    };
  }

  setConversation = id => {
    this.setState({conversation_id: id});
  }



  render() {
    const conversations = this.props.conversations;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
      <div className="list-group">
        {conversations.map(c => (
          <Link to={`/conversations/${c.id}/messages`} key={c.id} className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">
              <img src={authUser.uid === c.sender? (c.recipientUrl? c.recipientUrl : profile) : (c.senderUrl? c.senderUrl : profile)} alt="Avatar" className="avatar"/>
              <span> {authUser.uid === c.sender? c.recipientName :  c.senderName}</span></h5>
              <small><Moment format="MMM DD, HH:mm">{c.updated.toDate().toISOString()}</Moment></small>
            </div>
            <p className="mb-1">{c.lastMessage}</p>
          </Link>
        ))}
      </div>
    )}
    </AuthUserContext.Consumer>

    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ConversationList);
