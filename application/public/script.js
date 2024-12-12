document.addEventListener('DOMContentLoaded', () => {
    const studentsForm = document.querySelector('#student-form');
    const studentsTable = document.querySelector('#students-table').getElementsByTagName('tbody')[0];
    const editStudentForm = document.querySelector('#edit-student');
    const saveStudentButton = document.querySelector('#save');
    let currentIndex = null;
  
    function findStudents() {
      fetch('/students')
        .then((response) => response.json())
        .then((students) => {
          studentsTable.innerHTML = '';
          students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `  
                    <td>${student.name}</td>  
                    <td>${student.surname}</td>  
                    <td>${student.age}</td>  
                    <td>${student.course}</td>  
                    <td>${student.faculty}</td>  
                    <td>${student.subjects}</td>  
                    <td>  
                    <button onclick='editStudent(${index})'>edit</button>  
                    <button onclick='deleteStudent(${index})'>delete</button>  
                    </td>  
                    `;
            studentsTable.appendChild(row);
          });
        });
    }
  
    function addStudents(event) {
      event.preventDefault();
  
      const studentsData = {
        name: studentsForm.name.value,
        surname: studentsForm.surname.value,
        age: studentsForm.age.value,
        course: studentsForm.course.value,
        faculty: studentsForm.faculty.value,
        subjects: studentsForm.subjects.value, // This should be a string; we'll handle it as an array on the server
      };
  
      console.log('Sending student data:', studentsData); // Debug: Log the data being sent
  
      fetch('/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentsData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          return response.text();
        })
        .then((message) => {
          console.log('Server response:', message); // Debug: Log server response
          findStudents(); // Refresh the student list
        })
        .catch((error) => {
          console.error('Error adding student:', error); // Log client-side error
        });
    }
  
    window.editStudent = (index) => {
      fetch('/students')
        .then((response) => response.json())
        .then((students) => {
          const student = students[index];
          currentIndex = index;
          editStudentForm.style.display = 'block';
          document.getElementById('edit-name').value = student.name;
          document.getElementById('edit-surname').value = student.surname;
          document.getElementById('edit-age').value = student.age;
          document.getElementById('edit-course').value = student.course;
          document.getElementById('edit-faculty').value = student.faculty;
          document.getElementById('edit-subjects').value = student.subjects;
        });
    };
    saveStudentButton.addEventListener('click', (event) => {
      event.preventDefault();
      const updatedStudent = {
        name: document.getElementById('edit-name').value,
        surname: document.getElementById('edit-surname').value,
        age: document.getElementById('edit-age').value,
        course: document.getElementById('edit-course').value,
        faculty: document.getElementById('edit-faculty').value,
        subjects: document.getElementById('edit-subjects').value,
      };
  
      fetch(`/students/${currentIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent),
      })
        .then(() => {
          editStudentForm.style.display = 'none';
          findStudents();
        })
        .catch((error) => console.error('error saving student', error));
    });
  

    window.deleteStudent = (index) => {
        
        fetch(`/students/${index}`, {
            method: 'DELETE'
        })
        .then(() => findStudents())
        .catch(error => console.error('error deleting students', error))


    }
    studentsForm.addEventListener('submit', addStudents);
    findStudents();
});