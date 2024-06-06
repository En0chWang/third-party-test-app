import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Hub } from 'aws-amplify/utils';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@aws-amplify/ui-react/styles.css';

import SiteNav from './components/common/SiteNav';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import MerchantWidgetPage from './components/widget/MerchantWidgetPage';
import { AuthUser, getCurrentUser } from 'aws-amplify/auth';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  
  useEffect(() => {
    Hub.listen('auth', (event) => {
      const eventType = event.payload.event;
      if (eventType === 'signedOut' || eventType === 'signedIn') {
        updateUser();
      }
    })
  }, [])

  const updateUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    updateUser();
  }, [])

  return (
    <Router>
      <div>
        <SiteNav user={user} />
        <Routes>
          <Route path='*' element={<LandingPage user={user}/>} />
          <Route path='/landing' element={<LandingPage user={user}/>} />
          <Route path='/merchants' element={<MerchantWidgetPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
