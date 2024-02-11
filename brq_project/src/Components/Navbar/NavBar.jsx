import React, { useEffect, useState } from 'react'
import styles from './NavBar.module.scss'
import dp from '../../assets/2.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const adminPath = '/adminDashboard'
  // console.log(typeof(currentPath))
  const presentUser=currentPath.split('/')[2];
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('/Backend.json')
      .then(response => response.json())
      .then(data => {
        const filteredStudents = data.students.filter(student => student.username === presentUser);
        setStudents(filteredStudents[0]);
      })
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  const studentLogout = ()=>{
    navigate('/studentLogin')
  }

  const adminLogout = ()=>{
    navigate('/adminLogin')
  }

  return (
 <div className={styles.navbar}>
      <div className={styles.topLeft}>
        <p>Dashboard</p>
      </div>
      <div className={styles.topRight}>

{
      presentUser&& <button onClick={studentLogout} className={styles.login} >Logout</button>
}

{
      currentPath===adminPath && <button onClick={adminLogout} className={styles.login} >Logout</button>
}

            
      </div>
    </div>
  )
}

export default NavBar;