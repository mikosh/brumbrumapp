import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LocalizeProvider } from "react-localize-redux";

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import TripsPage from '../Trips';
import MyTripsPage from '../MyTrips';
import TripViewPage from '../Trips/show';
import NewTrip from '../Trips/new';
import EditTrip from '../Trips/edit';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import Conversations from '../Conversations';
import MessagesPage from '../Messages';
import TermsPage from '../Terms';
import PrivacyPage from '../Privacy';
import ProfilePage from '../Profile';
import SurveyPage from '../Survey';
import ResultsPage from '../Results';
import ReservationsPage from '../Reservations';
import RatingsPage from '../Ratings';
import NotificationsPage from '../Notifications';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
      <LocalizeProvider>
        <Router>
          <div>
            <Navigation />
            <main role="main" className="container-fluid">
            <Route exact path={ROUTES.ABOUT} component={LandingPage} />
            <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              exact
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route exact path={ROUTES.TRIPS} component={TripsPage} />
            <Route exact path={ROUTES.MY_TRIPS} component={MyTripsPage} />
            <Route exact path={ROUTES.NEW_TRIP} component={NewTrip} />
            <Route exact path={ROUTES.EDIT_TRIP} component={EditTrip} />
            <Route path={ROUTES.TRIP_DETAILS} component={TripViewPage} />
            <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route exact path={ROUTES.ADMIN} component={AdminPage} />
            <Route exact path={ROUTES.CONVERSATIONS} component={Conversations} />
            <Route exact path={ROUTES.MESSAGES} component={MessagesPage} />
            <Route exact path={ROUTES.TERMS} component={TermsPage} />
            <Route exact path={ROUTES.PRIVACY} component={PrivacyPage} />
            <Route exact path={ROUTES.PROFILE} component={ProfilePage} />
            <Route exact path={ROUTES.SURVEY} component={SurveyPage} />
            <Route exact path={ROUTES.RESULTS} component={ResultsPage} />
            <Route exact path={ROUTES.RESERVATIONS} component={ReservationsPage} />
            <Route exact path={ROUTES.RATINGS} component={RatingsPage} />
            <Route exact path={ROUTES.NOTIFICATIONS} component={NotificationsPage} />
            </main>
          </div>
        </Router>
      </LocalizeProvider>
);


export default withAuthentication(App);
