import React, { useState } from 'react';

const LoginSignup = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let url, method, body;
  
    if (isRegistering) {
      url = 'http://localhost:5000/api/auth/register'; // Update the URL
      method = 'POST';
      body = JSON.stringify({ email, password });
    } else {
      url = 'http://localhost:5000/api/auth/verify'; // Update the URL
      method = 'POST';
      body = JSON.stringify({ email, otp });
    }
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (isRegistering) {
          setMessage('Registration successful. Check your email for OTP.');
        } else {
          setMessage('Email verified. You can now log in.');
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };
  

  return (
    <div>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegistering && (
          <div>
            <button type="submit">Register</button>
          </div>
        )}
        {!isRegistering && (
          <div>
            <label htmlFor="otp">OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit">Verify OTP</button>
          </div>
        )}
        <div>
          {message && <p>{message}</p>}
        </div>
      </form>
      <div>
        <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
          Switch to {isRegistering ? 'Login' : 'Register'}
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;
