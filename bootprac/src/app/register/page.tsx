"use client"
import { useState, useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Register = () => {
    const router = useRouter();
    const [formData2, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });

    const { username, email, password, password2 } = formData2;
    const [error, setError] = useState('');

    const onChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData2, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setError('');

        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };

     
    const data = {
        username: username,
        email: email,
        password: password,
      };

        try {
            // Make POST request to register endpoint
            const response = await axios.post('http://localhost:3001/api/auth/register', data,config);

            console.log('Registration successful');
            router.push('/login');
            // Redirect or perform any other action upon successful registration
        } catch (e: any) {
            console.log('error ', e.message);
            setError(e.response.data.error || 'something went wrong');
          }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-4 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-24 w-auto" src="news.png" alt="Company Logo" />
                <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-teal-600">Sign in to your account</h2>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form className="space-y-6" onSubmit={(e) => onSubmit(e)}>
                    <div>
                        <label htmlFor="username" className="block font-medium leading-6 text-gray-900">User name</label>
                        <div className="mt-2">
                            <input id="username" name="username" 
                            type="text"
                            placeholder='Enter username'
                             autoComplete="text" 
                             required
                             value={username}
                              onChange={(e) => onChange(e)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block font-medium leading-6 text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input id="email" 
                            name="email" 
                            type="email"
                            placeholder='Enter Email Address'
                             autoComplete="email" 
                             required 
                             value={email}
                              onChange={(e) => onChange(e)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block font-medium leading-6 text-gray-900">Password</label>
                        <div className="mt-2">
                            <input id="password"
                             name="password"
                              type="password" 
                              placeholder='Password'
                              autoComplete="new-password" 
                              required value={password}
                              onChange={(e) => onChange(e)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="password2" className="block font-medium leading-6 text-gray-900">Confirm password</label>
                        <div className="mt-2">
                            <input id="password2"
                             name="password2"
                              type="password"  required 
                              value={password2} onChange={onChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Register</button>
                    </div>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Already a member?
                    <a href="/login" className="font-semibold leading-6 text-teal-500 hover:text-teal-500"> Login</a>
                </p>
            </div>
        </div>
    );
};




export default Register;
