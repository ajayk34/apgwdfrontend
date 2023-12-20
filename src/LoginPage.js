import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory, Navigate } from 'react-router-dom';
import Welcome from './Welcome';
import Admin from './Admin'
const LoginPage = () => {
  const [successState, setSuccessState] = useState(false);
  const [designation, setDesignation] = useState("");
  const [gdistrict, setGdistrict] = useState("");
  const [us, setus] = useState("");

  
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
      const { success, message, designation,district,username} = response.data;
      console.log("success", success);
      setSuccessState(success);

      if (success) {
        console.log('Login Successfully');

        setus(username);
        setGdistrict(district);
        setDesignation(designation);
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
      {
        designation==='admin' && (<Navigate to="/admin" replace={true} state={{district: gdistrict,name:us}}/>)
        
      }
      {
        designation==='employee' && (<Navigate to="/employee" replace={true} state={{district: gdistrict,name:us}}/>)
        
      }
      {
        designation==='jd' && (<Navigate to="/jd" replace={true}/>)
        
      }
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


export default LoginPage;
