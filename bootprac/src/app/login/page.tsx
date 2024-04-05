'use client';
import { useRouter } from 'next/navigation';

import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext, { AuthContextType } from '@/context/AuthContext';
import Link from 'next/link';


const Login = () => {
  const auth = useContext(AuthContext) as AuthContextType;
  const router = useRouter();
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = formData;

  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formIsValid = true;
    setError('');
    if (username === '') {
      setUsernameError('Please enter Username or Email id ');
      formIsValid = false;
    } else {
      formIsValid = true;
      setUsernameError('');
    }

    // if (email.trim() === '') {
    //   setEmailError('Email is required');
    //   formIsValid = false;
    // } else if (!/\S+@\S+\.\S+/.test(email)) {
    //   setEmailError('Email is invalid');
    //   formIsValid = false;
    // } else {
    //   setEmailError('');
    // }

    if (password === '') {
      setPasswordError('Password is required');
      formIsValid = false;
    } else {
      setPasswordError('');
    }

  
    if (formIsValid) {
    // If form is valid, proceed with submission
    try {
      const response = await axios.post(
        'http://localhost:3001/api/auth/login',
        { username, email : username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Login successful');
      localStorage.setItem('_id', response.data.user._id);
      localStorage.setItem('token', response.data.token);

      auth.login();
      router.push('/');
    } catch (err: any) {
      console.log(err);
      setError( err.response.data.error||err.response.data ||'something went wrong');
    }
  }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-4 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-24 w-auto" src="news.png" alt="logo" />
        <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-teal-600">Sign in to your account</h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="space-y-6" onSubmit={onSubmit}>
          {/* Username input */}
          <div>
            <label htmlFor="username" className="block font-medium leading-6 text-gray-900">Username or Email Id</label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={onChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              />
            </div>
            {/* Display error message if username is invalid */}
            {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
          </div>

          {/* Email input */}
          {/* <div>
            <label htmlFor="email" className="block font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={onChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              />
            </div> */}
            {/* Display error message if email is invalid */}
            {/* {emailError && <p className="mt-1 text-red-500 text-sm">{emailError}</p>}
          </div> */}

          {/* Password input */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block font-medium leading-6 text-gray-900">Password</label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-teal-600 hover:text-teal-500">Forgot password?</a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={onChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              />
            </div>
            {/* Display error message if password is invalid */}
            {passwordError && <p className="mt-1 text-red-500 text-sm">{passwordError}</p>}
          </div>

          {/* Submit button */}
          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Sign in</button>
          </div>
        </form>

        {/* Register link */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Not a member?
          <a href="/register" className="font-semibold leading-6 text-teal-500 hover:text-teal-500"> Register</a>
        </p>

       
      </div>
    </div>
  );
};

export default Login;
