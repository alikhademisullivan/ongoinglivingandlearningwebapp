import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch,useLocation } from 'react-router-dom';


import MainPage from './components/mainPage';
import LoginPage from './components/login';
import ParentHome from './components/parentHome';
import Profile from './components/profile';
import MyCalendar from './components/ParentCalender';
import ReviewPage from './components/ReviewPage';
import AdminLoginPage from './components/adminlogin';
import ChildLoginPage from './components/childlogin';
import AdminControls from './components/AdminControls';
import RegisterChild from './components/RegisterChild';
import ChildHome from './components/childHome';
import ParentEventPage from './components/ParentEventPage';

import ChildGames from './components/childGames';
import AddChild from './components/addChild';
import Gallery from './components/Gallery';
import ParentAnnouncement from './components/ParentAnnouncement';
import newsletter from './components/newsletter';

import ReactGA from 'react-ga';
ReactGA.initialize('G-4J8GHH9Z9K');
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // New state to track if the user is an admin


  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleAdminLogin = (isAdmin) => {
    setIsAdmin(isAdmin); // Update isAdmin state based on login status
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    
    <Router>
      <Switch>
        {/* Define the most specific routes at the top */}
        <Route path="/announcements" component={ParentAnnouncement} />

        <Route exact path="/login" render={(props) => (
          isLoggedIn ? (
            <ParentHome {...props} onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />
          ) : (
            <LoginPage {...props} onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />
          )
        )}
        />
        <Route path="/profile" render={(props) => (
          <Profile {...props} userInfo={userInfo} />
        )}
        />
        <Route path="/register" render={(props) => (
          <RegisterChild {...props} userInfo={userInfo} />
        )}

        />
        <Route path="/Reviews" component={ReviewPage} />
        <Route path="/events" component={ParentEventPage} />        <Route exact path="/Adminlogin">
          <AdminLoginPage onLogin={handleAdminLogin} />
        </Route>
        <Route path="/AdminControls">
          <AdminControls isAdmin={isAdmin} />
        </Route>
        <Route path="/newsletter" component={newsletter} />
        <Route path="/Gallery" component={Gallery} />
        <Route path="/Calendar" component={MyCalendar} />
        <Route path="/childlogin" component={ChildLoginPage} />
        <Route path="/AddChild" component={AddChild} />
        <Route path="/ChildHome" component={ChildHome} />
        <Route path="/ChildGames" component={ChildGames} />
        <Route path="/">
          <MainPage />
        </Route>

        <Route path="/profile" render={(props) => <Profile {...props} userInfo={userInfo} />} />
        <Route path="/register" render={(props) => <RegisterChild {...props} userInfo={userInfo} />} />
        <Route path="/AdminControls" component={AdminControls} />
        <Route path="/Adminlogin" component={AdminLoginPage} />
        <Route path="/childlogin" component={ChildLoginPage} />
        <Route path="/ChildHome" component={ChildHome} />
        <Route path="/ChildGames" component={ChildGames} />
        <Route path="/AddChild" component={AddChild} />
        <Route path="/Reviews" component={ReviewPage} />

        {/* The least specific route, typically the home page, should come last */}
        <Route exact path="/" component={MainPage} />
      </Switch>
    </Router>
  );
}

export default App;
