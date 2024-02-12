import React, { useState, useEffect } from 'react';
import styles from './AdminDashBoard.module.scss';
import dp from '../assets/2.jpg';

const AdminDashBoard = () => {
  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editCell, setEditCell] = useState({ studentIndex: -1, month: '', subject: '' });
  const monthsPerPage = 3;

  useEffect(() => {
    fetch('/Backend.json')
      .then(response => response.json())
      .then(data => {
        setStudents(data.students);
        let subjects = [];
        data.students.forEach(student => {
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
  }, []);

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

  const handleEdit = (studentIndex, month, subject) => {
    setEditCell({ studentIndex, month, subject });
  };

  const handleSave = (studentIndex, month, subject, newMarks) => {
    const updatedStudents = [...students];
    updatedStudents[studentIndex].monthly_marks[month][subject] = newMarks;
    setStudents(updatedStudents);
    setEditCell({ studentIndex: -1, month: '', subject: '' });
  };

  const handleDelete = (index, subject) => {
    const updatedStudents = [...students];

    // Remove subject from each student's monthly marks
    updatedStudents.forEach(student => {
      Object.keys(student.monthly_marks).forEach(month => {
        delete student.monthly_marks[month][subject];
      });
    });

    // Remove subject from allSubjects array
    const updatedAllSubjects = allSubjects.filter(sub => sub !== subject);

    setStudents(updatedStudents);
    setAllSubjects(updatedAllSubjects);
  };

  return (
    <div className={styles.home}>
      {students.map((student, index) => (
        <div key={index} className={styles.studentDetails}>
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
                  {allSubjects.map((subject, subjectIndex) => (
                    <tr key={subjectIndex}>
                      <td className={styles.subjectDelete}>
                        {subject}
                        <button className={styles.deleteBtn} onClick={() => handleDelete(index, subject)}>Delete</button>
                      </td>
                      {currentMonths.map(month => (
                        <td key={month} className={styles.marktoEdit}>
                          {student.monthly_marks[month]?.[subject] || 'N/A'}
                          {editCell.studentIndex === index && editCell.month === month && editCell.subject === subject ? (
                            <input type="text" defaultValue={student.monthly_marks[month]?.[subject]} onBlur={e => handleSave(index, month, subject, e.target.value)} />
                          ) : (
                            <button onClick={() => handleEdit(index, month, subject)}>Edit</button>
                          )}
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

export default AdminDashBoard;
