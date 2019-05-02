import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
import 'firebase/storage'


const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};


class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();

    this.db.settings({
      timestampsInSnapshots: true
    });
  }

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.profiles().where("userId", "==", authUser.uid).get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  const userProfile = doc.data();
                  userProfile.id = doc.id;
                  // merge auth and db user profile
                  authUser = {
                    uid: authUser.uid,
                    email: authUser.email,
                    emailVerified: authUser.emailVerified,
                    providerData: authUser.providerData,
                    ...userProfile,
                  };

                  next(authUser);
              });
          });
      } else {
        fallback();
      }
    });

  // *** Auth API ***

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  doDeleteUser = () => {
    this.auth.currentUser.delete().then(() => {
      console.log("User deleted");
    }).catch(function(error) {
      console.error("Error deleting user: ", error);
    });
  }

  // *** Storage API ***
  storage = () => this.storage;

  // *** Trip API ***

  trip = id => this.db.collection('trips').doc(id);

  trips = () => this.db.collection('trips');


  // *** Profile API ***

  profile = id => this.db.collection('profiles').doc(id);

  profiles = () => this.db.collection('profiles');

  results = () => this.db.collection('survey');

  // *** Message API ***

  //message = uid => this.db.ref(`messages/${uid}`);

  conversations = () => this.db.collection('conversations');
  conversation = id => this.db.collection('conversations').doc(id);
  messages = id => this.db.collection('conversations').doc(id).collection('messages');

  // *** Survey API ***

  survey = () => this.db.collection('survey');

  reservations = () => this.db.collection('reservations');
  reservation = id => this.db.collection('reservations').doc(id);
  res_messages = id => this.db.collection('reservations').doc(id).collection('messages');


  ratings = () => this.db.collection('reviews');
  rating = id => this.db.collection('reviews').doc(id);

  batch = () => this.db.batch();

}

export default Firebase;
