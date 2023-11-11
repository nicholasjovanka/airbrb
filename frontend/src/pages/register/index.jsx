import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/states';
import { apiCall } from '../../utils/utils';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loggedIn } = useContext(StoreContext);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await apiCall('user/auth/register', 'POST', {
        email,
        name,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', email);
        loggedIn[1](true);
        navigate('/home');
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
      <button onClick={handleRegister}>Register</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register;
