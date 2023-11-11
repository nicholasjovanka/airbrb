import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/states';
import { apiCall } from '../../utils/utils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate();
  const { loggedIn } = useContext(StoreContext);

  const handleLogin = async () => {
    try {
      const response = await apiCall('user/auth/login', 'POST', {
        email: email,
        password: password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);

      loggedIn[1](true);

      // Redirect the user to the home page
      navigate('/home');
    } catch (error) {
      console.error('Login Error:', error.response?.data?.error || 'Unknown error');
      setError(error.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>} {/* Display the error message */}
    </div>
  );
};

export default Login;
