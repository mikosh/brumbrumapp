import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import Moment from 'react-moment';
import { AuthUserContext } from '../Session';
import { FaRegPaperPlane } from 'react-icons/fa';


class MessagesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      senderID: '',
      recipientId: '',
      senderName: '',
      loading: false,
      messages: [],
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

  onSubmit = (e) => {
    e.preventDefault();
    const {content, senderID, recipientId, senderName} = this.state;
    this.messages.add({
      content,
      created: new Date(),
      senderID,
      recipientId,
      senderName
    }).then((docRef) => {
      this.setState({ content: '' });
    })
    .catch((error) => {
      console.error("Error adding message: ", error);
    });
    this.conversation.update({
      lastMessage: content,
      updated: new Date()
    }).then((docRef) => {
      console.log("Conversation updated!");
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
    this.messages = this.props.firebase.messages(params.id);
    this.conversation = this.props.firebase.conversation(params.id);
    this.props.firebase.messages(params.id).onSnapshot(this.onCollectionUpdate);
    this.props.firebase.conversation(params.id).get().then((doc) => {
        if (doc.exists) {
            const conversation = doc.data();
            this.setState({
              senderID: conversation.sender,
              senderName: conversation.senderName,
              recipientId: conversation.recipient
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
  }

  render() {
    window.scrollTo(0,9999);
    const { content, loading, messages } = this.state;
    return (
      <div className="container">
      <div id="messages" className="page">

        {loading && <div>Loading ...</div>}

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
