import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuthorization, AuthUserContext } from '../Session';
import Moment from 'react-moment';
import profile from '../../assets/profile.png';
import { FaTimes} from "react-icons/fa";

class ConversationList extends Component {

  updateConversation = (currentUser, conversationId) => (e) => {
    e.preventDefault();
    this.props.firebase.conversation(conversationId).get().then((doc) => {
        if (doc.exists) {
            const conversation = doc.data();
            let recipientRead = (currentUser === conversation.recipient)? true : conversation.recipientRead;
            let senderRead = (currentUser === conversation.sender)? true : conversation.senderRead;
            this.props.firebase.conversation(conversationId).update({
              recipientRead: recipientRead,
              senderRead: senderRead
            }).then((docRef) => {
              console.log("Conversation updated!");
              this.props.history.push(`/conversations/${conversationId}/messages`);
            })
            .catch((error) => {
              console.error("Error updating conversation: ", error);
            });

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting conversations:", error);
    });
  }

  deleteConversation = (currentUser, conversation) => (e) =>{
    e.preventDefault();
    if (conversation.deleted === true) {
      this.props.firebase.messages(conversation.id).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.props.firebase.message(conversation.id, doc.id).delete().then(() => {
                    //console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
      }).catch((error) => {
        console.log("Error getting documents: ", error);
      });
      this.props.firebase.conversation(conversation.id).delete().then(() => {
          //console.log("Document successfully deleted!");
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
    } else {
      this.props.firebase.conversation(conversation.id).update({
        deleted: true,
        deletedBy: currentUser
      }).then((docRef) => {
        //console.log("Conversation updated!");
      })
      .catch((error) => {
        console.error("Error adding message: ", error);
      });
    }
  }

  render() {
    const conversations = this.props.conversations;
    const currentUser = this.props.currentUser;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
      <div className="list-group">
        {conversations.map(c => (
          <div className="conv-container" key={c.id}>
            <Link to={`/conversations/${c.id}/messages`} onClick={this.updateConversation(currentUser, c.id)}className={authUser.uid === c.sender? (c.senderRead? "list-group-item list-group-item-action flex-column align-items-start" : "list-group-item list-group-item-action flex-column align-items-start unread") :
            (c.recipientRead? "list-group-item list-group-item-action flex-column align-items-start" : "list-group-item list-group-item-action flex-column align-items-start unread") }>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">
                <img src={authUser.uid === c.sender? (c.recipientUrl? c.recipientUrl : profile) : (c.senderUrl? c.senderUrl : profile)} alt="Avatar" className="avatar"/>
                <span> {authUser.uid === c.sender? c.recipientName :  c.senderName}</span></h5>
              </div>
              <div className="d-flex w-100 justify-content-between">
                <p className="mb-1">{c.lastMessage}</p>
                <small><Moment format="MMM DD, HH:mm">{c.updated.toDate().toISOString()}</Moment></small>
              </div>
            </Link>
            <div className="action-button">
              <button className="btn" onClick={this.deleteConversation(currentUser, c)} title="Delete"><FaTimes/></button>
            </div>
          </div>
        ))}
      </div>
    )}
    </AuthUserContext.Consumer>

    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ConversationList);
