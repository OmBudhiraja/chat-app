import React from 'react';
import {Switch} from 'react-router-dom'
import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss'
import SignIn from './pages/SignIn' 
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import {ProfileProvider} from './context/profiles.context'

function App() {
  return (
    <ProfileProvider>
      <Switch>
        <PublicRoute exact path="/signin">
          <SignIn />
        </PublicRoute>
        <PrivateRoute path="/">
          <Home />
        </PrivateRoute>
    </Switch>
    </ProfileProvider>
  );
}

export default App;
