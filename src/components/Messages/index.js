import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import Moment from 'react-moment';
import { AuthUserContext } from '../Session';
import { FaRegPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import profile from '../../assets/profile.png';


class MessagesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      loading: false,
      messages: [],
      conversation: '',
      conversationId: '',
      reservation: '',
      trip: '',
      currentUser: ''
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      const messagesObject = doc.data();
      messagesObject.id = doc.id;
      messages.push(messagesObject);
    });
    messages.sort((a,b) => {
      var c = new Date(a.created.seconds * 1000);
      var d = new Date(b.created.seconds * 1000);
      return c-d;
    });

    this.setState({
      loading: false,
      messages
    });
  }

  onChangeText = (e) => {
    this.setState({ content: e.target.value });
  };

  onConfirm = (e) => {
    e.preventDefault();
    const {currentUser, reservation, conversation, trip} = this.state;
    if (reservation) {
      this.props.firebase.reservation(conversation.reservation_id).update({
        accepted: 1,
        updated: new Date()
      }).then((docRef) => {
        console.log("Reservation updated!");
        reservation.accepted = 1;
        this.setState({reservation});
      })
      .catch((error) => {
        console.error("Error adding message: ", error);
      });
      this.messages.add({
        content: "Reservation request accepted.",
        created: new Date(),
        senderID: currentUser,
        recipientId: currentUser === conversation.sender? conversation.recipient : conversation.sender,
        senderName: ''
      }).then((docRef) => {
        this.conversation.update({
          lastMessage: "Reservation request accepted.",
          senderRead: currentUser === conversation.sender? true : false,
          recipientRead: currentUser === conversation.recipient? true : false,
          updated: new Date()
        }).then((docRef) => {
          //console.log("Conversation updated!");
        })
        .catch((error) => {
          console.error("Error adding message: ", error);
        });
      })
      .catch((error) => {
        console.error("Error adding message: ", error);
      });

      this.props.firebase.trip(conversation.tripId).update({
        seats: (Number(trip.seats) - 1).toString()
      }).then((docRef) => {
        //console.log("Trip seats updated!");
      })
      .catch((error) => {
        console.error("Error adding message: ", error);
      });
    }
  }

  onReject = (e) => {
    e.preventDefault();
    const {currentUser, reservation, conversation} = this.state;
    if (reservation) {
      this.props.firebase.reservation(conversation.reservation_id).update({
        accepted: 2,
        updated: new Date()
      }).then((docRef) => {
        console.log("Reservation updated!");
        reservation.accepted = 2;
        this.setState({reservation});
      })
      .catch((error) => {
        console.error("Error adding message: ", error);
      });
      this.messages.add({
        content: "Reservation request rejected.",
        created: new Date(),
        senderID: currentUser,
        recipientId: currentUser === conversation.sender? conversation.recipient : conversation.sender,
        senderName: ''
      }).then((docRef) => {
        this.conversation.update({
          lastMessage: "Reservation request rejected.",
          senderRead: currentUser === conversation.sender? true : false,
          recipientRead: currentUser === conversation.recipient? true : false,
          updated: new Date()
        }).then((docRef) => {
          console.log("Conversation updated!");
        })
        .catch((error) => {
          console.error("Error adding message: ", error);
        });
      })
      .catch((error) => {
        console.error("Error adding message: ", error);
      });
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const {content, currentUser, conversation, conversationId} = this.state;
    this.messages.add({
      content,
      created: new Date(),
      senderID: currentUser,
      recipientId: currentUser === conversation.sender? conversation.recipient : conversation.sender,
      senderName: currentUser === conversation.sender? conversation.senderName: conversation.recipientName
    }).then((docRef) => {
      if (conversation.reservation && conversation.reservation_id === '') {
        this.props.firebase.reservations().add({
          accepted: 0,
          driver_rating: '',
          passenger_rating: '',
          conversation_id: conversationId,
          start_city: conversation.start_city,
          end_city: conversation.end_city,
          trip_id: conversation.tripId,
          driver: conversation.recipient,
          passenger: conversation.sender,
          driver_url: conversation.recipientUrl,
          passenger_url: conversation.senderUrl,
          driver_name: conversation.recipientName,
          passenger_name: conversation.senderName,
          driver_profile: conversation.recipientProfileId,
          passenger_profile: conversation.senderProfileId,
          updated: new Date(),
          created: new Date(),
        }).then((docRef) => {
          console.log("Reservation created!");
          this.conversation.update({
            reservation_id: docRef.id,
            updated: new Date()
          }).then((docRef) => {
            console.log("Conversation updated!");
          })
          .catch((error) => {
            console.error("Error updating conversation: ", error);
          });
        })
        .catch((error) => {
          console.error("Error reservation: ", error);
        });
      }
      this.setState({ content: '' });
    })
    .catch((error) => {
      console.error("Error adding message: ", error);
    });

    this.conversation.update({
      lastMessage: content,
      deleted: false,
      deletedBy: '',
      senderRead: currentUser === conversation.sender? true : false,
      recipientRead: currentUser === conversation.recipient? true : false,
      updated: new Date()
    }).then((docRef) => {
      //console.log("Conversation updated!");
    })
    .catch((error) => {
      console.error("Error adding message: ", error);
    });
  };

  deleteConversation(id){
    this.props.firebase.conversation(id).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.setState({ loading: true });

    if (localStorage.hasOwnProperty('authUser')) {
        // get the key's value from localStorage
        let value = localStorage.getItem('authUser');

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ currentUser: value.uid });

        } catch (e) {
          console.log("parsing error! ", e);
        }
    } else {
      console.log("User not found");
    }

    this.messages = this.props.firebase.messages(params.id);
    this.conversation = this.props.firebase.conversation(params.id);
    this.props.firebase.messages(params.id).onSnapshot(this.onCollectionUpdate);
    this.props.firebase.conversation(params.id).get().then((doc) => {
        if (doc.exists) {
            const conversation = doc.data();
            if (conversation.reservation_id) {
              this.props.firebase.reservation(conversation.reservation_id).get().then((doc) => {
                  if (doc.exists) {
                      const reservation = doc.data();
                      this.setState({
                        reservation: reservation
                      });
                  } else {
                      // doc.data() will be undefined in this case
                      console.log("Reservation does not exist!");
                  }
              }).catch(function(error) {
                    console.log("Error getting reservation:", error);
              });
              this.props.firebase.trip(conversation.tripId).get().then((doc) => {
                  if (doc.exists) {
                      const trip = doc.data();
                      this.setState({
                        trip: trip
                      });
                  } else {
                      // doc.data() will be undefined in this case
                      console.log("Trip does not exist!");
                  }
              }).catch(function(error) {
                    console.log("Error getting reservation:", error);
              });
            }
            this.setState({
              conversationId: doc.id,
              conversation: conversation
            });

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting conversations:", error);
    });
  }

  componentWillUnmount() {
    const { match: { params } } = this.props;
    this.props.firebase.conversation(params.id).get().then((doc) => {
        if (doc.exists) {
            const conversation = doc.data();
            conversation.id = doc.id;
            if (conversation.lastMessage.length === 0) {
              this.deleteConversation(conversation.id);
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting conversations:", error);
    });

    this.setState({
      content: '',
      loading: false,
      messages: [],
      conversation: '',
      conversationId: '',
      reservation: '',
      currentUser: ''
    });
  }

  render() {
    window.scrollTo(0,9999);
    const { content, loading, messages, conversation, reservation } = this.state;
    return (
      <div className="container">
      <div id="messages" className="page">

        {loading && <div>Loading ...</div>}

        <AuthUserContext.Consumer>
          {authUser => (
            <div className="list-group">

              {(authUser.uid === conversation.recipient && ((conversation.reservation === true && conversation.reservation_id === '') || (reservation && reservation.accepted === 0))) &&
                <div className="list-group-item d-flex w-100 justify-content-between info">
                  <div className="mb-1">
                    <Link to={`/profile/${conversation.sender}`} className="brum-link" title="View Profile">
                    <img src={conversation.senderUrl? conversation.senderUrl : profile} alt="Avatar" className="avatar"/>
                    <span> {conversation.senderName} </span>
                    </Link>
                    <span> wants to travel with you from {conversation.start_city} to {conversation.end_city} </span>
                  </div>
                  <div className="reservationButtons">
                    <span className="input-group-btn">
                      <button className="btn btn-success btn-sm" type="button" onClick={ this.onConfirm }>Confirm reservation</button>
                      <button className="btn btn-danger btn-sm" type="button" onClick={ this.onReject }>Reject</button>
                    </span>
                  </div>
                </div>
              }

              {(authUser.uid === conversation.sender && (conversation.reservation === true && conversation.reservation_id === '')) &&
                <div className="list-group-item d-flex w-100 justify-content-between info">
                  <div className="mb-1">
                    <span> Send </span>
                    <Link to={`/profile/${conversation.recipient}`} className="brum-link" title="View Profile">
                    <img src={conversation.recipientUrl? conversation.recipientUrl : profile} alt="Avatar" className="avatar"/>
                    <span> {conversation.recipientName} </span>
                    </Link>
                    <span> a message and ask if you can travel with him. </span>
                  </div>
                </div>
              }

              {authUser.uid === conversation.recipient && reservation && reservation.accepted === 1 &&
                  <div className="list-group-item d-flex w-100 justify-content-between info">
                    <div className="mb-1">
                      <span>Great! </span>
                      <Link to={`/profile/${conversation.sender}`} className="brum-link" title="View Profile">
                      <img src={conversation.senderUrl? conversation.senderUrl : profile} alt="Avatar" className="avatar"/>
                      <span> {conversation.senderName} </span>
                      </Link>
                      <span> is travelling with you from {conversation.start_city} to {conversation.end_city} </span>
                    </div>
                  </div>
              }

              {authUser.uid === conversation.recipient && reservation && reservation.accepted === 2 &&
                  <div className="list-group-item d-flex w-100 justify-content-between info">
                    <div className="mb-1">
                      <span>You have rejected the travel request from {conversation.start_city} to {conversation.end_city} of </span>
                      <Link to={`/profile/${conversation.sender}`} className="brum-link" title="View Profile">
                      <img src={conversation.senderUrl? conversation.senderUrl : profile} alt="Avatar" className="avatar"/>
                      <span> {conversation.senderName} </span>
                      </Link>
                    </div>
                    <div className="reservationButtons">
                      <span className="input-group-btn">
                        <button className="btn btn-success btn-sm" type="button" onClick={ this.onConfirm }>Accept reservation</button>
                      </span>
                    </div>
                  </div>
              }

            </div>
          )}
        </AuthUserContext.Consumer>

        <AuthUserContext.Consumer>
          {authUser => (
            <div className="mesgs">
              <div className="msg_history">
                {messages.map(message => (
                  <div className={authUser.uid === message.senderID? "outgoing_msg" : "incoming_msg"} key={message.id}>
                    <div className={authUser.uid === message.senderID? "sent_msg" : "received_msg" }>
                      <div className={authUser.uid === message.senderID? "" : "received_withd_msg" }>
                        <small>{message.senderName}</small>
                        <p>{message.content}</p>
                        <span className="time_date"><Moment format="MMM DD, HH:mm">{new Date(message.created.seconds * 1000).toISOString()}</Moment></span>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
        </AuthUserContext.Consumer>
        <nav className="navbar fixed-bottom bg-dark navbar-dark">
          <form onSubmit={ this.onSubmit } className="msg-input-form">
            <div className="form-group container">
              <div className="input-group">
                <input className="form-control"
                  type="text" placeholder="Type a message"
                  value={content}
                  onChange={this.onChangeText}
                />
                <span className="input-group-btn">
                  <button className="btn btn-primary btn-brum msg_send_btn" type="submit"><FaRegPaperPlane/></button>
                </span>
              </div>
            </div>
          </form>
        </nav>
      </div>
      </div>
    );
  }
}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(MessagesPage);
