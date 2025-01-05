import React, { useState } from 'react';
import API from '../api';

function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error registering');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username: </label>
          <input name="username" onChange={handleChange} value={form.username} />
        </div>
        <div>
          <label>Password: </label>
          <input name="password" type="password" onChange={handleChange} value={form.password} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
