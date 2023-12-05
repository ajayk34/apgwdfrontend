import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import Welcome from './Welcome';
import Admin from './Admin'
const LoginPage = () => {
  const [successState, setSuccessState] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [userComponent, setUserComponent] = useState(null);

  // submit function
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/login', loginData);
      const { success, message, designation } = response.data;
      console.log("success", success);
      setSuccessState(success);

      if (success) {
        console.log('Login Successfully');

        // Set userComponent based on designation
        if (designation === 'admin') {
          setUserComponent(<AdminComponent />);
        } else if (designation === 'user') {
          setUserComponent(<UserComponent />);
        } else if (designation === 'employee') {
          setUserComponent(<EmployeeComponent />);
        }
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error('Login error', error);
    }

    setLoginData({
      username: '',
      password: '',
    });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLoginSubmit}>
        <input
          type='text'
          name='username'
          placeholder='Username'
          value={loginData.username}
          onChange={handleLoginChange}
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={loginData.password}
          onChange={handleLoginChange}
          required
        />
        <button type='submit'>Login</button>
        <p>
          Not registered yet? <Link to='/registration'>Register Here</Link>
        </p>
      </form>

      {/* Render the userComponent */}
      {userComponent}
    </div>
  );
};

const AdminComponent = () => {
  return ( <Admin/>)
    {/* Add Admin-specific content here */}
  
};

const UserComponent = () => {
  return ( <Welcome/>)
};

const EmployeeComponent = () => {
  return ( <Welcome/>)
};

export default LoginPage;
