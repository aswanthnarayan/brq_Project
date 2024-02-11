import React, { useState } from 'react';
import styles from './AdminLoginPage.module.scss';
import { Link, useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/Backend.json');
            const data = await response.json();
            if (username === data.admin.username && password === data.admin.password) {
                navigate('/adminDashboard');
            } else {
                setError(true);
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };
  return (
    <div className={styles.login}>
    <p className={styles.loginTitle}>Admin Login</p>
    <form className={styles.loginForm} onSubmit={handleLogin}>
        <label>Username</label>
        <input className={styles.loginInput} type="text" placeholder="Enter Admin Username..." value={username}
            onChange={(e) => setUsername(e.target.value)} />
        <label>Password</label>
        <input className={styles.loginInput} type="password" placeholder="Enter your password..." value={password}
            onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className={styles.loginButton}>Login</button>
    </form>
    <button className={styles.loginRegisterButton}>
        <Link to='/studentLogin'>User Login</Link>
    </button>
    {
        error && <span className={styles.error}>Wrong Credentials..</span>
    }
</div>
    )
}

export default AdminLoginPage