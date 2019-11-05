import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const SIGNUP = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

const Onboarding = (props) => {
  const [fields, setFields] = useState({name: "", email: "", password: ""});
  const [signup, signupStatus] = useMutation(SIGNUP);
  const [login, loginStatus] = useMutation(LOGIN);

  const handleChange = (e) => {
    setFields({...fields, [e.target.name]: e.target.value})
    
  }

  const handleSignup = (e) => {
    e.preventDefault();
    signup({variables: fields})
      .then(results => {
          loginStatus.error = null
          localStorage.setItem('token', results.data.signup.token)
          props.setToken(results.data.signup.token)
      })
  }

  const handleLogin = (e) => {
    e.preventDefault();  
    let {email, password} = fields;
    login({variables: {email,password}})
      .then(results => {
        signupStatus.error = null
        localStorage.setItem('token', results.data.login.token)
        props.setToken(results.data.login.token)
      })
  }

  return (
    <div>
      {signupStatus.error && <p>{signupStatus.error.message}</p>}
      {loginStatus.error && <p>{loginStatus.error.message}</p>}
      <form>
        <input name="name" value={fields.name} placeholder="Name"  onChange={e => handleChange(e)} />
        <input name="email" value={fields.email} placeholder="Email"  onChange={e => handleChange(e)}/>
        <input type="password" name="password" value={fields.password} placeholder="Password"  onChange={e => handleChange(e)}/>
        <button onClick={e => handleLogin(e)}>Log in</button>
        <button onClick={e => handleSignup(e)}> Sign up</button>
      </form>
    </div>
  );
}

export default Onboarding;