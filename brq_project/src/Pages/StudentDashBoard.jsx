import React, { useState, useEffect } from 'react';
import styles from './StudentDashBoard.module.scss'
import dp from '../assets/2.jpg';
import { useLocation, useParams } from 'react-router-dom'

const StudentDashBoard = () => {
  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const monthsPerPage = 3; 
  const {username} = useParams();

  useEffect(() => {
    fetch('/Backend.json')
      .then(response => response.json())
      .then(data => {

        const filteredStudents = data.students.filter(student => student.username === username);
        setStudents(filteredStudents);

        let subjects = [];
        filteredStudents.forEach(student => {
          Object.keys(student.monthly_marks).forEach(month => {
            Object.keys(student.monthly_marks[month]).forEach(subject => {
              if (!subjects.includes(subject)) {
                subjects.push(subject);
              }
            });
          });
        });
        setAllSubjects(subjects);
      })
      .catch(error => console.error('Error fetching students:', error));
  }, [username]);

   const indexOfLastMonth = currentPage * monthsPerPage;
   const indexOfFirstMonth = indexOfLastMonth - monthsPerPage;
   const currentMonths = Object.keys(students[0]?.monthly_marks || {}).slice(indexOfFirstMonth, indexOfLastMonth);
 
   const next = () => {
     if (indexOfLastMonth < Object.keys(students[0]?.monthly_marks || {}).length) {
       setCurrentPage(currentPage + 1);
     }
   };
 
   const prev = () => {
     if (currentPage > 1) {
       setCurrentPage(currentPage - 1);
     }
   };

  return (
    <div className={styles.home}>
    {students.map((student, studentIndex) => (
      <div key={studentIndex} className={styles.studentDetails}>
        <div className={styles.topSection}>
          {student.image_link !== '' ? (
            <img src={student.image_link} alt="dp" />
          ) : (
            <img src={dp} alt="dp" />
          )}
          <div className={styles.studentInfo}>
            <p>
              {student.name} <span>{student.age}</span>
            </p>
            <p>
              {student.standard} <span>{student.division_name}</span>
            </p>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.markList}>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  {currentMonths.map(month => (
                    <th key={month}>{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSubjects.map((subject, index) => (
                  <tr key={index}>
                    <td className={styles.subjectDelete}>
                      {subject}
                    </td>
                    {currentMonths.map(month => (
                      <td key={month} className={styles.marktoEdit}>
                        {student.monthly_marks[month]?.[subject] || 'N/A'} 
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.pagination}>
          <button onClick={prev} disabled={currentPage === 1}>Prev</button>
          <button onClick={next} disabled={indexOfLastMonth >= Object.keys(students[0]?.monthly_marks || {}).length}>Next</button>
        </div>
      </div>
    ))}
  </div>
  )
}

export default StudentDashBoard