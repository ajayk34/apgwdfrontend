import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import LoginPage from './LoginPage'
import RegistrationPage from './RegistrationPage';
import Welcome from './Welcome';
import Admin from './Admin';
const App = () => {
  return (
    
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/registration' element={<RegistrationPage/>}/>
        <Route path='/welcome' element={<Welcome/>}/>
        <Route path='/admin' element={<Admin/>}/>
      </Routes>
      </BrowserRouter>
  )
}

export default App
