document.addEventListener('DOMContentLoaded', ()=> { 
    const studentsForm = document.querySelector('#student-form') 
    const studentsTable = document.querySelector('#students-table').getElementsByTagName('tbody')[0] 
 
 
 
    function findStudents() { 
        fetch('/students') 
            .then(response => response.json()) 
            .then(students => { 
                studentsTable.innerHTML = '' 
                students.forEach((student, index) => { 
                    const row = document.createElement('tr') 
                    row.innerHTML = ` 
                    <td>${student.name}</td> 
                    <td>${student.surname}</td> 
                    <td>${student.age}</td> 
                    <td>${student.course}</td> 
                    <td>${student.faculty}</td> 
                    <td>${student.subjects}</td> 
                    <td> 
                    <button>edit</button> 
                    <button>delete</button> 
                    </td> 
                    ` 
                    studentsTable.appendChild(row) 
                }) 
            }) 
 
 
    } 


    function addStudents(event) {
        event.preventDefault();
        const studentsData = {
            name: studentsForm.name.value,
            surname: studentsForm.surname.value,
            age: studentsForm.age.value,
            course: studentsForm.course.value,
            faculty: studentsForm.faculty.value,
            subjects: studentsForm.subjects.value
        }
        fetch('/students', {
            method: 'POST',
            headers: {
                'ContentType': 'application/json'
            },
            body: JSON.stringify(studentsData)
        }).then(() => {
            findStudents()
        })
    }

    studentsForm.addEventListener('submit', addStudents)

    findStudents()
})