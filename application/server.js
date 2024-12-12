
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;
const filePath = 'students.json';

// Middleware для парсингу JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Сервер статичних файлів
app.use(express.static('public'));

// Отримати всі записи про студентів
app.get('/students', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        const students = JSON.parse(data);
        res.json(students);
    });
});

// Додати нового студента
app.post('/students', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        const students = JSON.parse(data);
        students.push(req.body);
        fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing file');
            }
            res.send('Student added');
        });
    });
});

// Оновити студента
app.put('/students/:index', (req, res) => {
    console.log("Updating student at index:", req.params.index); // Add this line
    const index = req.params.index;
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        const students = JSON.parse(data);
        if (index < 0 || index >= students.length) {
            return res.status(404).send('Student not found'); // Add this check
        }
        students[index] = req.body;
        fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing file');
            }
            res.send('Student updated');
        });
    });
});


// Видалити студента
app.delete('/students/:index', (req, res) => {
    const index = req.params.index;
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        const students = JSON.parse(data);
        students.splice(index, 1);
        fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing file');
            }
            res.send('Student deleted');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});